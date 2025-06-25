export default function UserList({ participants, votes, currentUserId }) {
  const participantsList = Object.entries(participants || {});

  if (participantsList.length === 0) {
    return null;
  }

  return (
    <div className="card-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Participants ({participantsList.length})
      </h3>
      
      <div className="space-y-2">
        {participantsList.map(([userId, participant]) => {
          const hasVoted = votes && votes[userId];
          const isCurrentUser = userId === currentUserId;
          
          return (
            <div
              key={userId}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isCurrentUser ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  hasVoted ? 'bg-success' : 'bg-gray-300'
                }`} />
                <span className={`font-medium ${
                  isCurrentUser ? 'text-primary' : 'text-gray-900'
                }`}>
                  {participant.name}
                  {isCurrentUser && ' (You)'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                {hasVoted ? (
                  <span className="text-success font-medium">Voted</span>
                ) : (
                  <span className="animate-pulse-soft">Waiting...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 