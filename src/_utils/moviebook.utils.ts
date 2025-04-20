export function extractYouTubeVideoID(url: string): string {
  const regExp = /[?&]v=([^&#]*)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : '';
}

export function generateShowDates(days: number = 4): string[] {
  const today = new Date();
  const dates: string[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formatted = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    dates.push(formatted);
  }

  return dates;
}

export function getNextBookingId(): number {
  const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  return history.length ? history[history.length - 1].bookingId + 1 : 200;
}
