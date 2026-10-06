import * as jwt from 'jsonwebtoken';

export function extractUser(req?: any): any {
  if (!req) return null;
  if (req.user) return req.user;
  let token: string | null = null;
  if (req.cookies) {
    token = req.cookies['access_token'] || req.cookies['checkpoint_token'];
  }
  if (!token && req.headers) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') token = parts[1];
      else if (parts.length === 1 && !parts[0].includes(' ')) token = parts[0];
    }
    if (!token) token = req.headers['x-access-token'] as string;
  }
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
      return jwt.verify(token, secret);
    } catch (_) {}
  }
  return null;
}

export function idOrDocNoClean(val: string): string {
  return decodeURIComponent(val || '').trim();
}
