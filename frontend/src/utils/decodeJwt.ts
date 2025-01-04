export function getDecodedToken(): { exp: number; sub: string } | null {
  const token = sessionStorage.getItem('jwt');
  if (!token) {
    console.log("Token not found -- getDecodedToken")
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    console.log("Token decoded by getDecodedToken")
    if (payload.exp * 1000 > Date.now()) {
      return {exp: payload.exp, sub: payload.sub};
    } else {
      console.log("Token expired -- getDecodedToken")
      return null;
    }
  } catch {
    console.error("Token not decoded -- getDecodedToken")
    return null;
  } 
}