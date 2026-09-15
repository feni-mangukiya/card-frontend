function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <span key={index} style={{ '--i': index }} />
      ))}
    </div>
  );
}

export default Confetti;
