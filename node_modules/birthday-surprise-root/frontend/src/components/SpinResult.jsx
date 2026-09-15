import Confetti from './Confetti';

function SpinResult({ result, visible = false }) {
  if (!visible || !result) return null;

  return (
    <div className="spin-result-panel">
      <Confetti />
      <h3>🎉 YOU WON!</h3>
      <div className="result-value">{result}</div>
    </div>
  );
}

export default SpinResult;
