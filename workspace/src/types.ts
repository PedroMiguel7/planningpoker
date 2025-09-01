export interface User {
  id: string;
  name: string;
  isModerator: boolean;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  participants: User[];
  currentStory?: Story;
  votingActive: boolean;
  votesRevealed: boolean;
}

export interface Story {
  id: string;
  title: string;
  description?: string;
  votes: Vote[];
  finalEstimate?: string;
}

export interface Vote {
  userId: string;
  userName: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export const POKER_DECK = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?'];