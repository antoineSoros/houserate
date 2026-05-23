export const defaultOccupants = {
  '2025-08-03': 4,
  '2025-08-04': 4,
  '2025-08-05': 6,
  '2025-08-06': 7,
  '2025-08-07': 9,
  '2025-08-08': 10,
  '2025-08-09': 6,
  '2025-08-10': 4,
  '2025-08-11': 4,
  '2025-08-12': 9,
  '2025-08-13': 8,
  '2025-08-14': 8,
  '2025-08-15': 4,
  '2025-08-16': 4,
}

export const defaultTotalPrice = 1500

export function getOccupants() {
  const saved = localStorage.getItem('nightlyOccupants')
  return saved ? JSON.parse(saved) : { ...defaultOccupants }
}

export function getTotalPrice() {
  const saved = localStorage.getItem('totalPrice')
  return saved ? parseFloat(saved) : defaultTotalPrice
}

export function saveOccupants(data) {
  localStorage.setItem('nightlyOccupants', JSON.stringify(data))
}

export function savePrice(price) {
  localStorage.setItem('totalPrice', price)
}

export function resetAll() {
  localStorage.removeItem('nightlyOccupants')
  localStorage.removeItem('totalPrice')
}
