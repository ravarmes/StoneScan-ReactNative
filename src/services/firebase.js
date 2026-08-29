import AsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_PROJECT_ID = "stonescan-fe353";
const FIREBASE_API_KEY = "AIzaSy_REPLACED_SECRET_KEY";
const FEEDBACK_QUEUE_KEY = "@stoneScan:feedback_queue";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/feedbacks?key=${FIREBASE_API_KEY}`;

const sendPayloadToFirestore = async (payload) => {
  const body = JSON.stringify({
    fields: {
      rockName: { stringValue: String(payload.rockName || 'Desconhecida') },
      feedback: { stringValue: String(payload.feedback || 'nao_informado') },
      confidence: { integerValue: String(payload.confidence != null ? payload.confidence : 0) },
      source: { stringValue: String(payload.source || 'camera') },
      createdAt: { timestampValue: payload.createdAt || new Date().toISOString() }
    }
  });

  console.log('[FB] Enviando:', payload.rockName, payload.feedback);

  try {
    const response = await Promise.race([
      fetch(FIRESTORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_15S')), 15000)
      )
    ]);

    const text = await response.text();
    console.log('[FB] Status:', response.status, 'Body:', text.substring(0, 150));
    return response.ok;
  } catch (err) {
    console.log('[FB] Erro:', err.name, err.message);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', FIRESTORE_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 15000;

      xhr.onreadystatechange = () => {
        console.log('[FB-XHR] readyState:', xhr.readyState, 'status:', xhr.status);
      };

      xhr.onload = () => {
        console.log('[FB-XHR] OK status:', xhr.status);
        resolve(xhr.status >= 200 && xhr.status < 300);
      };

      xhr.onerror = () => {
        console.log('[FB-XHR] onerror readyState:', xhr.readyState, 'status:', xhr.status);
        resolve(false);
      };

      xhr.ontimeout = () => {
        console.log('[FB-XHR] timeout');
        resolve(false);
      };

      xhr.send(body);
    });
  }
};

export const warmupFirestore = async () => {
  console.log('[FB] Testando conectividade...');
  try {
    const testResp = await Promise.race([
      fetch('https://firestore.googleapis.com/v1/projects/stonescan-fe353/databases/(default)/documents/feedbacks?pageSize=1&key=' + FIREBASE_API_KEY, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('WARMUP_TIMEOUT_10S')), 10000)
      )
    ]);
    console.log('[FB] Warmup status:', testResp.status);
  } catch (err) {
    console.log('[FB] Warmup erro:', err.message);
  }
};

export const syncPendingFeedbacks = async () => {
  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    if (!rawQueue) return;

    const queue = JSON.parse(rawQueue);
    if (!Array.isArray(queue) || queue.length === 0) return;

    console.log('[FB] Sincronizando', queue.length, 'pendente(s)...');
    const remaining = [];
    for (const item of queue) {
      const ok = await sendPayloadToFirestore(item);
      if (!ok) remaining.push(item);
    }

    if (remaining.length > 0) {
      await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(FEEDBACK_QUEUE_KEY);
    }
  } catch (error) {
    console.log('[FB] Erro ao sincronizar fila:', error.message);
  }
};

export const sendFeedback = async ({ rockName, feedback, confidence, source }) => {
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    rockName,
    feedback,
    confidence,
    source,
    createdAt: new Date().toISOString()
  };

  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];
    queue.push(item);
    await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(queue));
  } catch (storageError) {
    console.log('[FB] Erro salvar fila:', storageError.message);
  }

  const ok = await sendPayloadToFirestore(item);
  if (ok) {
    try {
      const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
      if (rawQueue) {
        const queue = JSON.parse(rawQueue);
        const updated = queue.filter(q => q.id !== item.id);
        if (updated.length > 0) {
          await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(updated));
        } else {
          await AsyncStorage.removeItem(FEEDBACK_QUEUE_KEY);
        }
      }
    } catch (_) {}
  }

  return true;
};
