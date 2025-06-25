export default function ParticipantStatusBar({ 
  participants, 
  votes, 
  currentUserId, 
  revealed 
}) {
  const getParticipantInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id) => {
    const colors = [
      'linear-gradient(145deg, #6366f1, #4f46e5)', // Indigo
      'linear-gradient(145deg, #10b981, #059669)', // Emerald
      'linear-gradient(145deg, #f59e0b, #d97706)', // Amber
      'linear-gradient(145deg, #ef4444, #dc2626)', // Red
      'linear-gradient(145deg, #8b5cf6, #7c3aed)', // Violet
      'linear-gradient(145deg, #06b6d4, #0891b2)', // Cyan
      'linear-gradient(145deg, #f97316, #ea580c)', // Orange
      'linear-gradient(145deg, #ec4899, #db2777)', // Pink
    ];
    
    // Use ID to consistently assign colors
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const participantList = Object.entries(participants);
  const totalParticipants = participantList.length;
  const votedCount = Object.keys(votes).length;

  return (
    <div className="participants-bar animate-slide-up">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Participants */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <span className="font-semibold text-gray-700">
              {totalParticipants} Player{totalParticipants !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {participantList.map(([userId, participant]) => {
              const hasVoted = votes[userId];
              const isCurrentUser = userId === currentUserId;
              
              return (
                <div
                  key={userId}
                  className={`participant-avatar ${hasVoted ? 'voted' : 'waiting'}`}
                  style={{ background: getRandomColor(userId) }}
                  title={`${participant.name}${isCurrentUser ? ' (You)' : ''}`}
                >
                  {getParticipantInitials(participant.name)}
                  {isCurrentUser && (
                    <div className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-yellow-900 px-1 rounded-full font-bold">
                      YOU
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Status */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Voting Progress</div>
            <div className="font-semibold text-gray-700">
              {votedCount} / {totalParticipants}
            </div>
          </div>
          
          <div className={`status-badge ${
            revealed ? 'status-revealed' : 
            votedCount === totalParticipants && totalParticipants > 0 ? 'status-ready' : 
            'status-voting'
          }`}>
            {revealed ? (
              <>
                ✨ <span>Results Revealed</span>
              </>
            ) : votedCount === totalParticipants && totalParticipants > 0 ? (
              <>
                🎉 <span>Ready to Reveal</span>
              </>
            ) : (
              <>
                🗳️ <span>Voting in Progress</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 