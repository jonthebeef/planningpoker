import { usePlanningPoker } from '../contexts/PlanningPokerContext';
import NameEntry from '../components/NameEntry';
import VotingInterface from '../components/VotingInterface';
import UserList from '../components/UserList';
import ResultsDisplay from '../components/ResultsDisplay';
import ParticipantStatusBar from '../components/ParticipantStatusBar';

export default function Home() {
  const {
    userId,
    userName,
    participants,
    votes,
    revealed,
    loading,
    error,
    joinSession,
    submitVote,
    revealVotes,
    startNewRound
  } = usePlanningPoker();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-container max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show name entry if user hasn't joined
  if (!userName) {
    return <NameEntry onNameSubmit={joinSession} />;
  }

  // Use a simple session-wide vote (no tickets needed)
  const currentRoundVotes = votes['current-round'] || {};
  const currentUserVote = currentRoundVotes[userId];
  const hasVoted = !!currentUserVote;
  const allVoted = Object.keys(participants).length > 0 && 
                   Object.keys(participants).every(id => currentRoundVotes[id]);
                   
  console.log('Current state:', { 
    userId, 
    currentUserVote, 
    hasVoted, 
    participantCount: Object.keys(participants).length,
    voteCount: Object.keys(currentRoundVotes).length,
    allVoted 
  });

  return (
    <>
      {/* Main Content */}
      <main>
        {/* Show results if revealed, otherwise show voting interface */}
        {revealed ? (
          <ResultsDisplay
            participants={participants}
            votes={currentRoundVotes}
            onNewRound={startNewRound}
            onNextTicket={startNewRound} // Same as new round since no tickets
          />
        ) : (
          <VotingInterface
            selectedVote={currentUserVote ? currentUserVote.value : null}
            onVoteSelect={submitVote}
            disabled={hasVoted}
          />
        )}

        {/* Manual reveal button - shown as floating button if needed */}
        {hasVoted && !revealed && !allVoted && (
          <div className="fixed top-8 right-8 z-30">
            <button
              onClick={() => revealVotes()}
              className="btn-primary shadow-lg"
              title="Reveal votes manually"
            >
              🎭 Reveal Now
            </button>
          </div>
        )}
      </main>

      {/* Participant Status Bar - Fixed at bottom */}
      {Object.keys(participants).length > 0 && (
        <ParticipantStatusBar
          participants={participants}
          votes={currentRoundVotes}
          currentUserId={userId}
          revealed={revealed}
        />
      )}
    </>
  );
} 