const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('civicconnect_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'OFFLINE', error: String(err) };
  }
}

export async function loginApi(email: string, password: String) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function registerApi(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function fetchComplaintsApi(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE_URL}/complaints${query}`, {
    headers: getHeaders(),
  });
  return await res.json();
}

export async function createComplaintApi(complaintData: any) {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(complaintData),
  });
  return await res.json();
}

export async function updateComplaintApi(id: string, patch: any) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patch),
  });
  return await res.json();
}

export async function reassignStaffApi(id: string, staffId: string, adminName?: string, reason?: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/reassign`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ staffId, adminName, reason }),
  });
  return await res.json();
}

export async function rerouteDepartmentApi(id: string, newDept: string, adminName?: string, reason?: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/reroute`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ newDept, adminName, reason }),
  });
  return await res.json();
}

export async function recalculatePrioritiesApi() {
  const res = await fetch(`${API_BASE_URL}/complaints/recalculate-priorities`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return await res.json();
}

export async function fetchStaffApi() {
  const res = await fetch(`${API_BASE_URL}/staff`, {
    headers: getHeaders(),
  });
  return await res.json();
}

export async function updateStaffStatusApi(staffId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/staff/${staffId}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return await res.json();
}

export async function fetchNotificationsApi() {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getHeaders(),
  });
  return await res.json();
}

export async function markNotificationsReadApi() {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  return await res.json();
}

export async function fetchAnalyticsApi() {
  const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
    headers: getHeaders(),
  });
  return await res.json();
}
