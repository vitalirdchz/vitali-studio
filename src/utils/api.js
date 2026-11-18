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
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API error: ${response.status}`);
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
  return fetchAPI(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteService(id) {
  return fetchAPI(`/services/${id}`, {
    method: 'DELETE',
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
  return fetchAPI(`/portfolio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePortfolioItem(id) {
  return fetchAPI(`/portfolio/${id}`, {
    method: 'DELETE',
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
  return fetchAPI(`/faq/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteFAQ(id) {
  return fetchAPI(`/faq/${id}`, {
    method: 'DELETE',
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
  return fetchAPI(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTestimonial(id) {
  return fetchAPI(`/testimonials/${id}`, {
    method: 'DELETE',
  });
}
