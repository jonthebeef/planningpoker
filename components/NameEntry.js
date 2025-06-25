import { useState } from 'react';

export default function NameEntry({ onNameSubmit }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onNameSubmit(name.trim());
    } catch (error) {
      console.error('Failed to join session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-lg mx-auto">
        
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="text-8xl mb-6">🃏</div>
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
            Planning Poker
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Estimate user stories with your team
          </p>
          <div className="flex items-center justify-center space-x-3 text-lg text-white/70">
            <span>🚀</span>
            <span>Fast</span>
            <span>•</span>
            <span>🎯</span>
            <span>Accurate</span>
            <span>•</span>
            <span>🎉</span>
            <span>Fun</span>
          </div>
        </div>

        {/* Entry Form */}
        <div className="card-container animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                👋 Welcome to the session!
              </h2>
              <p className="text-gray-600">
                Enter your name to join the planning session
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg"
                  disabled={isSubmitting}
                  maxLength={50}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>🎮</span>
                    <span>Join Session</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                💡 <strong>Tip:</strong> Use your real name so teammates can recognize you
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up">
          <div className="text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-1">Instant</h3>
            <p className="text-sm text-gray-600">Join and start voting right away</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-800 mb-1">Real-time</h3>
            <p className="text-sm text-gray-600">See votes update live</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-1">Mobile</h3>
            <p className="text-sm text-gray-600">Works on any device</p>
          </div>
        </div>
      </div>
    </div>
  );
} 