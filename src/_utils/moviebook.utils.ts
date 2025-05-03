
export function extractYouTubeVideoID(url: string): string | null {
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

































const x='currentSession'
export function session(loginUser: any) {
  const payload = {
    user: loginUser,
    expiresAt: Date.now() + 30 * 60 * 1000 // 1 minute
  };
  localStorage.setItem(x, JSON.stringify(payload));
}

export function remove(){
  localStorage.removeItem(x)
}
export const userDataAPI=JSON.parse(localStorage.getItem(x) || '{}')
