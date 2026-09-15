function Cake({ isLit = false }) {
  return (
    <div className="cake-scene" aria-label="Birthday cake illustration">
      <div className="cake">
        <div className="cake-top" />
        <div className="cake-body">
          <div className="cake-layer" />
          <div className="cake-layer" />
          <div className="cake-layer" />
        </div>
        <div className="candle-wrapper">
          <div className={`candle-body ${isLit ? 'lit' : 'off'}`} id="candle-body">
            <div className="wick" id="wick" />
            <div className="flame" id="flame" aria-hidden="true" />
          </div>
        </div>
        <div className="cake-sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default Cake;
