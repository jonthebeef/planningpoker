import { useState } from 'react';

export default function SessionInfo({ sessionId }) {
  const [copied, setCopied] = useState(false);

  const copySessionUrl = async () => {
    try {
      const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  if (!sessionId) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <span className="text-gray-600">Session:</span>
            <span className="font-mono font-bold text-indigo-600 ml-1">
              {sessionId}
            </span>
          </div>
          <button
            onClick={copySessionUrl}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            title="Copy session URL to share with team"
          >
            {copied ? (
              <>
                <span className="text-green-400 mr-1">✓</span>
                Copied!
              </>
            ) : (
              <>
                <span className="mr-1">🔗</span>
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 