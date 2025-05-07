export function formatDateToYYYYMMDD(dateStr: string): string {
    if (!dateStr) return '';
    
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }

  export function formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
   
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
   
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  }

  export function validateShowTimes(showList: any,isEdit: boolean): boolean {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; 
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const futureDate=new Date("2025-05-31").toISOString().split('T')[0]
  

    for (const show of showList) {
      if (!show.showDate || !show.showTime) continue;
  
      const showDate = formatDateToYYYYMMDD(show.showDate);
  
  
      const timeMatch = show.showTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!timeMatch) {
        alert(`Invalid time format for show: ${show.showTime}. Please use format like "10:00 AM"`);
        return false;
      }
  
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3]?.toUpperCase();
  
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
  
    
      if (!isEdit) {
        if (showDate < currentDate ||showDate>futureDate) {
          alert(`Show date ${show.showDate} is in the past. Please select a future date.`);
          return false;
        } else if (showDate === currentDate) {
          if (hours < currentHours || (hours === currentHours && minutes < currentMinutes)) {
            alert(`Show time ${show.showTime} is in the past for today. Please select a future time.`);
            return false;
          }
        }
      }
  
 
      for (const existingShow of showList) {
        if (existingShow === show) continue; 
  
        const existingShowDate = formatDateToYYYYMMDD(existingShow.showDate);
        const existingShowTime = existingShow.showTime.trim();

        if (existingShowDate === showDate && existingShowTime === show.showTime) {
          alert(`A show is already scheduled for this time (${show.showTime}) on this date (${showDate}). Please select a different time.`);
          return false;
        }
      }
    }
  
    return true;
  }
