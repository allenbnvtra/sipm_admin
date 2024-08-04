import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) {
      return true;
    }
    const now = Date.now().valueOf() / 1000;
    // console.log(decoded.exp < now);
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
};
