import { useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultOccupants, defaultTotalPrice, getOccupants, getTotalPrice, saveOccupants, savePrice, resetAll } from '../data'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export default function Config() {
  const [occupants, setOccupants] = useState(() => getOccupants())
  const [totalPrice, setTotalPrice] = useState(() => getTotalPrice())
  const [status, setStatus] = useState('')

  function handleSave() {
    saveOccupants(occupants)
    savePrice(totalPrice)
    setStatus('✅ Données enregistrées avec succès.')
  }

  function handleReset() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      resetAll()
      setOccupants({ ...defaultOccupants })
      setTotalPrice(defaultTotalPrice)
      setStatus('♻️ Données réinitialisées.')
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '20px' }}>
      <Link to="/">⬅️ Retour au calculateur</Link>

      <h1>⚙️ Configuration</h1>

      <form style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label htmlFor="totalPrice" style={{ fontWeight: 500, color: '#444' }}>Prix de la semaine (€)</label>
        <input
          type="number"
          id="totalPrice"
          min="1"
          value={totalPrice}
          onChange={e => setTotalPrice(parseFloat(e.target.value))}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
        />

        {Object.entries(defaultOccupants).map(([date]) => (
          <div key={date}>
            <label htmlFor={date} style={{ fontWeight: 500, color: '#444' }}>
              Nuit du {formatDate(date)} :
            </label>
            <input
              type="number"
              id={date}
              min="1"
              value={occupants[date] ?? defaultOccupants[date]}
              onChange={e => setOccupants(prev => ({ ...prev, [date]: parseInt(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', width: '100%', marginTop: '4px' }}
            />
          </div>
        ))}
      </form>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={handleSave}
          style={{ padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#2ecc71', color: 'white' }}
        >
          Enregistrer
        </button>
        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white' }}
        >
          Réinitialiser les données
        </button>
      </div>

      {status && <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{status}</p>}
    </div>
  )
}
