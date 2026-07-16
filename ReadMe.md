# Expense Tracker

A clean, modern expense tracking dashboard built with vanilla HTML, CSS, and JavaScript. Log spending, categorize transactions, view analytics, and visualize where your money goes — all with a polished, premium UI and dark mode support.

## Features

- **Add expenses** with a description, amount, and category
- **7 categories**: Food, Transport, Entertainment, Shopping, Bills, Health, Other
- **Expense table** with category pills, formatted dates, and per-row delete
- **4 stat cards**: Total Expenses, Total Transactions, Daily Average, Highest Expense
- **Doughnut chart** showing spending breakdown by category with a percentage legend
- **Financial breakdown** card with income, expenses, and balance
- **Sidebar** with monthly spending summary and navigation
- **Clear All** button that resets the tracker (visible only when expenses exist)
- **Dark mode toggle** with system preference detection and localStorage persistence
- **Responsive design** — works on desktop, tablet, and mobile
- **Data persistence** via localStorage (expenses survive page refreshes)
- **Print styles** — clean black-on-white output when printing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES5-compatible, IIFE pattern) |
| Charts | Canvas 2D API (no external libraries) |
| Icons | [Lucide](https://lucide.dev) (lightweight SVG icon set) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

## Project Structure

```
expense-tracker/
├── index.html          # Semantic HTML with SEO meta tags + JSON-LD
├── css/
│   └── styles.css      # Design tokens, layout, components, dark mode, responsive
├── js/
│   └── app.js          # Data model, CRUD, rendering, chart, theme toggle
├── images/
│   └── avatar.svg      # Placeholder avatar image
├── .gitignore
└── ReadMe.md
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Open `index.html` in any modern browser. No build step or server required.

3. Start adding expenses using the form at the top of the dashboard.

## How It Works

### Data Model

Expenses are stored as an array of objects:

```javascript
[
  {
    id: "lxk5f3ab2",           // unique ID (timestamp + random)
    description: "Groceries",   // user-provided
    amount: 45.99,              // numeric value
    category: "Food",           // one of 7 categories
    date: "2025-07-16T..."      // ISO date string
  }
]
```

### Array Methods Used

| Method | Where | Purpose |
|--------|-------|---------|
| `unshift()` | `addExpense()` | Push new expense to front of array |
| `filter()` | `deleteExpense()` | Remove expense by ID |
| `forEach()` | `renderTable()`, `renderStats()`, `renderChart()` | Iterate and accumulate |
| `sort()` | `renderChartLegend()` | Sort categories by spending amount |
| `Object.keys()` | `getCategoryTotals()` | Extract category names for chart |

### Rendering Pipeline

Every mutation (add, delete, clear) triggers `renderAll()`, which calls:

1. `renderTable()` — rebuilds table rows, toggles empty state
2. `renderStats()` — recalculates total, count, average, highest
3. `renderBreakdown()` — updates income/expenses/balance card
4. `renderSidebar()` — recalculates current month's total
5. `renderChart()` — redraws the doughnut chart on canvas
6. `renderChartLegend()` — rebuilds the category legend with percentages

### Dark Mode

- Toggle via the sun/moon button in the header
- Respects `prefers-color-scheme` on first visit
- Saves preference to `localStorage` under `expense_tracker_theme`
- Uses `[data-theme="dark"]` CSS selector with token overrides

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses:
- CSS Custom Properties
- CSS Grid + Flexbox
- Canvas 2D API
- localStorage
- `prefers-color-scheme` media query

## License

This project is open source and available for personal and educational use.
