const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://card-backend-cuyg.onrender.com/api';
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/+$/, '')
  : `${configuredApiUrl.replace(/\/+$/, '')}/api`;

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
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const getHealth = () => apiRequest('/health');

export const createSpin = (sessionId, category) => apiRequest('/spins', {
  method: 'POST',
  body: JSON.stringify({ sessionId, category })
});

export const getSpinsBySession = async (sessionId) => {
  try {
    return await apiRequest(`/spins/${sessionId}`);
  } catch (error) {
    if (error.status === 404) {
      return { success: true, totalSpins: 0, remainingSpins: 2, results: [] };
    }

    throw error;
  }
};

export const createFinalGift = (sessionId, selectedResult) => apiRequest('/final-gift', {
  method: 'POST',
  body: JSON.stringify({ sessionId, selectedResult })
});

export const getFinalGiftBySession = async (sessionId) => {
  try {
    return await apiRequest(`/final-gift/${sessionId}`);
  } catch (error) {
    if (error.status === 404) {
      return { success: true, hasFinalGift: false, finalGift: null, results: [] };
    }

    throw error;
  }
};

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
