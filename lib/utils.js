import { v4 as uuidv4 } from 'uuid';

// Planning poker card values
export const POKER_CARDS = [
  { value: 0, display: '0' },
  { value: 1, display: '1' },
  { value: 2, display: '2' },
  { value: 3, display: '3' },
  { value: 5, display: '5' },
  { value: 8, display: '8' },
  { value: 13, display: '13' },
  { value: 21, display: '21' },
  { value: 34, display: '34' },
  { value: 55, display: '55' },
  { value: 89, display: '89' },
  { value: '?', display: '?' },
  { value: 'coffee', display: '☕' }
];

// Generate unique user ID
export const generateUserId = () => {
  let userId = localStorage.getItem('planning-poker-user-id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('planning-poker-user-id', userId);
  }
  return userId;
};

// Get/Set user name
export const getUserName = () => {
  return localStorage.getItem('planning-poker-user-name') || '';
};

export const setUserName = (name) => {
  localStorage.setItem('planning-poker-user-name', name);
};

// Calculate vote average (excluding non-numeric votes)
export const calculateAverage = (votes) => {
  const numericVotes = Object.values(votes)
    .map(vote => vote.value)
    .filter(value => typeof value === 'number');
  
  if (numericVotes.length === 0) return 0;
  
  const sum = numericVotes.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / numericVotes.length) * 100) / 100;
};

// Check if all participants have voted
export const allParticipantsVoted = (participants, votes) => {
  const participantIds = Object.keys(participants);
  const voterIds = Object.keys(votes || {});
  
  return participantIds.length > 0 && 
         participantIds.every(id => voterIds.includes(id));
};

// Generate ticket ID
export const generateTicketId = () => `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Format timestamp
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
}; 