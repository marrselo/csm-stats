export const htmlDashboard =`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard Comercial</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial;
      padding: 20px;
      background: #f5f6fa;
    }
    h2 {
      margin-top: 40px;
    }
    .controls {
      margin-bottom: 20px;
    }
    canvas {
      background: white;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>

  <h1>Dashboard</h1>

  <div class="controls">
    Agrupar por:
    <select id="groupBy">
      <option value="day">Día</option>
      <option value="week">Semana</option>
      <option value="month">Mes</option>
    </select>
  </div>

  <h2>Ventas</h2>
  <canvas id="salesChart"></canvas>

  <h2>Compras</h2>
  <canvas id="purchasesChart"></canvas>

  <h2>Cierres de Caja</h2>
  <canvas id="cashChart"></canvas>

<script>
const API_URL = "https://stats.casamarketapp.com/abstract-by-dates/acl-code/qqndcfty?format=json"; // <-- cambia esto

let rawData = [];

async function fetchData() {
  const res = await fetch(API_URL);
  const jsonData = await res.json();
  rawData = jsonData.abstractData;
  renderCharts();
}

function formatDate(dateStr, groupBy) {
  const date = new Date(dateStr);

  if (groupBy === "day") {
    return date.toISOString().slice(0, 10);
  }

  if (groupBy === "week") {
    const first = date.getDate() - date.getDay();
    const weekStart = new Date(date.setDate(first));
    return weekStart.toISOString().slice(0, 10);
  }

  if (groupBy === "month") {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
  }
}

function groupData(data, groupBy) {
  const grouped = {};

  for (const item of data) {
    const key = formatDate(item.date, groupBy);

    if (!grouped[key]) {
      grouped[key] = {
        sales: 0,
        purchases: 0,
        cash: 0
      };
    }

    grouped[key].sales += item.salesAmount;
    grouped[key].purchases += item.purchasesAmount;
    grouped[key].cash += item.cashClosingsAmount;
  }

  const labels = Object.keys(grouped).sort();

  return {
    labels,
    sales: labels.map(l => grouped[l].sales),
    purchases: labels.map(l => grouped[l].purchases),
    cash: labels.map(l => grouped[l].cash)
  };
}

let charts = {};

function createChart(ctx, label, data, labels) {
  if (charts[ctx]) charts[ctx].destroy();

  charts[ctx] = new Chart(document.getElementById(ctx), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data
      }]
    },
    options: {
      responsive: true
    }
  });
}

function renderCharts() {
  const groupBy = document.getElementById("groupBy").value;

  const grouped = groupData(rawData, groupBy);

  createChart("salesChart", "Ventas", grouped.sales, grouped.labels);
  createChart("purchasesChart", "Compras", grouped.purchases, grouped.labels);
  createChart("cashChart", "Cierres de Caja", grouped.cash, grouped.labels);
}

document.getElementById("groupBy").addEventListener("change", renderCharts);

fetchData();
</script>

</body>
</html>`