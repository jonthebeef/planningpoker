import { useState, useEffect } from 'react';
import { calculateAverage, POKER_CARDS } from '../lib/utils';

export default function ResultsDisplay({ 
  participants, 
  votes, 
  onNewRound, 
  onNextTicket 
}) {
  const [countdown, setCountdown] = useState(3);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Reset countdown when component mounts
    setCountdown(3);
    setShowResults(false);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [votes]); // Reset when votes change

  const getCardDisplay = (value) => {
    const card = POKER_CARDS.find(card => card.value === value);
    return card ? card.display : value;
  };

  const voteEntries = Object.entries(votes || {});
  const average = calculateAverage(votes || {});

  // Countdown screen
  if (!showResults) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-8 pb-32">
        <div className="results-container animate-scale-in">
          <div className="py-16">
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 block">🎊</span>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Revealing Results...
              </h2>
            </div>
            
            <div className="countdown-display">
              {countdown}
            </div>
            
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header with Title and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 animate-scale-in pt-12">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-4 mb-3">
              <div className="text-6xl animate-bounce">🎊</div>
              <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                Results Revealed!
              </h1>
              <div className="text-6xl animate-bounce" style={{animationDelay: '0.1s'}}>🎉</div>
            </div>
            <p className="text-xl text-white/80 ml-20">
              Let's see how the team estimated this story
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <button
              onClick={onNewRound}
              className="btn-secondary flex items-center justify-center space-x-3 text-lg px-8 py-3"
            >
              <span className="text-xl">🔄</span>
              <span>Vote Again</span>
            </button>
            <button
              onClick={onNextTicket}
              className="btn-primary flex items-center justify-center space-x-3 text-lg px-8 py-3"
              style={{ border: '2px solid white' }}
            >
              <span className="text-xl">🚀</span>
              <span>Next Story</span>
            </button>
          </div>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Team Average - Hero Section */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-3xl p-8 h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-2xl animate-scale-in border-2 border-white">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              
              <div className="relative z-10 flex flex-col justify-center h-full text-center">
                <div className="mb-8">
                  <div className="text-7xl mb-6 animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
                    Team Average
                  </h2>
                  <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
                </div>
                
                <div className="mb-8">
                  <div className="text-8xl font-black text-white mb-4 drop-shadow-2xl">
                    {average}
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                    <span className="text-white/90 font-semibold">Story Points</span>
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                
                <div className="text-white/80">
                  <p className="text-lg mb-3">Consensus from</p>
                  <div className="inline-flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                    <span className="text-3xl font-bold text-white">
                      {voteEntries.filter(([, vote]) => typeof vote.value === 'number').length}
                    </span>
                    <div className="text-left">
                      <p className="text-white font-semibold">Team</p>
                      <p className="text-white/70 text-sm">Members</p>
                    </div>
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Votes - Modern Cards */}
          <div className="lg:col-span-2">
            <div className="results-container animate-slide-up h-full">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-4xl">👥</span>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Individual Votes
                  </h2>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {voteEntries.map(([userId, vote], index) => {
                  const participant = participants[userId];
                  const getRandomEmoji = () => {
                    const emojis = ['🦸', '🧙', '🐱', '🦊', '🐸', '🐧', '🦋', '🌟'];
                    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    return emojis[hash % emojis.length];
                  };

                  return (
                    <div
                      key={userId}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{getRandomEmoji()}</div>
                          <div>
                            <div className="font-bold text-gray-800 text-lg">
                              {participant?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">Team Member</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-black text-indigo-600 mb-1">
                            {getCardDisplay(vote.value)}
                          </div>
                          <div className="text-xs text-gray-400">vote</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-scale-in">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.max(...voteEntries.map(([,vote]) => typeof vote.value === 'number' ? vote.value : 0))}
              </div>
              <div className="text-orange-700 font-semibold">Highest Vote</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {voteEntries.length}
              </div>
              <div className="text-blue-700 font-semibold">Total Participants</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.min(...voteEntries.map(([,vote]) => typeof vote.value === 'number' ? vote.value : Infinity))}
              </div>
              <div className="text-green-700 font-semibold">Lowest Vote</div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
} 