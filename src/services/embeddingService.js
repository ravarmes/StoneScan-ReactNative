/**
 * Embedding-based Out-of-Domain (OOD) Detection Service
 * ======================================================
 *
 * Uses the 512-d embedding from the ResNet backbone's penultimate layer
 * (avgpool) to verify whether an input image belongs to the rock domain.
 *
 * The model outputs a concatenated tensor: [embedding(512) | logits(N)].
 * We slice out the embedding, compute cosine similarity against
 * pre-computed class centroids, and flag images that fall below the
 * threshold as "out of domain".
 */

import rockCentroids from '../../assets/rock_centroids.json';

const EMBEDDING_DIM = 512;

/**
 * Compute cosine similarity between two vectors.
 * Both vectors should already be Float32Array or plain arrays.
 */
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

/**
 * L2-normalize a vector in-place and return it.
 */
function l2Normalize(vec) {
  let norm = 0;
  for (let i = 0; i < vec.length; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] /= norm;
    }
  }
  return vec;
}

/**
 * Check whether a model output is within the rock domain.
 *
 * @param {Float32Array|number[]} modelOutput - The full concatenated
 *   output from the dual-output model [embedding(512) | logits(N)].
 * @returns {{ inDomain: boolean, maxSimilarity: number, bestClass: string }}
 */
export function checkDomain(modelOutput) {
  // Extract the 512-d embedding (first 512 values)
  const rawEmbedding = Array.from(modelOutput).slice(0, EMBEDDING_DIM);
  const embedding = l2Normalize(rawEmbedding);

  const centroids = rockCentroids.centroids;
  const classes = rockCentroids.classes;
  const threshold = rockCentroids.threshold;

  let maxSimilarity = -1;
  let bestClassIdx = 0;

  for (let i = 0; i < centroids.length; i++) {
    const sim = cosineSimilarity(embedding, centroids[i]);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      bestClassIdx = i;
    }
  }

  return {
    inDomain: maxSimilarity >= threshold,
    maxSimilarity: maxSimilarity,
    bestClass: classes[bestClassIdx],
    threshold: threshold,
  };
}

/**
 * Extract classification logits from the model output.
 *
 * @param {Float32Array|number[]} modelOutput - Full concatenated output.
 * @returns {number[]} The logits portion (after the embedding).
 */
export function extractLogits(modelOutput) {
  return Array.from(modelOutput).slice(EMBEDDING_DIM);
}

export default { checkDomain, extractLogits };
