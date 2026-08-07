import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
});

export async function fetchApi(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}
