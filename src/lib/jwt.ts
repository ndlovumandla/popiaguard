import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
export interface TokenPayload extends JWTPayload { userId: string; orgId: string; email: string; role: string; }
const enc = (s: string) => new TextEncoder().encode(s);
const access = enc(process.env.JWT_ACCESS_SECRET || 'dev-access-secret-min-32-chars!!');
const refresh = enc(process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-min-32-chars!');
export const signAccessToken = (p: Omit<TokenPayload,'iat'|'exp'>) =>
  new SignJWT(p as JWTPayload).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('15m').sign(access);
export const signRefreshToken = (p: Omit<TokenPayload,'iat'|'exp'>) =>
  new SignJWT(p as JWTPayload).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(refresh);
export const verifyAccessToken = async (t: string) => { const {payload} = await jwtVerify(t, access); return payload as TokenPayload; };
export const verifyRefreshToken = async (t: string) => { const {payload} = await jwtVerify(t, refresh); return payload as TokenPayload; };
