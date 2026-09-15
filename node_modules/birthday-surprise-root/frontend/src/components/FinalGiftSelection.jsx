function FinalGiftSelection({ results, selectedResult, onSelect, disabled }) {
  if (!results || results.length !== 2) return null;

  return (
    <div className="final-gift-panel">
      <h3>Your Two Lucky Choices</h3>
      <p>Which one do you like?</p>
      <div className="final-choice-grid">
        {results.map((result) => (
          <button
            key={result}
            type="button"
            className={`final-choice ${selectedResult === result ? 'selected' : ''}`}
            onClick={() => onSelect(result)}
            disabled={disabled}
          >
            {result}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FinalGiftSelection;
