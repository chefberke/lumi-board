export interface User {
  id?: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function setUser(userData: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const user = getUser();
  return user !== null;
}

export async function logout() {
  if (typeof window !== 'undefined') {
    removeUser();
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}


