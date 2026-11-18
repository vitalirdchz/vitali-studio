const BASE_URL = '/.netlify/functions';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('vitali_admin_token');
  if (token) {
    headers['x-admin-code'] = token;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    const errorMessage = errorData.error || errorData.message || `Erreur API (${response.status})`;
    console.error(`[API Error ${response.status}] ${endpoint}:`, errorMessage, errorData);
    throw new Error(errorMessage);
  }

  return response.json();
}

// ── Public endpoints ──────────────────────────────────────────────

export function getServices() {
  return fetchAPI('/services');
}

export function getPortfolio() {
  return fetchAPI('/portfolio?category=portfolio');
}

export function getCreations() {
  return fetchAPI('/portfolio?category=creation');
}

export function getFAQ() {
  return fetchAPI('/faq');
}

export function getTestimonials() {
  return fetchAPI('/testimonials');
}

export function getSettings() {
  return fetchAPI('/settings');
}

export function updateSettings(data) {
  return fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Auth ──────────────────────────────────────────────────────────

export function adminLogin(code) {
  return fetchAPI('/auth-check', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// ── Services CRUD ─────────────────────────────────────────────────

export function createService(data) {
  return fetchAPI('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateService(id, data) {
  return fetchAPI(`/services?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteService(id) {
  return fetchAPI(`/services?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Portfolio CRUD ────────────────────────────────────────────────

export function createPortfolioItem(data) {
  return fetchAPI('/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePortfolioItem(id, data) {
  return fetchAPI(`/portfolio?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deletePortfolioItem(id) {
  return fetchAPI(`/portfolio?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── FAQ CRUD ──────────────────────────────────────────────────────

export function createFAQ(data) {
  return fetchAPI('/faq', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateFAQ(id, data) {
  return fetchAPI(`/faq?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteFAQ(id) {
  return fetchAPI(`/faq?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Testimonials CRUD ─────────────────────────────────────────────

export function createTestimonial(data) {
  return fetchAPI('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTestimonial(id, data) {
  return fetchAPI(`/testimonials?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteTestimonial(id) {
  return fetchAPI(`/testimonials?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}
