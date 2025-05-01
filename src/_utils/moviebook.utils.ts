// export function extractYouTubeVideoID(url: string): string {
//   const regExp = /[?&]v=([^&#]*)/;
//   const match = url.match(regExp);
//   return match && match[1] ? match[1] : '';
// }

// export function extractYouTubeVideoID(url: string): string {
//   if (!url) return '';
  
//   // Standard YouTube URL patterns
//   const patterns = [
//     // Regular URL with v= parameter
//     /[?&]v=([^&#]*)/,
//     // youtu.be short URLs
//     /youtu\.be\/([^&#]*)/,
//     // YouTube embed URLs
//     /embed\/([^&#]*)/,
//     // YouTube shorts URLs
//     /shorts\/([^&#]*)/,
//     // YouTube live URLs
//     /live\/([^&#]*)/
//   ];

//   for (const pattern of patterns) {
//     const match = url.match(pattern);
//     if (match && match[1]) {
//       // Additional validation to ensure it's a proper YouTube ID
//       if (/^[a-zA-Z0-9_-]{11}$/.test(match[1])) {
//         return match[1];
//       }
//     }
//   }

//   return '';
// }
export function extractYouTubeVideoID(url: string): string | null {
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
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

