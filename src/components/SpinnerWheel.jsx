function SpinnerWheel({ options, selectedCategory, resultText, spinning, isSubmitting, onSpin }) {
  const segmentAngle = 360 / options.length;

  const wheelStyle = {
    background: `conic-gradient(
      #fbe7b3 0deg ${segmentAngle}deg,
      #f8d98f ${segmentAngle}deg ${segmentAngle * 2}deg,
      #f7bf5b ${segmentAngle * 2}deg ${segmentAngle * 3}deg,
      #f0a33d ${segmentAngle * 3}deg ${segmentAngle * 4}deg,
      #e88a3d ${segmentAngle * 4}deg 360deg
    )`
  };

  return (
    <div className="spinner-panel">
      <div className="spinner-wrap">
        <div className="spinner-pointer" aria-hidden="true" />
        <div className="spinner-center-badge" aria-hidden="true">★</div>
        <div
          className={`spinner-wheel ${spinning ? 'is-spinning' : ''}`}
          style={wheelStyle}
          aria-label="Lucky wheel"
        >
          {options.map((option, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            const radians = (angle - 90) * (Math.PI / 180);
            const x = 50 + Math.cos(radians) * 34;
            const y = 50 + Math.sin(radians) * 34;
            const rotation = angle + 90;

            return (
              <div
                key={option}
                className="spinner-label"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                }}
              >
                <span style={{ transform: `rotate(${-rotation}deg)` }}>{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="spinner-actions">
        <button type="button" className="primary-button" onClick={onSpin} disabled={isSubmitting}>
          {spinning ? 'Spinning...' : 'SPIN'}
        </button>
      </div>

      <div className="category-tag">Category: {selectedCategory === 'money' ? 'Pocket Money' : 'Cloth'}</div>
    </div>
  );
}

export default SpinnerWheel;
