export const defaultStartDate = '2025-08-03'
export const defaultEndDate = '2025-08-16'
export const defaultTotalPrice = 1500

export const defaultOccupants = [
  { id: 1, name: '', persons: 1, arrivalDate: defaultStartDate, departureDate: defaultEndDate },
]

export function countNights(start, end) {
  if (!start || !end || start >= end) return 0
  return Math.round((new Date(end) - new Date(start)) / 86400000)
}

export function getOccupants() {
  const saved = localStorage.getItem('occupants')
  return saved ? JSON.parse(saved) : defaultOccupants.map(o => ({ ...o }))
}

export function getTotalPrice() {
  const saved = localStorage.getItem('totalPrice')
  return saved ? parseFloat(saved) : defaultTotalPrice
}

export function getDateRange() {
  const saved = localStorage.getItem('dateRange')
  return saved ? JSON.parse(saved) : { startDate: defaultStartDate, endDate: defaultEndDate }
}

export function saveOccupants(data) {
  localStorage.setItem('occupants', JSON.stringify(data))
}

export function savePrice(price) {
  localStorage.setItem('totalPrice', price)
}

export function saveDateRange(startDate, endDate) {
  localStorage.setItem('dateRange', JSON.stringify({ startDate, endDate }))
}

export function resetAll() {
  localStorage.removeItem('occupants')
  localStorage.removeItem('totalPrice')
  localStorage.removeItem('dateRange')
}

export function calculateShares(occupants, totalPrice) {
  const withNights = occupants.map(o => ({
    ...o,
    nights: countNights(o.arrivalDate, o.departureDate),
  }))
  const totalPersonNights = withNights.reduce((sum, o) => sum + o.persons * o.nights, 0)
  return withNights.map(o => ({
    ...o,
    totalPrice: totalPersonNights === 0 ? 0 : (o.persons * o.nights / totalPersonNights) * totalPrice,
  }))
}
