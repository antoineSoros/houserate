const nightlyOccupants = {
  "2025-08-03": 4,
  "2025-08-04": 4,
  "2025-08-05": 6,
  "2025-08-06": 7,
  "2025-08-07": 9,
  "2025-08-08": 10,
  "2025-08-09": 6,
    "2025-08-10": 4,
    "2025-08-11": 4,
    "2025-08-12": 9,
    "2025-08-13": 8,
    "2025-08-14": 8,
    "2025-08-15": 4,
    "2025-08-16": 4,
    
};

const totalPrice = 1500;
const pricePerNight = totalPrice / 7;

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const peopleCount = parseInt(document.getElementById("people").value);

  if (!arrival || !departure || arrival >= departure || isNaN(peopleCount) || peopleCount < 1) {
    document.getElementById("result").innerText = "❌ Veuillez entrer des valeurs valides.";
    return;
  }

  const nights = getNightsBetween(arrival, departure);
  let totalForOnePerson = 0;

  nights.forEach(date => {
    const occupants = nightlyOccupants[date];
    if (occupants) {
      const perPersonCost = pricePerNight / occupants;
      totalForOnePerson += perPersonCost;
    } else {
      console.warn(`Pas de données pour la nuit du ${date}`);
    }
  });

  const total = totalForOnePerson * peopleCount;

  document.getElementById("result").innerHTML =
    `<p>✅ Séjour du <strong>${formatDate(arrival)}</strong> au <strong>${formatDate(departure)}</strong></p>
     <p>👥 Nombre de personnes : <strong>${peopleCount}</strong></p>
     <p>💶 Montant total à payer : <strong>${total.toFixed(2)} €</strong></p>`;
});

function getNightsBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current < last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function formatDate(dateStr) {
  const options = { day: '2-digit', month: '2-digit' };
  return new Date(dateStr).toLocaleDateString('fr-FR', options);
}
