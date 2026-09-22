import AsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "stonescan-fe353";
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
const FEEDBACK_QUEUE_KEY = "@stoneScan:feedback_queue";
const USER_PROFILE_PENDING_KEY = "@stoneScan:user_profile_pending";

// URLs base para as coleções
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const FIRESTORE_FEEDBACKS_URL = `${FIRESTORE_BASE_URL}/feedbacks`;
const FIRESTORE_USERS_URL = `${FIRESTORE_BASE_URL}/users`;

let isSyncing = false;

/**
 * Salva o perfil do usuário no Firestore (coleção users).
 * Usa PATCH idempotente com o ID do usuário.
 */
export const saveUserProfileToFirestore = async (profile) => {
  if (!profile || !profile.id) return false;

  const url = `${FIRESTORE_USERS_URL}/${profile.id}?key=${FIREBASE_API_KEY}`;

  const body = JSON.stringify({
    fields: {
      name: { stringValue: String(profile.name || '') },
      email: { stringValue: String(profile.email || '') },
      age: { integerValue: String(profile.age || 0) },
      gender: { stringValue: String(profile.gender || 'nao_informado') },
      isRockProfessional: { booleanValue: Boolean(profile.isRockProfessional) },
      createdAt: { timestampValue: profile.createdAt || new Date().toISOString() },
      updatedAt: { timestampValue: profile.updatedAt || new Date().toISOString() }
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
      console.error('[FB] Falha ao enviar perfil ao Firestore:', err.message);
    }
    return false;
  }
};

/**
 * Envia um feedback para o Firestore usando PATCH com ID fixo.
 * A operação é IDEMPOTENTE: se reenviado, atualiza o mesmo documento.
 */
const sendPayloadToFirestore = async (payload) => {
  const docId = payload.id;
  const url = `${FIRESTORE_FEEDBACKS_URL}/${docId}?key=${FIREBASE_API_KEY}`;

  const fields = {
    rockName: { stringValue: String(payload.rockName || 'Desconhecida') },
    feedback: { stringValue: String(payload.feedback || 'nao_informado') },
    confidence: { integerValue: String(payload.confidence != null ? payload.confidence : 0) },
    source: { stringValue: String(payload.source || 'camera') },
    createdAt: { timestampValue: payload.createdAt || new Date().toISOString() }
  };

  // Dados do usuário associados ao feedback
  if (payload.userId) {
    fields.userId = { stringValue: String(payload.userId) };
  }
  if (payload.userName) {
    fields.userName = { stringValue: String(payload.userName) };
  }
  if (payload.isRockProfessional !== null && payload.isRockProfessional !== undefined) {
    fields.isRockProfessional = { booleanValue: Boolean(payload.isRockProfessional) };
  }

  const body = JSON.stringify({ fields });

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

    await fetch(`${FIRESTORE_FEEDBACKS_URL}?pageSize=1&key=${FIREBASE_API_KEY}`, {
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
    // 1. Sincroniza perfil pendente se houver
    const pendingProfile = await AsyncStorage.getItem(USER_PROFILE_PENDING_KEY);
    if (pendingProfile) {
      try {
        const parsedProfile = JSON.parse(pendingProfile);
        const ok = await saveUserProfileToFirestore(parsedProfile);
        if (ok) {
          await AsyncStorage.removeItem(USER_PROFILE_PENDING_KEY);
        }
      } catch (profileErr) {
        console.error('[FB] Erro ao sincronizar perfil pendente:', profileErr.message);
      }
    }

    // 2. Sincroniza fila de feedbacks
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

export const sendFeedback = async ({ rockName, feedback, confidence, source, userProfile }) => {
  const item = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
    rockName,
    feedback,
    confidence,
    source,
    createdAt: new Date().toISOString(),
    userId: userProfile?.id || null,
    userName: userProfile?.name || null,
    isRockProfessional: userProfile?.isRockProfessional ?? null
  };

  // 1. Salva na fila local para garantia offline
  try {
    const rawQueue = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];
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
