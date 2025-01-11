// utils/getStatus.js
export const getStatus = () => {
  const now = new Date();
  const day = now.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, ..., 6: Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Check if the restaurant is closed
  if (day === 0 || day === 1) return "CLOSED, open Tuesday 11am"; // Sunday or Monday
  
  // Check lunch and dinner hours
  if (day >= 2 && day <= 5) { // Tuesday - Friday
    if (hours >= 11 && hours < 14) return "OPEN NOW - Lunch, 11am-2pm "; // Lunch hours
    if (hours >= 14 && hours < 16) return "CLOSED, open for dinner 4pm"; // Closed between lunch and dinner
    if (hours >= 16 && hours < 20) return "OPEN NOW - Dinner, 4pm-8pm"; // Dinner hours
  }

  if (day <= 6) { // Tuesday - Saturday
    if (hours < 16) return "CLOSED, open for dinner 4pm"; // Closed before
    if (hours >= 16 && hours < 20) return "OPEN NOW - Dinner, 4pm-8pm"; // Dinner hours
  }

  return "CLOSED"; // Default case
};