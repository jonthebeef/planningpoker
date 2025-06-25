import { POKER_CARDS } from '../lib/utils';
import PokerCard from './PokerCard';

export default function VotingInterface({ 
  selectedVote, 
  onVoteSelect, 
  disabled = false
}) {
  console.log('VotingInterface render:', { selectedVote, disabled });

  const handleVoteSelect = (value) => {
    console.log('Vote selected:', value);
    if (onVoteSelect) {
      onVoteSelect(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 pb-32">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-scale-in">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
            Planning Poker
          </h1>
          <div className="flex items-center justify-center space-x-3 text-2xl text-white/80">
            <span>🎯</span>
            <span>Choose your estimate</span>
            <span>🃏</span>
          </div>
        </div>

        {/* Cards Section */}
        <div className="card-container mb-8 animate-slide-up">
          <div className="cards-grid">
            {POKER_CARDS.map((card) => (
              <PokerCard
                key={card.value}
                card={card}
                isSelected={selectedVote === card.value}
                onSelect={handleVoteSelect}
                disabled={disabled}
              />
            ))}
          </div>
          
          {/* Selection Feedback */}
          {selectedVote !== null && !disabled && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center animate-scale-in">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-green-800 font-bold text-xl">
                    Great choice!
                  </p>
                  <p className="text-green-600 text-lg">
                    You voted: <span className="font-bold">
                      {POKER_CARDS.find(card => card.value === selectedVote)?.display}
                    </span>
                  </p>
                </div>
                <span className="text-3xl">✨</span>
              </div>
            </div>
          )}

          {/* Disabled State Message */}
          {disabled && selectedVote !== null && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl text-center">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="text-blue-800 font-bold text-xl">
                    Vote submitted!
                  </p>
                  <p className="text-blue-600 text-lg">
                    Waiting for other players to vote...
                  </p>
                </div>
                <span className="text-3xl">🤝</span>
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {selectedVote === null && (
          <div className="text-center text-white/90">
            <p className="text-lg font-semibold drop-shadow-lg">
              👆 Click on a card to cast your vote
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 