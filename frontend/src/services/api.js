const BASE_URL = 'http://127.0.0.1:8000/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend offline');
    return await res.json();
  } catch (err) {
    console.warn('Backend health check failed:', err);
    return { status: 'offline', rag_stats: { total_documents: 0 } };
  }
}

export async function uploadStudyDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${BASE_URL}/upload-document`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Document upload failed');
  }
  return await res.json();
}

export async function fetchIndexedDocuments() {
  try {
    const res = await fetch(`${BASE_URL}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return await res.json();
  } catch (err) {
    return { documents: [], stats: { total_documents: 0 } };
  }
}

export async function queryRAGChat(query, top_k = 3, apiKey = '') {
  const res = await fetch(`${BASE_URL}/rag-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k, api_key: apiKey })
  });
  if (!res.ok) throw new Error('RAG query failed');
  return await res.json();
}

export async function getProctorCoaching(distractionCount, focusMinutes, streak) {
  const res = await fetch(`${BASE_URL}/proctor-coaching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      distraction_count: distractionCount,
      focus_minutes: focusMinutes,
      streak: streak
    })
  });
  if (!res.ok) throw new Error('Failed to get coaching');
  return await res.json();
}

export async function generateInteractiveQuiz(topic) {
  const res = await fetch(`${BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  if (!res.ok) throw new Error('Failed to generate quiz');
  return await res.json();
}
