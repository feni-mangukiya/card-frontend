import { useEffect, useMemo, useState } from 'react';
import { getAdminFinalGifts, getAdminSpins, getAdminStats, getAdminUsers } from '../services/api';

const ADMIN_KEY = localStorage.getItem('birthday_admin_key') || 'change-this-secret';

function AdminPage() {
  const [adminKey, setAdminKey] = useState(ADMIN_KEY);
  const [stats, setStats] = useState({ totalVisitors: 0, totalSpins: 0, completedSessions: 0, finalGiftSelections: 0 });
  const [users, setUsers] = useState([]);
  const [spins, setSpins] = useState([]);
  const [finalGifts, setFinalGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = async (key = adminKey) => {
    try {
      setLoading(true);
      setError('');
      localStorage.setItem('birthday_admin_key', key);

      const [statsRes, usersRes, spinsRes, giftsRes] = await Promise.all([
        getAdminStats(key),
        getAdminUsers(key),
        getAdminSpins(key),
        getAdminFinalGifts(key)
      ]);

      setStats(statsRes.stats || {});
      setUsers(usersRes.users || []);
      setSpins(spinsRes.spins || []);
      setFinalGifts(giftsRes.finalGifts || []);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statsCards = useMemo(() => [
    { label: 'Total Visitors', value: stats.totalVisitors },
    { label: 'Total Spins', value: stats.totalSpins },
    { label: 'Completed Sessions', value: stats.completedSessions },
    { label: 'Final Gifts Selected', value: stats.finalGiftSelections }
  ], [stats]);

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Birthday Surprise Insights</h1>
          </div>
          <div className="admin-key-box">
            <label htmlFor="adminKey">Admin Key</label>
            <input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter admin key"
            />
            <button type="button" className="primary-button" onClick={() => fetchDashboard(adminKey)}>
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {loading && <div className="loading-pill">Loading...</div>}

        <div className="admin-stats-grid">
          {statsCards.map((card) => (
            <div className="admin-stat-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="admin-section">
          <h2>Visitors</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Spin 1</th>
                  <th>Spin 2</th>
                  <th>Final Gift</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.sessionId || user.id}>
                    <td>{user.visitor}</td>
                    <td>{user.spin1}</td>
                    <td>{user.spin2}</td>
                    <td>{user.finalGift}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>Spin record</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Spin #</th>
                  <th>Category</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {spins.map((spin) => (
                  <tr key={spin.id}>
                    <td>{spin.visitor}</td>
                    <td>{spin.spinNumber}</td>
                    <td>{spin.category}</td>
                    <td>{spin.result}</td>
                    <td>{new Date(spin.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>Final gifts</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Selected Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {finalGifts.map((gift) => (
                  <tr key={gift.id}>
                    <td>{gift.visitor}</td>
                    <td>{gift.selectedResult}</td>
                    <td>{new Date(gift.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
