export default function PokerCard({ card, isSelected, onSelect, disabled = false }) {
  const handleClick = () => {
    console.log('Card clicked:', card.value);
    
    if (!disabled) {
      onSelect(card.value);
    }
  };

  const getCardColor = () => {
    if (isSelected) return 'text-white';
    if (typeof card.value === 'string') return 'text-purple-600'; // Special cards like ?, ☕
    return 'text-gray-800'; // Number cards
  };

  const getCardIcon = () => {
    if (typeof card.value === 'string') {
      if (card.value === '?') return '❓';
      if (card.value === 'coffee') return '☕';
      return '🔮';
    }
    if (card.value === 0) return '⭕';
    if (card.value >= 20) return '🔥';
    if (card.value >= 8) return '⚡';
    if (card.value >= 3) return '⭐';
    return '💫';
  };

  return (
    <div
      className={`poker-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      {/* Corner decorations */}
      <div className="card-corners absolute top-3 left-3 text-xs opacity-30">
        {getCardIcon()}
      </div>
      <div className="card-corners absolute bottom-3 right-3 text-xs opacity-30 rotate-180">
        {getCardIcon()}
      </div>
      
      {/* Main content */}
      <div className="text-center z-10 relative">
        <div className={`text-5xl font-black ${getCardColor()} drop-shadow-sm`}>
          {card.display}
        </div>
      </div>
      
      {/* Sparkle effect for selected cards */}
      {isSelected && (
        <div className="card-sparkle">✨</div>
      )}
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-white to-transparent pointer-events-none"></div>
    </div>
  );
} 