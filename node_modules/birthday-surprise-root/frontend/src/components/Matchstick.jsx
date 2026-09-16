function Matchstick({ onClick, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      className="matchstick-button"
      aria-label="Light the candle"
      onClick={onClick}
    >
      <span className="match-candle" aria-hidden="true">
        <span className="match-candle-flame" />
      </span>
    </button>
  );
}

export default Matchstick;
