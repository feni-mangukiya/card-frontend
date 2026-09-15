function Matchstick({ onClick, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      className="matchstick-button"
      aria-label="Light the candle"
      onClick={onClick}
    >
      <span className="matchstick-stick" />
      <span className="matchstick-head" />
    </button>
  );
}

export default Matchstick;
