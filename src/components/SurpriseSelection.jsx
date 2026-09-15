function SurpriseSelection({ category, onCategoryChange, isLocked }) {
  return (
    <div className="surprise-selection">
      <div className="choice-grid">
        <button
          type="button"
          className={`choice-card ${category === 'money' ? 'selected' : ''}`}
          onClick={() => onCategoryChange('money')}
          disabled={isLocked}
        >
          <span className="choice-title">Pocket Money</span>
        </button>

        <button
          type="button"
          className={`choice-card ${category === 'cloth' ? 'selected' : ''}`}
          onClick={() => onCategoryChange('cloth')}
          disabled={isLocked}
        >
          <span className="choice-title">Cloth</span>
        </button>
      </div>
    </div>
  );
}

export default SurpriseSelection;
