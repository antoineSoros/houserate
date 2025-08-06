document.addEventListener("DOMContentLoaded", () => {
  const defaultOccupants = {
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
    "2025-08-16": 4
  };

  const defaultTotalPrice = 1500;
  const form = document.getElementById("configForm");

  // 🔢 Prix de la semaine
  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Prix de la semaine (€)";
  priceLabel.setAttribute("for", "totalPrice");

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.id = "totalPrice";
  priceInput.min = 1;
  priceInput.required = true;

  const savedPrice = localStorage.getItem("totalPrice");
  priceInput.value = savedPrice ?? defaultTotalPrice;

  form.appendChild(priceLabel);
  form.appendChild(priceInput);

  // 🌙 Champs pour chaque nuit
  const savedOccupants = getSavedOccupants();

  Object.entries(defaultOccupants).forEach(([date, value]) => {
    const label = document.createElement("label");
    label.textContent = `Nuit du ${formatDate(date)} :`;
    label.setAttribute("for", date);

    const input = document.createElement("input");
    input.type = "number";
    input.id = date;
    input.min = 1;
    input.required = true;
    input.value = savedOccupants[date] ?? value;

    form.appendChild(label);
    form.appendChild(input);
  });

  // 💾 Bouton Enregistrer
  document.getElementById("saveBtn").addEventListener("click", () => {
    const newData = {};
    Object.keys(defaultOccupants).forEach(date => {
      const input = document.getElementById(date);
      const val = parseInt(input.value);
      newData[date] = isNaN(val) ? defaultOccupants[date] : val;
    });

    localStorage.setItem("nightlyOccupants", JSON.stringify(newData));

    const newPrice = parseFloat(document.getElementById("totalPrice").value);
    localStorage.setItem("totalPrice", isNaN(newPrice) ? defaultTotalPrice : newPrice);

    document.getElementById("status").innerText = "✅ Données enregistrées avec succès.";
  });

  // ♻️ Bouton Réinitialiser
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
      localStorage.removeItem("nightlyOccupants");
      localStorage.removeItem("totalPrice");
      location.reload();
    }
  });

  // 🛠 Fonctions utilitaires
  function getSavedOccupants() {
    const data = localStorage.getItem("nightlyOccupants");
    return data ? JSON.parse(data) : {};
  }

  function formatDate(dateStr) {
    const options = { day: '2-digit', month: '2-digit' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  }
});
