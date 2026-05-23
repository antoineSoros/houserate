import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  defaultOccupants, defaultTotalPrice, defaultStartDate, defaultEndDate,
  getOccupants, getTotalPrice, getDateRange,
  saveOccupants, savePrice, saveDateRange, resetAll,
  calculateShares, countNights,
} from '../data'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Config() {
  const [occupants, setOccupants] = useState(() => getOccupants())
  const [totalPrice, setTotalPrice] = useState(() => getTotalPrice())
  const [{ startDate, endDate }, setDateRange] = useState(() => getDateRange())
  const [status, setStatus] = useState('')

  const totalNights = useMemo(() => countNights(startDate, endDate), [startDate, endDate])
  const shares = useMemo(() => calculateShares(occupants, totalPrice), [occupants, totalPrice])

  function setStart(val) {
    setDateRange(prev => ({ ...prev, startDate: val }))
    setStatus('')
  }

  function setEnd(val) {
    setDateRange(prev => ({ ...prev, endDate: val }))
    setStatus('')
  }

  function updateOccupant(id, field, value) {
    setOccupants(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
    setStatus('')
  }

  function addOccupant() {
    const newId = Math.max(0, ...occupants.map(o => o.id)) + 1
    setOccupants(prev => [...prev, { id: newId, name: '', persons: 1, arrivalDate: startDate, departureDate: endDate }])
    setStatus('')
  }

  function removeOccupant(id) {
    setOccupants(prev => prev.filter(o => o.id !== id))
    setStatus('')
  }

  function handleSave() {
    saveOccupants(occupants)
    savePrice(totalPrice)
    saveDateRange(startDate, endDate)
    setStatus('✅ Données enregistrées avec succès.')
  }

  function handleReset() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      resetAll()
      setOccupants(defaultOccupants.map(o => ({ ...o })))
      setTotalPrice(defaultTotalPrice)
      setDateRange({ startDate: defaultStartDate, endDate: defaultEndDate })
      setStatus('♻️ Données réinitialisées.')
    }
  }

  return (
    <div className="config-page">
      <Link to="/" className="back-link">⬅️ Retour au calculateur</Link>

      <h1>⚙️ Configuration</h1>

      <div className="config-section">
        <h2>📅 Période du séjour</h2>
        <div className="date-range-row">
          <div className="date-field">
            <label htmlFor="startDate">Date d'arrivée</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={e => setStart(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label htmlFor="endDate">Date de départ</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              min={startDate}
              onChange={e => setEnd(e.target.value)}
            />
          </div>
          <div className="nights-badge">
            {totalNights > 0
              ? <><strong>{totalNights}</strong> nuit{totalNights > 1 ? 's' : ''}</>
              : <span className="nights-badge--invalid">dates invalides</span>}
          </div>
        </div>
        {totalNights > 0 && (
          <p className="date-summary">
            Du <strong>{formatDate(startDate)}</strong> au <strong>{formatDate(endDate)}</strong>
          </p>
        )}
      </div>

      <div className="config-section">
        <label htmlFor="totalPrice">Prix total du séjour (€)</label>
        <input
          type="number"
          id="totalPrice"
          min="1"
          value={totalPrice}
          onChange={e => { setTotalPrice(parseFloat(e.target.value) || 0); setStatus('') }}
        />
      </div>

      <div className="config-section">
        <h2>👥 Occupants</h2>

        {occupants.length === 0 ? (
          <p className="empty-occupants">Aucun occupant. Cliquez sur « + Ajouter » pour commencer.</p>
        ) : (
          <table className="occupants-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Personnes</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Nuits</th>
                <th>Total à payer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shares.map(o => (
                <tr key={o.id}>
                  <td data-label="Nom">
                    <input
                      type="text"
                      placeholder="Nom..."
                      value={o.name}
                      onChange={e => updateOccupant(o.id, 'name', e.target.value)}
                    />
                  </td>
                  <td data-label="Personnes">
                    <input
                      type="number"
                      min="1"
                      value={o.persons}
                      onChange={e => updateOccupant(o.id, 'persons', Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </td>
                  <td data-label="Arrivée" className="date-cell">
                    <input
                      type="date"
                      value={o.arrivalDate}
                      min={startDate || undefined}
                      max={o.departureDate || endDate || undefined}
                      onChange={e => updateOccupant(o.id, 'arrivalDate', e.target.value)}
                    />
                  </td>
                  <td data-label="Départ" className="date-cell">
                    <input
                      type="date"
                      value={o.departureDate}
                      min={o.arrivalDate || startDate || undefined}
                      max={endDate || undefined}
                      onChange={e => updateOccupant(o.id, 'departureDate', e.target.value)}
                    />
                  </td>
                  <td data-label="Nuits">
                    <span className="nights-readonly">
                      {o.nights > 0 ? o.nights : <span className="nights-invalid">—</span>}
                    </span>
                  </td>
                  <td data-label="Total à payer" className="price-cell">
                    {o.totalPrice.toFixed(2)} €
                  </td>
                  <td data-label="">
                    <button
                      className="remove-btn"
                      onClick={() => removeOccupant(o.id)}
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} data-label="Total distribué"><strong>Total distribué</strong></td>
                <td className="price-cell" data-label="">
                  <strong>{shares.reduce((s, o) => s + o.totalPrice, 0).toFixed(2)} €</strong>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}

        <button className="add-btn" onClick={addOccupant}>+ Ajouter un occupant</button>
      </div>

      <div className="config-actions">
        <button className="save-btn" onClick={handleSave}>Enregistrer</button>
        <button className="reset-btn" onClick={handleReset}>Réinitialiser</button>
      </div>

      {status && <p className="config-status">{status}</p>}
    </div>
  )
}
