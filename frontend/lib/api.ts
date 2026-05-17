export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type CurrentUserResponse = {
  user: AuthUser;
};

export type JobRequest = {
  _id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  user?: string | { id?: string; _id?: string; name?: string; email?: string };
  acceptedUser?: string | { id?: string; _id?: string; name?: string; email?: string };
  status?: string;
  createdAt?: string;
};

export type JobRequestInput = {
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

export function loginUser(email: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(name: string, email: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function logoutUser() {
  return apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiRequest<CurrentUserResponse>("/api/auth/me");
}

export function getJobRequests() {
  return apiRequest<JobRequest[]>("/api/job");
}

export function searchJobRequests(keyword: string) {
  const params = new URLSearchParams({ keyword });
  return apiRequest<JobRequest[]>(`/api/job/search?${params.toString()}`);
}

export function getMyJobRequests() {
  return apiRequest<JobRequest[]>("/api/job/me");
}

export function getUserJobRequests() {
  return apiRequest<JobRequest[]>("/api/job/user");
}

export function getJobRequestById(id: string) {
  return apiRequest<JobRequest>(`/api/job/${id}`);
}

export function createJobRequest(input: JobRequestInput) {
  return apiRequest<JobRequest>("/api/job", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function acceptJobRequest(id: string) {
  return apiRequest<JobRequest>(`/api/job/${id}/accept`, {
    method: "POST",
  });
}

export function closeJobRequest(id: string) {
  return apiRequest<JobRequest>(`/api/job/${id}/close`, {
    method: "POST",
  });
}

export function deleteJobRequest(id: string) {
  return apiRequest<{ message: string }>(`/api/job/${id}`, {
    method: "DELETE",
  });
}