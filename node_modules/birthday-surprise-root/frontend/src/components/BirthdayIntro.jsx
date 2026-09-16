import Cake from './Cake';
import Matchstick from './Matchstick';
import CartoonPerson from './CartoonPerson';

function BirthdayIntro({
  onMatchClick,
  isMatchVisible,
  candleLit,
  isPersonVisible,
  onPersonClick,
  blowingText,
  blowState,
  showOpenSurprise,
  onOpenSurprise,
  statusMessage
}) {
  return (
    <div className="intro-shell">
      <div className="intro-header">
        <p className="eyebrow">A Little Birthday Surprise</p>
        <h1>Light the candle to begin</h1>
      </div>

      <div className="birthday-stage">
        <div className={`person-spot ${isPersonVisible ? 'visible' : ''}`}>
          <CartoonPerson isVisible={isPersonVisible} onClick={onPersonClick} isBlowing={blowState} />
        </div>

        <div className="cake-area">
          <Cake isLit={candleLit} />
        </div>

        <div className="match-area">
          <Matchstick onClick={onMatchClick} isVisible={isMatchVisible} />
        </div>
      </div>

      <div className="interaction-message">
        {showOpenSurprise ? (
          <>
            <span className="status-text">{statusMessage || 'Candle out! Surprise time!'}</span>
            <button type="button" className="open-surprise-button" onClick={onOpenSurprise}>
              Open Surprise
            </button>
          </>
        ) : blowState ? (
          <span className="blow-text">{blowingText}</span>
        ) : candleLit ? (
          <span>Click the person to blow the candle.</span>
        ) : (
          <span>Click the candle to light it.</span>
        )}
      </div>
    </div>
  );
}

export default BirthdayIntro;
