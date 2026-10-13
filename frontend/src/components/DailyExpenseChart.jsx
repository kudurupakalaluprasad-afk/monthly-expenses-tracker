import React, { useMemo } from 'react';
import { BarChart3, CalendarDays, TrendingUp } from 'lucide-react';
import { formatCurrency, formatShortDate, formatMonthLabel } from '../utils/formatters';

/**
 * DailyExpenseChart Component
 * Visualizes the daily expenses breakdown across every recorded day.
 * Built using pure, robust CSS & SVG bars for clean rendering without heavy dependencies.
 */
function DailyExpenseChart({ expenses, selectedMonth }) {
  // Aggregate expenses by day (YYYY-MM-DD)
  const dailyData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const map = new Map();

    expenses.forEach((item) => {
      const date = item.expenseDate || 'Unknown';
      const amt = parseFloat(item.amount) || 0;

      if (!map.has(date)) {
        map.set(date, { date, total: 0, count: 0 });
      }
      const existing = map.get(date);
      existing.total += amt;
      existing.count += 1;
    });

    // Sort chronologically ascending
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [expenses]);

  // Compute summary stats: max daily total, average daily spending
  const stats = useMemo(() => {
    if (dailyData.length === 0) return { maxTotal: 0, avgTotal: 0, peakDay: null };

    let maxTotal = 0;
    let sumTotal = 0;
    let peakDay = null;

    dailyData.forEach((day) => {
      sumTotal += day.total;
      if (day.total > maxTotal) {
        maxTotal = day.total;
        peakDay = day;
      }
    });

    return {
      maxTotal,
      avgTotal: sumTotal / dailyData.length,
      peakDay,
    };
  }, [dailyData]);

  const monthSubtitle = selectedMonth && selectedMonth !== 'all'
    ? `Daily breakdown for ${formatMonthLabel(selectedMonth)}`
    : 'Spending breakdown across all recorded days';

  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div className="card chart-card">
      <div className="card-header chart-header-row">
        <div className="chart-title-group">
          <div className="chart-icon-wrap icon-blue">
            <BarChart3 size={18} />
          </div>
          <div>
            <h2 className="card-title">Daily Spending Trend</h2>
            <p className="card-subtitle">{monthSubtitle}</p>
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="chart-stat-badges">
          <div className="stat-pill">
            <CalendarDays size={14} />
            <span>{dailyData.length} active {dailyData.length === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="stat-pill">
            <TrendingUp size={14} />
            <span>Avg: {formatCurrency(stats.avgTotal)}/day</span>
          </div>
        </div>
      </div>

      <div className="daily-chart-body">
        {/* Peak day highlight callout */}
        {stats.peakDay && (
          <div className="chart-callout">
            <span className="callout-label">Peak Spending Day:</span>
            <span className="callout-date">{formatShortDate(stats.peakDay.date)}</span>
            <span className="callout-amount font-semibold">{formatCurrency(stats.peakDay.total)}</span>
            <span className="callout-count text-muted">({stats.peakDay.count} transactions)</span>
          </div>
        )}

        {/* Visual Bar Columns */}
        <div className="daily-bars-container">
          {dailyData.map((day) => {
            const heightPercent = stats.maxTotal > 0
              ? Math.max(12, Math.round((day.total / stats.maxTotal) * 100))
              : 12;

            return (
              <div
                key={day.date}
                className="daily-bar-column"
                title={`${formatShortDate(day.date)}: ${formatCurrency(day.total)} (${day.count} txns)`}
              >
                <div className="daily-bar-amount">{formatCurrency(day.total)}</div>
                <div className="daily-bar-track">
                  <div
                    className="daily-bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
                <div className="daily-bar-label">{formatShortDate(day.date)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DailyExpenseChart;
