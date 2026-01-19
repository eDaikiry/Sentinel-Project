/* * SENTINEL.RS DASHBOARD v1.0
 * Authored by: Daiki
 * Stack: React + Rust + Axios
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Server, Terminal, Clock, Database, Cpu } from 'lucide-react';
import './App.css';

function App() {
  const [ip, setIp] = useState('127.0.0.1');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/history');
      setHistory(response.data);
    } catch (error) {
      console.error("Falha ao carregar histórico:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setResults([]);
    try {
      const response = await axios.post('http://127.0.0.1:8080/scan', {
        target: ip,
        start_port: 1,
        end_port: 1024 
      });
      setResults(response.data.results);
      fetchHistory();
    } catch (error) {
      console.error("Scan failed:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'monospace', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <Shield size={40} color="#6366f1" style={{ marginRight: '1rem' }} />
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '2px' }}>SENTINEL<span style={{ color: '#6366f1' }}>.RS</span></h1>
          <p style={{ margin: 0, color: '#666' }}>Persistence Module // v1.0</p>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Input Area */}
        <div style={{ background: '#13131f', padding: '2rem', borderRadius: '8px', border: '1px solid #2a2a35', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)} 
              style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '10px', fontFamily: 'monospace', outline: 'none' }}
            />
            <button 
              onClick={handleScan} 
              disabled={loading}
              style={{ background: loading ? '#333' : '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: '0.3s' }}
            >
              {loading ? 'SCANNING...' : 'INITIATE SCAN'}
            </button>
          </div>
        </div>

        {/* Results Area (Active Scan) */}
        {results.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h3 style={{color: '#fff', borderLeft: '3px solid #6366f1', paddingLeft: '10px'}}>ACTIVE SCAN RESULTS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {results.map((res) => (
                <div key={res.port} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                  <Server size={24} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>PORT {res.port}</div>
                  <div style={{ color: '#4ade80', fontSize: '0.8rem' }}>OPEN</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        <div style={{ maxWidth: '800px', margin: '4rem auto', borderTop: '1px solid #333', paddingTop: '2rem' }}>
          <h3 style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#888'}}>
            <Database size={20} /> SCAN HISTORY LOG
          </h3>
          
          {history.length === 0 ? (
             <p style={{color: '#444'}}>No records found locally.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {history.map((record) => (
                <div key={record.id} style={{ background: '#111', borderLeft: '2px solid #333', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{color: '#6366f1', fontWeight: 'bold'}}>{record.target}</span>
                    <span style={{color: '#555', marginLeft: '1rem', fontSize: '0.8rem'}}>{new Date(record.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {record.open_ports.length > 0 ? (
                      record.open_ports.map(p => <span key={p} style={{background: '#222', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#4ade80'}}>{p}</span>)
                    ) : (
                      <span style={{color: '#555', fontSize: '0.8rem'}}>NO PORTS OPEN</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER NAME --- */}
      <footer style={{ 
        marginTop: '4rem', 
        padding: '2rem 0', 
        textAlign: 'center', 
        borderTop: '1px solid #1a1a1a',
        color: '#444'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px', letterSpacing: '2px' }}>
          <Cpu size={14} color="#6366f1" />
          <span>DEVELOPED BY <strong style={{ color: '#6366f1' }}>DAIKIRY</strong></span>
        </div>
        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          &copy; 2026 SENTINEL PROJECT // CORE MODULE BUILT WITH 
          <span style={{ color: '#f74c00', marginLeft: '5px' }}>RUST</span>
        </div>
      </footer>

    </div>
  );
}

export default App;