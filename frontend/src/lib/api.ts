// src/lib/api.ts
export type SummaryOut = {
  total_courses: number;
  avg_rating: number;
  bestseller_rate: number;
  avg_price_usd: number;
};

export type DistOut = {
  rating_buckets: { bucket: string; count: number }[];
  category_share: { label: string; value: number }[];
  price_vs_rating: { price_band: string; avg_rating: number }[];
};

export type PredictIn = {
  price_vnd: number;
  rating: number;
  num_students: number;
  num_reviews: number;
  total_duration_minutes: number;
  discount_pct: number;  // 0–100
  lectures: number;
  sections: number;
};

export type PredictOut = {
  bestseller_probability: number; // 0..1
  confidence: 'low' | 'medium' | 'high';
  key_factors: string[];
};

export type RecommendOut = {
  goal: string;
  steps: {
    step: number;
    title: string;
    instructor: string;
    rating: number;
    hours: number;
    tags: string[];
    price: number;
    bestseller: boolean;
    url?: string | null;
  }[];
};

export type MineIn = { min_support?: number; max_len?: number; top_k?: number };
export type SequentialSuggestion = { course_id: string; course_title: string; count: number; confidence: number };

// Base URL: dev dùng proxy /api, prod đọc env
const BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return res.json() as Promise<T>;
}

// ---- Analytics
export const getSummary = () => request<SummaryOut>('/analytics/summary');
export const getDistributions = () => request<DistOut>('/analytics/distributions');
export const getShap = () => request<{ feature: string; importance: number }[]>('/analytics/shap');

// ---- Predict
export const postPredict = (body: PredictIn) =>
  request<PredictOut>('/predict', { method: 'POST', body: JSON.stringify(body) });

// ---- Recommend
export const postRecommend = (goal: string, top_k = 4) =>
  request<RecommendOut>('/recommend', {
    method: 'POST',
    body: JSON.stringify({ goal, top_k }),
  });

// ---- Sequential (tuỳ chọn)
export const postMine = (body: MineIn) =>
  request<{ patterns: { support: number; sequence: string[] }[] }>('/sequential/mine', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getNextByCourseId = (course_id: string, top_k = 5) =>
  request<{ suggestions: SequentialSuggestion[] }>(
    `/sequential/next?course_id=${encodeURIComponent(course_id)}&top_k=${top_k}`
  );
