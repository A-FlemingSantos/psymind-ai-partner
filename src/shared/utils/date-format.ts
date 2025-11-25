export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Agora';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays === 1) {
    return 'Ontem';
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    return dateObj.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
};