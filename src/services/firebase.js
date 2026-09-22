import AsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_PROJECT_ID = "stonescan-fe353";
const FIREBASE_API_KEY = "AIzaSy_REPLACED_SECRET_KEY";
const FEEDBACK_QUEUE_KEY = "@stoneScan:feedback_queue";

// URL base para documentos da coleção feedbacks
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/feedbacks`;

let isSyncing = false;

/**
 * Envia um feedback para o Firestore usando PATCH com ID fixo.
 * A operação é IDEMPOTENTE: se a requisição for reenviada (ex: retry de fila),
 * o Firestore sobrescreve o mesmo documento em vez de criar um duplicado.
 */
const sendPayloadToFirestore = async (payload) => {
  const docId = payload.id;
  const url = `${FIRESTORE_BASE_URL}/${docId}?key=${FIREBASE_API_KEY}`;

  const body = JSON.stringify({
    fields: {
      rockName: { stringValue: String(payload.rockName || 'Desconhecida') },
      feedback: { stringValue: String(payload.feedback || 'nao_informado') },
      confidence: { integerValue: String(payload.confidence != null ? payload.confidence : 0) },
      source: { stringValue: String(payload.source || 'camera') },
      createdAt: { timestampValue: payload.createdAt || new Date().toISOString() }
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name !== 'AbortError') {
      console.error('[FB] Falha na conexao com Firestore:', err.message);
    }
    return false;
  }
};

export const warmupFirestore = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    await fetch(`${FIRESTORE_BASE_URL}?pageSize=1&key=${FIREBASE_API_KEY}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
  } catch {
    // Warmup silencioso — offline temporário
  }
};

export const syncPendingFeedbacks = async () => {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    if (!rawQueue) {
      isSyncing = false;
      return;
    }

    const queue = JSON.parse(rawQueue);
    if (!Array.isArray(queue) || queue.length === 0) {
      isSyncing = false;
      return;
    }

    const remaining = [];
    for (const item of queue) {
      const ok = await sendPayloadToFirestore(item);
      if (!ok) {
        remaining.push(item);
      }
    }

    if (remaining.length > 0) {
      await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(FEEDBACK_QUEUE_KEY);
    }
  } catch (error) {
    console.error('[FB] Erro ao sincronizar fila pendente:', error.message);
  } finally {
    isSyncing = false;
  }
};

export const sendFeedback = async ({ rockName, feedback, confidence, source }) => {
  const item = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
    rockName,
    feedback,
    confidence,
    source,
    createdAt: new Date().toISOString()
  };

  // 1. Salva na fila local para garantia offline
  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];
    // Evita duplicar o mesmo item na própria fila
    if (!queue.some(q => q.id === item.id)) {
      queue.push(item);
      await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (storageError) {
    console.error('[FB] Erro ao salvar na fila local:', storageError.message);
  }

  // 2. Tenta enviar para o Firestore
  const ok = await sendPayloadToFirestore(item);

  // 3. Se enviado com sucesso, remove da fila local
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

  return ok;
};
