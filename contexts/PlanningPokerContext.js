import { createContext, useContext, useReducer, useEffect } from 'react';
import { ref, onValue, set, push, remove, serverTimestamp } from 'firebase/database';
import { database } from '../lib/firebase';
import { 
  generateUserId, 
  getUserName, 
  setUserName, 
  allParticipantsVoted,
  generateTicketId 
} from '../lib/utils';

const PlanningPokerContext = createContext();

const initialState = {
  userId: null,
  userName: '',
  participants: {},
  currentTicket: null,
  votes: {},
  revealed: false,
  loading: true,
  error: null
};

function planningPokerReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
        loading: false
      };
    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.participants
      };
    case 'SET_CURRENT_TICKET':
      return {
        ...state,
        currentTicket: action.ticket
      };
    case 'SET_VOTES':
      return {
        ...state,
        votes: action.votes
      };
    case 'SET_REVEALED':
      return {
        ...state,
        revealed: action.revealed
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
}

export function PlanningPokerProvider({ children }) {
  const [state, dispatch] = useReducer(planningPokerReducer, initialState);

  // Initialize user
  useEffect(() => {
    try {
      const userId = generateUserId();
      const userName = getUserName();
      
      dispatch({ 
        type: 'SET_USER', 
        userId, 
        userName 
      });
    } catch (error) {
      console.error('User initialization error:', error);
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  }, []);

  // Firebase listeners with timeout fallback
  useEffect(() => {
    if (!state.userId) return;

    const unsubscribers = [];
    
    // Set a timeout to ensure app loads even if Firebase fails
    const connectionTimeout = setTimeout(() => {
      console.warn('Firebase connection timeout - app will work in local-only mode');
      dispatch({ type: 'SET_LOADING', loading: false });
    }, 2000); // Shorter timeout for better UX

    try {
      // Listen to participants
      const participantsRef = ref(database, 'session/participants');
      const participantsUnsub = onValue(participantsRef, (snapshot) => {
        clearTimeout(connectionTimeout);
        const participants = snapshot.val() || {};
        dispatch({ type: 'SET_PARTICIPANTS', participants });
        dispatch({ type: 'SET_LOADING', loading: false });
      }, (error) => {
        console.error('Participants listener error:', error);
        clearTimeout(connectionTimeout);
        dispatch({ type: 'SET_LOADING', loading: false });
      });
      unsubscribers.push(participantsUnsub);

      // Listen to current ticket
      const currentTicketRef = ref(database, 'session/currentTicket');
      const currentTicketUnsub = onValue(currentTicketRef, (snapshot) => {
        const ticket = snapshot.val();
        dispatch({ type: 'SET_CURRENT_TICKET', ticket });
      }, (error) => {
        console.error('Current ticket listener error:', error);
      });
      unsubscribers.push(currentTicketUnsub);

      // Listen to votes for current round
      const votesRef = ref(database, 'session/votes');
      const votesUnsub = onValue(votesRef, (snapshot) => {
        const votes = snapshot.val() || {};
        dispatch({ type: 'SET_VOTES', votes });
      }, (error) => {
        console.error('Votes listener error:', error);
      });
      unsubscribers.push(votesUnsub);

      // Listen to revealed status
      const revealedRef = ref(database, 'session/revealed/current-round');
      const revealedUnsub = onValue(revealedRef, (snapshot) => {
        const revealed = snapshot.val() || false;
        dispatch({ type: 'SET_REVEALED', revealed });
      }, (error) => {
        console.error('Revealed listener error:', error);
      });
      unsubscribers.push(revealedUnsub);

    } catch (error) {
      console.error('Firebase setup error:', error);
      clearTimeout(connectionTimeout);
      dispatch({ type: 'SET_LOADING', loading: false });
    }

    return () => {
      clearTimeout(connectionTimeout);
      unsubscribers.forEach(unsub => {
        try {
          unsub();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });
    };
  }, [state.userId, state.currentTicket?.id]);

  // Auto-reveal when all voted
  useEffect(() => {
    const currentRoundVotes = state.votes['current-round'] || {};
    if (!state.revealed && 
        Object.keys(state.participants).length > 0 &&
        allParticipantsVoted(state.participants, currentRoundVotes)) {
      
      console.log('All participants have voted, revealing in 500ms...');
      setTimeout(() => {
        revealVotes();
      }, 500); // Small delay for better UX
    }
  }, [state.participants, state.votes, state.revealed]);

  // Actions
  const joinSession = async (name) => {
    try {
      setUserName(name);
      
      // Update local state immediately
      dispatch({ 
        type: 'SET_USER', 
        userId: state.userId, 
        userName: name 
      });

      // For local testing, also add to participants immediately
      const newParticipants = { ...state.participants };
      newParticipants[state.userId] = { name, lastSeen: Date.now() };
      dispatch({ type: 'SET_PARTICIPANTS', participants: newParticipants });

      // Try to sync with Firebase, but don't fail if it doesn't work
      try {
        const userRef = ref(database, `session/participants/${state.userId}`);
        await set(userRef, {
          name,
          lastSeen: serverTimestamp()
        });
        console.log('Successfully synced with Firebase');
      } catch (firebaseError) {
        console.warn('Firebase sync failed, continuing in offline mode:', firebaseError);
      }
    } catch (error) {
      console.error('Join session error:', error);
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  };

  const addTicket = async (ticketData) => {
    try {
      const ticketId = generateTicketId();
      const ticket = {
        id: ticketId,
        ...ticketData,
        createdAt: serverTimestamp()
      };

      const ticketRef = ref(database, `session/tickets/${ticketId}`);
      await set(ticketRef, ticket);

      // Set as current ticket if no current ticket
      if (!state.currentTicket) {
        const currentTicketRef = ref(database, 'session/currentTicket');
        await set(currentTicketRef, ticket);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  };

  const submitVote = async (value) => {
    console.log('=== SUBMIT VOTE DEBUG ===');
    console.log('Submitting vote:', value, 'for user:', state.userId, 'userName:', state.userName);
    console.log('Current state:', { participants: state.participants, votes: state.votes });
    
    // Ensure current user is in participants list before voting
    const updatedParticipants = { ...state.participants };
    if (!updatedParticipants[state.userId] && state.userName) {
      updatedParticipants[state.userId] = { 
        name: state.userName, 
        lastSeen: Date.now() 
      };
      dispatch({ type: 'SET_PARTICIPANTS', participants: updatedParticipants });
      console.log('Added current user to participants:', updatedParticipants);
    }
    
    // Always update local state immediately for better UX
    const newVotes = { ...state.votes };
    if (!newVotes['current-round']) newVotes['current-round'] = {};
    newVotes['current-round'][state.userId] = { value, timestamp: Date.now() };
    console.log('Updated votes (local):', newVotes);
    dispatch({ type: 'SET_VOTES', votes: newVotes });
    
    // Try to sync with Firebase but don't block the UI
    try {
      const voteRef = ref(database, `session/votes/current-round/${state.userId}`);
      await set(voteRef, {
        value,
        timestamp: serverTimestamp()
      });
      console.log('Vote submitted successfully to Firebase');
    } catch (error) {
      console.error('Firebase sync failed for vote:', error);
      // Local state is already updated, so this is just a warning
    }
  };

  const revealVotes = async () => {
    console.log('Revealing votes...');
    
    // Always update local state immediately
    dispatch({ type: 'SET_REVEALED', revealed: true });
    console.log('Local state updated - votes revealed');
    
    // Try to sync with Firebase in background
    try {
      const revealedRef = ref(database, 'session/revealed/current-round');
      await set(revealedRef, true);
      console.log('Firebase updated - votes revealed');
    } catch (error) {
      console.error('Firebase sync failed for reveal:', error);
      // Local state is already updated, so this is just a warning
    }
  };

  const startNewRound = async () => {
    console.log('Starting new round...');
    
    // Always clear local state immediately
    const clearedVotes = { ...state.votes };
    delete clearedVotes['current-round'];
    dispatch({ type: 'SET_VOTES', votes: clearedVotes });
    dispatch({ type: 'SET_REVEALED', revealed: false });
    
    console.log('Local state cleared for new round');
    
    // Try to sync with Firebase in background
    try {
      const votesRef = ref(database, 'session/votes/current-round');
      const revealedRef = ref(database, 'session/revealed/current-round');
      
      await Promise.all([
        remove(votesRef),
        remove(revealedRef)
      ]);
      console.log('Firebase cleared for new round');
    } catch (error) {
      console.error('Firebase sync failed for new round:', error);
      // Local state is already cleared, so this is just a warning
    }
  };

  const nextTicket = async () => {
    try {
      // For now, just clear current ticket (in a real app, you'd cycle through tickets)
      const currentTicketRef = ref(database, 'session/currentTicket');
      await remove(currentTicketRef);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  };



  const value = {
    ...state,
    joinSession,
    addTicket,
    submitVote,
    revealVotes,
    startNewRound,
    nextTicket
  };

  return (
    <PlanningPokerContext.Provider value={value}>
      {children}
    </PlanningPokerContext.Provider>
  );
}

export const usePlanningPoker = () => {
  const context = useContext(PlanningPokerContext);
  if (!context) {
    throw new Error('usePlanningPoker must be used within a PlanningPokerProvider');
  }
  return context;
}; 