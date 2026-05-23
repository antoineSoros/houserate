import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getOccupants, getTotalPrice, getDateRange, calculateShares } from '../data'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Calculator() {
  const { shares, startDate, endDate } = useMemo(() => {
    const occupants = getOccupants()
    const totalPrice = getTotalPrice()
    const dateRange = getDateRange()
    return {
      shares: calculateShares(occupants, totalPrice),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }
  }, [])

  return (
    <div className="container">
      <h1>💰 Part Maison</h1>

      {startDate && endDate && (
        <p className="stay-range">
          📅 Séjour du <strong>{formatDate(startDate)}</strong> au <strong>{formatDate(endDate)}</strong>
        </p>
      )}

      {shares.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Aucun occupant configuré.</p>
      ) : (
        <div className="summary">
          <h2>📋 Résumé des parts</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Personnes</th>
                <th>Nuits</th>
                <th>Total à payer</th>
              </tr>
            </thead>
            <tbody>
              {shares.map(o => (
                <tr key={o.id}>
                  <td data-label="Nom">{o.name || <em style={{ color: '#aaa' }}>—</em>}</td>
                  <td data-label="Personnes">{o.persons}</td>
                  <td data-label="Nuits">{o.nights}</td>
                  <td data-label="Total à payer"><strong>{o.totalPrice.toFixed(2)} €</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} data-label="Total"><strong>Total</strong></td>
                <td data-label=""><strong>{shares.reduce((s, o) => s + o.totalPrice, 0).toFixed(2)} €</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/config">⚙️ Modifier les nuits et occupants</Link>
      </p>
    </div>
  )
}
