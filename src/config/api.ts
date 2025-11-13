export const API_URL = 'https://functions.poehali.dev/a4b59205-7698-4445-ad13-742d4899430e';

export const api = {
  async get(path: string) {
    const response = await fetch(`${API_URL}?path=${path}`);
    return response.json();
  },

  async post(path: string, data: any) {
    const response = await fetch(`${API_URL}?path=${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async put(path: string, data: any) {
    const response = await fetch(`${API_URL}?path=${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
