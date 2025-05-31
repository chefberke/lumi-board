import { API_URL } from "@/lib/config";

interface SignUpData {
  email: string;
  password: string;
  username: string;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  const response = await fetch(`${API_URL}/api/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error');
  }

  return response.json();
}

export async function signIn(data: SignInData) {
  const response = await fetch(`${API_URL}/api/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error');
  }

  return response.json();
}
