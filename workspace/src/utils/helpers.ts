export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateStoryId = (): string => {
  return 'story_' + Math.random().toString(36).substr(2, 9);
};

export const generateMessageId = (): string => {
  return 'msg_' + Math.random().toString(36).substr(2, 9);
};