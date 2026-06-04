import { AclCompany } from "./acl-company/acl-company.entity";

export const htmlDashboard = (aclCompany:AclCompany)=>`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Dashboard ${aclCompany.nombreComercial}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body {
  font-family: Inter, Arial;
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
}

h1 { margin-bottom: 20px; }

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

select {
  padding: 6px;
  border-radius: 6px;
}

.card {
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

canvas {
  max-height: 300px;
}
</style>
</head>

<body>

<h1>📊 Dashboard Comercial - ${aclCompany.nombreComercial} - ${aclCompany.ruc}</h1>

<div class="controls">
  <label>Agrupar:
    <select id="groupBy">
      <option value="day">Día</option>
      <option value="week">Semana</option>
      <option value="month">Mes</option>
    </select>
  </label>

  <label>Métrica:
    <select id="metric">
      <option value="amount">Monto</option>
      <option value="count">Cantidad</option>
    </select>
  </label>

  <label>Ventas:
    <select id="salesMode">
      <option value="general">General</option>
      <option value="warehouse">Por Warehouse</option>
      <option value="terminal">Por Terminal</option>
    </select>
  </label>
</div>

<div class="card">
  <h2>Ventas</h2>
  <canvas id="salesChart"></canvas>
</div>

<div class="card">
  <h2>Compras</h2>
  <canvas id="purchasesChart"></canvas>
</div>

<div class="card">
  <h2>Cierres de Caja</h2>
  <canvas id="cashChart"></canvas>
</div>

<div class="card">
  <h2>Gastos</h2>
  <canvas id="expensesChart"></canvas>
</div>

<div class="card">
  <h2>SKUs</h2>
  <canvas id="skusChart"></canvas>
</div>

<script>
const API_URL = "https://stats.casamarketapp.com/abstract/dates/acl-code/${aclCompany.codeCompany}?format=json"

let data;
let charts = {};

async function init() {
  const res = await fetch(API_URL)
  data = await res.json()
  renderAll()
}

function groupKey(dateStr, mode) {
  const d = new Date(dateStr)

  if (mode === "day") return d.toISOString().slice(0,10)

  if (mode === "week") {
    const first = d.getDate() - d.getDay()
    return new Date(d.setDate(first)).toISOString().slice(0,10)
  }

  if (mode === "month") {
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0")
  }
}

function groupSimple(list, groupBy, metric) {
  const map = {}

  for (const item of list) {
    const key = groupKey(item.date, groupBy)
    if (!map[key]) map[key] = 0
    map[key] += metric === "amount" ? item.totalAmount : item.totalCount
  }

  const labels = Object.keys(map).sort()

  return {
    labels,
    values: labels.map(l => map[l])
  }
}

function groupSales(groupBy, metric, mode) {
  const map = {}
  const datasets = {}

  for (const day of data.abstractSales) {
    const key = groupKey(day.date, groupBy)

    if (!map[key]) map[key] = {}

    if (mode === "general") {
      if (!map[key].total) map[key].total = 0
      map[key].total += metric === "amount" ? day.totalAmount : day.totalCount
    }

    if (mode === "terminal") {
      for (const tId in day.terminals) {
        const val = metric === "amount"
          ? day.terminals[tId].totalAmount
          : day.terminals[tId].totalCount

        if (!map[key][tId]) map[key][tId] = 0
        map[key][tId] += val
      }
    }

    if (mode === "warehouse") {
      for (const tId in day.terminals) {
        const terminal = data.terminals.find(t => t.id == tId)
        if (!terminal) continue

        const wId = terminal.warWarehousesId

        const val = metric === "amount"
          ? day.terminals[tId].totalAmount
          : day.terminals[tId].totalCount

        if (!map[key][wId]) map[key][wId] = 0
        map[key][wId] += val
      }
    }
  }

  const labels = Object.keys(map).sort()

  const keys = new Set()
  labels.forEach(l => Object.keys(map[l]).forEach(k => keys.add(k)))

  const datasetsArr = []

  keys.forEach(k => {
    datasetsArr.push({
      label: getLabel(k, mode),
      data: labels.map(l => map[l][k] || 0)
    })
  })

  return { labels, datasets: datasetsArr }
}

function getLabel(id, mode) {
  if (mode === "general") return "Ventas"

  if (mode === "terminal") {
    return data.terminals.find(t => t.id == id)?.name || id
  }

  if (mode === "warehouse") {
    return data.warehouses.find(w => w.id == id)?.name || id
  }
}

function createChart(id, datasets, labels) {
  if (charts[id]) charts[id].destroy()

  charts[id] = new Chart(document.getElementById(id), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  })
}

function renderAll() {
  const groupBy = document.getElementById("groupBy").value
  const metric = document.getElementById("metric").value
  const salesMode = document.getElementById("salesMode").value

  // ventas
  const sales = groupSales(groupBy, metric, salesMode)
  createChart("salesChart", sales.datasets, sales.labels)

  // simples
  const purchases = groupSimple(data.abstractPurchases, groupBy, metric)
  createChart("purchasesChart", [{ label:"Compras", data:purchases.values }], purchases.labels)

  const cash = groupSimple(data.abstractCashClosings, groupBy, metric)
  createChart("cashChart", [{ label:"Caja", data:cash.values }], cash.labels)

  const expenses = groupSimple(data.abstractExpenses, groupBy, metric)
  createChart("expensesChart", [{ label:"Gastos", data:expenses.values }], expenses.labels)

  const skus = groupSimple(data.abstractSkus, groupBy, metric)
  createChart("skusChart", [{ label:"SKUs", data:skus.values }], skus.labels)
}

document.querySelectorAll("select").forEach(el =>
  el.addEventListener("change", renderAll)
)

init()
</script>

</body>
</html>`