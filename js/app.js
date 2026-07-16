/**
 * Expense Tracker — Full Functionality
 * Phase 3: CRUD, DOM rendering, charts, analytics, localStorage.
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     CONSTANTS
     ═══════════════════════════════════════════ */
  var STORAGE_KEY = 'expense_tracker_data';
  var MONTHLY_INCOME = 5000;

  var CATEGORY_MAP = {
    Food:          { css: 'cat-food',          icon: 'F', color: '#7C5CFC' },
    Transport:     { css: 'cat-transport',     icon: 'T', color: '#10B981' },
    Entertainment: { css: 'cat-entertainment', icon: 'E', color: '#EC4899' },
    Shopping:      { css: 'cat-shopping',      icon: 'S', color: '#F59E0B' },
    Bills:         { css: 'cat-bills',         icon: 'B', color: '#3B82F6' },
    Health:        { css: 'cat-health',        icon: 'H', color: '#EF4444' },
    Other:         { css: 'cat-other',         icon: 'O', color: '#6B7280' }
  };

  /* ═══════════════════════════════════════════
     STATE
     ═══════════════════════════════════════════ */
  var expenses = [];

  /* ═══════════════════════════════════════════
     DOM REFERENCES
     ═══════════════════════════════════════════ */
  var form = document.getElementById('expense-form');
  var tbody = document.getElementById('expenses-tbody');
  var emptyState = document.getElementById('empty-state');
  var clearAllBtn = document.getElementById('clear-all-btn');

  var statTotal = document.getElementById('stat-total');
  var statCount = document.getElementById('stat-count');
  var statAvg = document.getElementById('stat-avg');
  var statHighest = document.getElementById('stat-highest');

  var incomeDisplay = document.getElementById('income-display');
  var expenseDisplay = document.getElementById('expense-display');
  var balanceDisplay = document.getElementById('balance-display');

  var sidebarMonthly = document.getElementById('sidebar-monthly-total');
  var sidebarSub = document.getElementById('sidebar-monthly-sub');

  var chartCanvas = document.getElementById('doughnut-chart');
  var chartLegend = document.getElementById('chart-legend');

  var clearAllWrapper = document.querySelector('.clear-all-wrapper');

  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatCurrency(amount) {
    return '$' + Number(amount).toFixed(2);
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function getCategoryInfo(category) {
    return CATEGORY_MAP[category] || CATEGORY_MAP['Other'];
  }

  /* ═══════════════════════════════════════════
     PERSISTENCE
     ═══════════════════════════════════════════ */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      /* storage full or unavailable */
    }
  }

  function loadFromStorage() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        expenses = JSON.parse(data);
      }
    } catch (e) {
      expenses = [];
    }
  }

  /* ═══════════════════════════════════════════
     CRUD
     ═══════════════════════════════════════════ */
  function addExpense(description, amount, category) {
    expenses.unshift({
      id: generateId(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: category,
      date: new Date().toISOString()
    });
    saveToStorage();
    renderAll();
  }

  function deleteExpense(id) {
    expenses = expenses.filter(function (e) { return e.id !== id; });
    saveToStorage();
    renderAll();
  }

  function clearAll() {
    expenses = [];
    saveToStorage();
    renderAll();
  }

  /* ═══════════════════════════════════════════
     RENDER — TABLE
     ═══════════════════════════════════════════ */
  function renderTable() {
    tbody.innerHTML = '';

    if (expenses.length === 0) {
      emptyState.classList.add('is-visible');
      return;
    }

    emptyState.classList.remove('is-visible');

    expenses.forEach(function (expense) {
      var info = getCategoryInfo(expense.category);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' +
          '<div class="cell-description">' +
            '<div class="cell-description-icon ' + info.css + '">' + info.icon + '</div>' +
            '<span class="cell-description-text">' + escapeHTML(expense.description) + '</span>' +
          '</div>' +
        '</td>' +
        '<td><span class="category-pill ' + info.css + '">' + escapeHTML(expense.category) + '</span></td>' +
        '<td class="cell-amount">' + formatCurrency(expense.amount) + '</td>' +
        '<td class="cell-date">' + formatDate(expense.date) + '</td>' +
        '<td class="cell-actions">' +
          '<button class="btn-icon" data-delete="' + expense.id + '" aria-label="Delete ' + escapeHTML(expense.description) + '">' +
            '<i data-lucide="trash-2" aria-hidden="true"></i>' +
          '</button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ═══════════════════════════════════════════
     RENDER — STATS
     ═══════════════════════════════════════════ */
  function renderStats() {
    var total = 0;
    var highest = 0;
    var count = expenses.length;

    expenses.forEach(function (e) {
      total += e.amount;
      if (e.amount > highest) highest = e.amount;
    });

    var avg = count > 0 ? total / count : 0;

    statTotal.textContent = formatCurrency(total);
    statCount.textContent = count;
    statAvg.textContent = formatCurrency(avg);
    statHighest.textContent = formatCurrency(highest);
  }

  /* ═══════════════════════════════════════════
     RENDER — BREAKDOWN
     ═══════════════════════════════════════════ */
  function renderBreakdown() {
    var total = 0;
    expenses.forEach(function (e) { total += e.amount; });

    var balance = MONTHLY_INCOME - total;

    incomeDisplay.textContent = formatCurrency(MONTHLY_INCOME);
    expenseDisplay.textContent = formatCurrency(total);
    balanceDisplay.textContent = formatCurrency(balance);
  }

  /* ═══════════════════════════════════════════
     RENDER — SIDEBAR
     ═══════════════════════════════════════════ */
  function renderSidebar() {
    var now = new Date();
    var monthTotal = 0;
    var monthCount = 0;

    expenses.forEach(function (e) {
      var d = new Date(e.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        monthTotal += e.amount;
        monthCount++;
      }
    });

    sidebarMonthly.textContent = formatCurrency(monthTotal);
    sidebarSub.textContent = monthCount === 0
      ? 'No expenses this month'
      : monthCount + ' expense' + (monthCount !== 1 ? 's' : '') + ' this month';
  }

  /* ═══════════════════════════════════════════
     RENDER — CHART
     ═══════════════════════════════════════════ */
  function getCategoryTotals() {
    var totals = {};
    expenses.forEach(function (e) {
      if (!totals[e.category]) {
        totals[e.category] = 0;
      }
      totals[e.category] += e.amount;
    });
    return totals;
  }

  function renderChart() {
    var ctx = chartCanvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var size = 200;

    chartCanvas.width = size * dpr;
    chartCanvas.height = size * dpr;
    chartCanvas.style.width = size + 'px';
    chartCanvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    var centerX = size / 2;
    var centerY = size / 2;
    var outerRadius = size / 2 - 4;
    var innerRadius = outerRadius * 0.62;

    ctx.clearRect(0, 0, size, size);

    var totals = getCategoryTotals();
    var categories = Object.keys(totals);
    var grandTotal = 0;

    categories.forEach(function (cat) {
      grandTotal += totals[cat];
    });

    if (grandTotal === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();

      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data', centerX, centerY);
      return;
    }

    var startAngle = -Math.PI / 2;
    var gap = 0.03;

    categories.forEach(function (cat) {
      var sliceAngle = (totals[cat] / grandTotal) * Math.PI * 2;
      var info = getCategoryInfo(cat);

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle + gap, startAngle + sliceAngle - gap);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle - gap, startAngle + gap, true);
      ctx.closePath();
      ctx.fillStyle = info.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    /* Center text */
    ctx.font = '700 22px Inter, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatCurrency(grandTotal), centerX, centerY - 6);

    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Total Spent', centerX, centerY + 14);
  }

  function renderChartLegend() {
    var totals = getCategoryTotals();
    var categories = Object.keys(totals);
    var grandTotal = 0;

    expenses.forEach(function (e) { grandTotal += e.amount; });

    if (grandTotal === 0) {
      chartLegend.innerHTML = '<p class="chart-legend-empty">No data to display</p>';
      return;
    }

    /* Sort by amount descending */
    categories.sort(function (a, b) { return totals[b] - totals[a]; });

    var html = '';
    categories.forEach(function (cat) {
      var info = getCategoryInfo(cat);
      var pct = ((totals[cat] / grandTotal) * 100).toFixed(1);
      html +=
        '<div class="legend-item">' +
          '<span class="legend-dot" style="background:' + info.color + '"></span>' +
          '<span class="legend-label">' + escapeHTML(cat) + '</span>' +
          '<span class="legend-value">' + formatCurrency(totals[cat]) + '</span>' +
          '<span class="legend-pct">' + pct + '%</span>' +
        '</div>';
    });

    chartLegend.innerHTML = html;
  }

  /* ═══════════════════════════════════════════
     RENDER ALL
     ═══════════════════════════════════════════ */
  function renderAll() {
    renderTable();
    renderStats();
    renderBreakdown();
    renderSidebar();
    renderChart();
    renderChartLegend();

    /* Show/hide clear all button */
    if (clearAllWrapper) {
      if (expenses.length > 0) {
        clearAllWrapper.classList.add('is-visible');
      } else {
        clearAllWrapper.classList.remove('is-visible');
      }
    }
  }

  /* ═══════════════════════════════════════════
     EVENT HANDLERS
     ═══════════════════════════════════════════ */
  function handleFormSubmit(e) {
    e.preventDefault();

    var descInput = document.getElementById('expense-description');
    var amountInput = document.getElementById('expense-amount');
    var categoryInput = document.getElementById('expense-category');

    var description = descInput.value.trim();
    var amount = amountInput.value;
    var category = categoryInput.value;

    if (!description || !amount || !category) return;

    addExpense(description, amount, category);

    form.reset();
    descInput.focus();
  }

  function handleTableClick(e) {
    var deleteBtn = e.target.closest('[data-delete]');
    if (!deleteBtn) return;
    deleteExpense(deleteBtn.getAttribute('data-delete'));
  }

  function handleClearAll() {
    if (expenses.length === 0) return;
    clearAll();
  }

  /* ═══════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════ */
  function init() {
    loadFromStorage();
    renderAll();

    form.addEventListener('submit', handleFormSubmit);
    tbody.addEventListener('click', handleTableClick);
    clearAllBtn.addEventListener('click', handleClearAll);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    init();
  });

})();
