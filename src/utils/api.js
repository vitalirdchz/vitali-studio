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

export function getLabo() {
  return fetchAPI('/portfolio?category=labo');
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

// ── Projects (Domaines Bento) CRUD ────────────────────────────────

export function getProjects() {
  return fetchAPI('/projects');
}

export function createProject(data) {
  return fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProject(id, data) {
  return fetchAPI(`/projects?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteProject(id) {
  return fetchAPI(`/projects?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Realisations (Démonstrations 9:16) CRUD ───────────────────────

export function getRealisations(category) {
  const query = category && category !== 'Tous' ? `?category=${encodeURIComponent(category)}` : '';
  return fetchAPI(`/realisations${query}`);
}

export function createRealisation(data) {
  return fetchAPI('/realisations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRealisation(id, data) {
  return fetchAPI(`/realisations?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteRealisation(id) {
  return fetchAPI(`/realisations?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
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

// ── Service Proposals (Propositions clients) ──────────────────────

export function createServiceProposal(data) {
  return fetchAPI('/service-proposals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getServiceProposals() {
  return fetchAPI('/service-proposals');
}

export function updateServiceProposal(id, data) {
  return fetchAPI(`/service-proposals?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteServiceProposal(id) {
  return fetchAPI(`/service-proposals?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Clipping Config (Packs, Options, Conseils) ────────────────────

export function getClippingConfig() {
  return fetchAPI('/clipping-config');
}

export function updateClippingConfig(data) {
  return fetchAPI('/clipping-config', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Clipping Packs CRUD (MongoDB) ─────────────────────────────────

export function getClippingPacks() {
  return fetchAPI('/clipping-packs');
}

export function createClippingPack(data) {
  return fetchAPI('/clipping-packs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClippingPack(id, data) {
  return fetchAPI(`/clipping-packs?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteClippingPack(id) {
  return fetchAPI(`/clipping-packs?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Clipping Options CRUD (MongoDB) ───────────────────────────────

export function getClippingOptions() {
  return fetchAPI('/clipping-options');
}

export function createClippingOption(data) {
  return fetchAPI('/clipping-options', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClippingOption(id, data) {
  return fetchAPI(`/clipping-options?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteClippingOption(id) {
  return fetchAPI(`/clipping-options?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Contact Messages CRUD (MongoDB) ───────────────────────────────

export function createContactMessage(data) {
  return fetchAPI('/contact-messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getContactMessages() {
  return fetchAPI('/contact-messages');
}

export function updateContactMessage(id, data) {
  return fetchAPI(`/contact-messages?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id }),
  });
}

export function deleteContactMessage(id) {
  return fetchAPI(`/contact-messages?id=${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// ── Admin Notifications (Unread counts) ───────────────────────────

export function getUnreadCounts() {
  return fetchAPI('/unread-counts');
}
