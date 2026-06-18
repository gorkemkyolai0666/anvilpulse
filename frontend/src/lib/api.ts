const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

function listRequest(endpoint: string, token: string, params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
  }
  const qs = query.toString();
  return request(`${endpoint}${qs ? `?${qs}` : ''}`, { token });
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      workshopName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  projects: {
    list: (token: string, params?: { page?: number; status?: string; clientName?: string }) =>
      listRequest('/projects', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/projects', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/projects/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/projects/${id}`, { method: 'DELETE', token }),
  },

  materials: {
    list: (token: string, params?: { page?: number; status?: string }) =>
      listRequest('/materials', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/materials', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/materials/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/materials/${id}`, { method: 'DELETE', token }),
  },

  siteVisits: {
    list: (token: string, params?: { page?: number; status?: string }) =>
      listRequest('/site-visits', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/site-visits', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/site-visits/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/site-visits/${id}`, { method: 'DELETE', token }),
  },

  welding: {
    list: (token: string, params?: { page?: number; status?: string }) =>
      listRequest('/welding', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/welding', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/welding/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/welding/${id}`, { method: 'DELETE', token }),
  },

  surfaceFinishes: {
    list: (token: string, params?: { page?: number; status?: string }) =>
      listRequest('/surface-finishes', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/surface-finishes', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/surface-finishes/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/surface-finishes/${id}`, { method: 'DELETE', token }),
  },

  workshop: {
    get: (token: string) => request('/workshop', { token }),
    update: (token: string, data: Record<string, unknown>) =>
      request('/workshop', { method: 'PATCH', body: data, token }),
  },
};

export { ApiError };
