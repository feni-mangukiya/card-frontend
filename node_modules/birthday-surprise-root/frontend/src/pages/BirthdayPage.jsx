import { useEffect, useMemo, useRef, useState } from 'react';
import BirthdayIntro from '../components/BirthdayIntro';
import SurpriseSelection from '../components/SurpriseSelection';
import SpinnerWheel from '../components/SpinnerWheel';
import SpinResult from '../components/SpinResult';
import FinalGiftSelection from '../components/FinalGiftSelection';
import { createFinalGift, createSpin, getFinalGiftBySession, getSpinsBySession } from '../services/api';

const STORAGE_KEY = 'birthday_session_id';
const DEFAULT_SPIN_OPTIONS = {
  money: ['₹300', '₹400', '₹500', '₹600', '₹700'],
  cloth: ['T-Shirt', 'Shirt', 'Jeans', 'Socks', 'Shorts']
};

function BirthdayPage() {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [view, setView] = useState('intro');
  const [candleLit, setCandleLit] = useState(false);
  const [matchVisible, setMatchVisible] = useState(true);
  const [personVisible, setPersonVisible] = useState(false);
  const [blowing, setBlowing] = useState(false);
  const [blowText, setBlowText] = useState('Fuuuuuu...');
  const [selectedCategory, setSelectedCategory] = useState('money');
  const [spinResults, setSpinResults] = useState([]);
  const [resultDisplay, setResultDisplay] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [spinSubmitting, setSpinSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [finalGift, setFinalGift] = useState(null);
  const [selectedFinalGift, setSelectedFinalGift] = useState('');
  const [showOpenSurprise, setShowOpenSurprise] = useState(false);
  const [matchAnimating, setMatchAnimating] = useState(false);
  const [error, setError] = useState('');
  const introRef = useRef(null);

  const categoryOptions = useMemo(() => DEFAULT_SPIN_OPTIONS[selectedCategory], [selectedCategory]);

  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (!storedSession) {
      const generatedId = `birthday_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(STORAGE_KEY, generatedId);
      setSessionId(generatedId);
      return;
    }

    setSessionId(storedSession);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const hydrate = async () => {
      try {
        setLoading(true);
        const spinData = await getSpinsBySession(sessionId);
        const finalData = await getFinalGiftBySession(sessionId);

        if (spinData.success && spinData.totalSpins > 0) {
          setSpinResults(spinData.results || []);
          setSelectedCategory(spinData.results?.[0]?.category === 'cloth' ? 'cloth' : 'money');
          setResultDisplay(spinData.results?.[spinData.results.length - 1]?.result || '');
        }

        if (finalData.success && finalData.hasFinalGift) {
          setFinalGift(finalData.finalGift);
          setSelectedFinalGift(finalData.finalGift);
          setView('final');
        } else if (spinData.success && spinData.totalSpins >= 2) {
          setView('surprise');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [sessionId]);

  const handleMatchClick = () => {
    if (candleLit || blowing || matchAnimating) return;

    const wick = document.getElementById('wick');
    const matchButton = document.querySelector('.matchstick-button');
    if (!wick || !matchButton) return;

    const wickRect = wick.getBoundingClientRect();
    const matchRect = matchButton.getBoundingClientRect();
    const dx = wickRect.left + wickRect.width / 2 - (matchRect.left + matchRect.width / 2);
    const dy = wickRect.top + wickRect.height / 2 - (matchRect.top + matchRect.height / 2);

    matchButton.style.transition = 'transform 0.8s ease, opacity 0.6s ease';
    matchButton.style.transform = `translate(${dx}px, ${dy - 6}px) scale(0.45)`;
    matchButton.style.opacity = '0';
    setMatchAnimating(true);

    setTimeout(() => {
      setCandleLit(true);
      setMatchVisible(false);
      setPersonVisible(true);
      setBlowText('Fuuuuuu...');
      setMatchAnimating(false);
      setView('intro');
    }, 800);
  };

  const handleBlowOut = () => {
    if (!candleLit || blowing) return;

    setBlowing(true);
    setBlowText('Fuuuuuu...');

    setTimeout(() => {
      setCandleLit(false);
      setPersonVisible(false);
      setBlowing(false);
      setStatusMessage('Candle out! Surprise time!');
      setShowOpenSurprise(true);
    }, 1100);
  };

  const handleOpenSurprise = () => {
    setView('surprise');
    setShowOpenSurprise(false);
    setStatusMessage('Candle out! Surprise time!');
  };

  const handleSpin = async () => {
    if (!sessionId || spinSubmitting || loading || spinResults.length >= 2) {
      setError('Your two lucky spins are already complete.');
      return;
    }

    try {
      const isSecondSpin = spinResults.length === 1;
      setSpinSubmitting(true);
      setSpinning(!isSecondSpin);
      setLoading(true);
      setError('');
      setStatusMessage('');
      const res = await createSpin(sessionId, selectedCategory);

      setSpinResults((current) => [...current, {
        spinNumber: res.spinNumber,
        category: res.category,
        result: res.result
      }]);
      setResultDisplay(res.result);

      const spinNumber = res.spinNumber;
      const wheel = document.querySelector('.spinner-wheel');
      const shouldAnimateWheel = spinNumber === 1;
      if (wheel && shouldAnimateWheel) {
        const resultIndex = categoryOptions.indexOf(res.result);
        const segmentAngle = 360 / categoryOptions.length;
        const targetRotation = 6 * 360 - (resultIndex + 0.5) * segmentAngle;
        wheel.style.transform = `rotate(${targetRotation}deg)`;
      }

      const finishSpin = () => {
        setSpinning(false);
        setSpinSubmitting(false);
        setLoading(false);
      };

      if (shouldAnimateWheel) {
        setTimeout(finishSpin, 2800);
      } else {
        finishSpin();
      }

      if (res.totalSpins >= 2) {
        setView('final');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSpinning(false);
      setSpinSubmitting(false);
      setLoading(false);
    }
  };

  const handleFinalGiftSelect = async (result) => {
    if (!sessionId || !result) return;

    try {
      setLoading(true);
      const res = await createFinalGift(sessionId, result);
      setSelectedFinalGift(res.selectedResult);
      setFinalGift(res.selectedResult);
      setView('final');
      setStatusMessage('Your birthday surprise is locked in!');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderIntro = () => (
    <BirthdayIntro
      onMatchClick={handleMatchClick}
      isMatchVisible={matchVisible}
      candleLit={candleLit}
      isPersonVisible={personVisible}
      onPersonClick={handleBlowOut}
      blowingText={blowText}
      blowState={blowing}
      showOpenSurprise={showOpenSurprise}
      onOpenSurprise={handleOpenSurprise}
      statusMessage={statusMessage}
    />
  );

  const renderSurprise = () => (
    <div className="surprise-panel">
      <div className="section-copy">
        <h2>Happy Birthday Daxu! 🎂</h2>
        <p>Wishing you lots of happiness, endless smiles and beautiful moments in your life. ❤️</p>
      </div>

      <SurpriseSelection
        category={selectedCategory}
        onCategoryChange={(category) => {
          if (spinResults.length >= 2) return;
          setSelectedCategory(category);
        }}
        isLocked={spinResults.length >= 2}
      />

      {spinResults.length < 2 ? (
        <>
          <SpinnerWheel
            options={categoryOptions}
            selectedCategory={selectedCategory}
            resultText={resultDisplay || 'Your lucky choice is waiting...'}
            spinning={spinning}
            isSubmitting={spinSubmitting}
            onSpin={handleSpin}
          />
        </>
      ) : (
        <div className="spin-summary-box">
          <p>Two lucky spins are complete.</p>
        </div>
      )}

      <div className="spin-count" role="status">
        {spinResults.length < 2
          ? `Spin ${spinResults.length + 1} of 2 available · ${2 - spinResults.length} ${2 - spinResults.length === 1 ? 'spin' : 'spins'} remaining`
          : 'You have used both spins.'}
      </div>

      <SpinResult result={resultDisplay} visible={Boolean(resultDisplay && !spinning && !spinSubmitting)} />

      {error && <div className="error-banner">{error}</div>}
      {statusMessage && <div className="success-banner">{statusMessage}</div>}
    </div>
  );

  const renderFinal = () => (
    <div className="final-panel">
      <h2>Your Two Lucky Choices</h2>
      <p>Which one do you like?</p>
      <FinalGiftSelection
        results={spinResults.slice(0, 2).map((entry) => entry.result)}
        selectedResult={selectedFinalGift || finalGift}
        onSelect={handleFinalGiftSelect}
        disabled={Boolean(selectedFinalGift || finalGift)}
      />
      {selectedFinalGift && (
        <div className="final-picked">Chosen gift: <strong>{selectedFinalGift}</strong></div>
      )}
    </div>
  );

  return (
    <div className="page-shell">
      <div className="main-card">
        {loading && <div className="loading-pill">Loading...</div>}
        {view === 'intro' && renderIntro()}
        {view === 'surprise' && renderSurprise()}
        {view === 'final' && renderFinal()}
      </div>
    </div>
  );
}

export default BirthdayPage;
