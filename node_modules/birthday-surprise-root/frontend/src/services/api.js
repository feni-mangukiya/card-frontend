const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export const getHealth = () => apiRequest('/health');

export const createSpin = (sessionId, category) => apiRequest('/spins', {
  method: 'POST',
  body: JSON.stringify({ sessionId, category })
});

export const getSpinsBySession = (sessionId) => apiRequest(`/spins/${sessionId}`);

export const createFinalGift = (sessionId, selectedResult) => apiRequest('/final-gift', {
  method: 'POST',
  body: JSON.stringify({ sessionId, selectedResult })
});

export const getFinalGiftBySession = (sessionId) => apiRequest(`/final-gift/${sessionId}`);

export const getAdminStats = (adminKey) => apiRequest('/admin/stats', {
  headers: {
    'x-admin-key': adminKey
  }
});

export const getAdminSpins = (adminKey) => apiRequest('/admin/spins', {
  headers: {
    'x-admin-key': adminKey
  }
});

export const getAdminUsers = (adminKey) => apiRequest('/admin/users', {
  headers: {
    'x-admin-key': adminKey
  }
});

export const getAdminFinalGifts = (adminKey) => apiRequest('/admin/final-gifts', {
  headers: {
    'x-admin-key': adminKey
  }
});
