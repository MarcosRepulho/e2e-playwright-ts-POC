export const apiClient = {
  async get(path: string, base = process.env.BASE_URL || 'http://localhost:3000') {
    const res = await fetch(`${base}${path}`);
    return res.json();
  },
};
