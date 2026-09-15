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

    await response.text();
    return response.ok;
  } catch (err) {
    console.error('[FB] Fetch falhou, tentando XHR:', err.message);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', FIRESTORE_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 15000;

      xhr.onload = () => {
        resolve(xhr.status >= 200 && xhr.status < 300);
      };

      xhr.onerror = () => {
        console.error('[FB] XHR erro ao enviar feedback');
        resolve(false);
      };

      xhr.ontimeout = () => {
        console.error('[FB] XHR timeout ao enviar feedback');
        resolve(false);
      };

      xhr.send(body);
    });
  }
};

export const warmupFirestore = async () => {
  try {
    await Promise.race([
      fetch('https://firestore.googleapis.com/v1/projects/stonescan-fe353/databases/(default)/documents/feedbacks?pageSize=1&key=' + FIREBASE_API_KEY, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('WARMUP_TIMEOUT_10S')), 10000)
      )
    ]);
  } catch {
    // Warmup silencioso — sem conexão no momento, sync será feito depois
  }
};

export const syncPendingFeedbacks = async () => {
  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    if (!rawQueue) return;

    const queue = JSON.parse(rawQueue);
    if (!Array.isArray(queue) || queue.length === 0) return;

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
    console.error('[FB] Erro ao sincronizar fila pendente:', error.message);
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
    console.error('[FB] Erro ao salvar na fila local:', storageError.message);
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
