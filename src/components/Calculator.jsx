import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getOccupants, getTotalPrice } from '../data'

function getNightsBetween(start, end) {
  const dates = []
  let current = new Date(start)
  const last = new Date(end)
  while (current < last) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export default function Calculator() {
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [people, setPeople] = useState(1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!arrival || !departure || arrival >= departure || people < 1) {
      setError('Veuillez entrer des valeurs valides.')
      return
    }

    const nightlyOccupants = getOccupants()
    const totalPrice = getTotalPrice()
    const pricePerNight = totalPrice / 7
    const nights = getNightsBetween(arrival, departure)
    let totalForOnePerson = 0

    nights.forEach(date => {
      const occupants = nightlyOccupants[date]
      if (occupants) {
        totalForOnePerson += pricePerNight / occupants
      }
    })

    setResult({
      arrival,
      departure,
      people,
      total: (totalForOnePerson * people).toFixed(2),
    })
  }

  return (
    <div className="container">
      <h1>💰 Part Maison</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="arrival">Date d'arrivée</label>
        <input
          type="date"
          id="arrival"
          value={arrival}
          onChange={e => setArrival(e.target.value)}
          required
        />

        <label htmlFor="departure">Date de départ</label>
        <input
          type="date"
          id="departure"
          value={departure}
          onChange={e => setDeparture(e.target.value)}
          required
        />

        <label htmlFor="people">Nombre de personnes</label>
        <input
          type="number"
          id="people"
          min="1"
          value={people}
          onChange={e => setPeople(parseInt(e.target.value))}
          required
        />

        <button type="submit">Calculer</button>
      </form>

      {error && <div id="result">❌ {error}</div>}

      {result && (
        <div id="result">
          <p>✅ Séjour du <strong>{formatDate(result.arrival)}</strong> au <strong>{formatDate(result.departure)}</strong></p>
          <p>👥 Nombre de personnes : <strong>{result.people}</strong></p>
          <p>💶 Montant total à payer : <strong>{result.total} €</strong></p>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/config">⚙️ Modifier les nuits et occupants</Link>
      </p>
    </div>
  )
}
