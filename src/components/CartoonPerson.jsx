function CartoonPerson({ isVisible = false, onClick, isBlowing = false }) {
  if (!isVisible) return null;

  return (
    <button type="button" className="person-button" onClick={onClick} aria-label="Blow out candle">
      <div className={`cartoon-person ${isBlowing ? 'blowing' : ''}`}>
        <div className="person-head">
          <span className="eye left" />
          <span className="eye right" />
          <span className="smile" />
        </div>
        <div className="person-body" />
        <div className="person-arm left" />
        <div className="person-arm right" />
        <div className="person-leg left" />
        <div className="person-leg right" />
        <div className="wind-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </button>
  );
}

export default CartoonPerson;
