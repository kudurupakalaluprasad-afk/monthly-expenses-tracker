import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  RotateCcw,
  Layers,
} from 'lucide-react';
import {
  formatMonthLabel,
  getAdjacentMonth,
  getCurrentMonthKey,
  isCurrentMonth,
  formatCurrency,
} from '../utils/formatters';

/**
 * MonthNavigator Component
 * Allows users to navigate through past and future months, jump to any specific month,
 * see past months with recorded expenditures, or toggle to all-time view.
 */
function MonthNavigator({
  selectedMonth,
  onMonthChange,
  availableMonths = [],
  monthStats = { total: 0, count: 0 },
}) {
  const currentMonthKey = getCurrentMonthKey();
  const isViewingCurrent = isCurrentMonth(selectedMonth);
  const isViewingAll = selectedMonth === 'all';




  const handleJumpToCurrent = () => {
    onMonthChange(currentMonthKey);
  };



  return (
    <div className="card month-navigator-card">
      <div className="month-navigator-main">
        {/* Left: Month title and stepper navigation */}
        <div className="month-stepper-group">
          <div className="month-stepper-buttons">
            <div className="month-display-wrap">
              <div className="month-title-row">
                <Calendar size={18} className="month-calendar-icon" />
                <h2 className="month-title">
                  {isViewingAll ? 'All Time (All Months)' : formatMonthLabel(selectedMonth)}
                </h2>
                {!isViewingAll && (
                  <span
                    className={`badge ${isViewingCurrent ? 'badge-primary' : 'badge-neutral'}`}
                  >
                    {isViewingCurrent ? 'Current Month' : ''}
                  </span>
                )}
              </div>
              <p className="month-summary-subtitle">
                {monthStats.count === 0 ? (
                  <span className="text-muted">No expenses recorded for this period</span>
                ) : (
                  <span>
                    <strong>{formatCurrency(monthStats.total)}</strong> spent across{' '}
                    <strong>{monthStats.count}</strong> {monthStats.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & Month Picker dropdown */}
        <div className="month-actions-group">
          {/* Direct Month-Year Picker input */}
          {!isViewingAll && (
            <div className="month-picker-input-wrap">
              <label htmlFor="month-picker" className="sr-only">
                Select Month
              </label>
              <input
                id="month-picker"
                type="month"
                className="form-input month-date-picker"
                value={selectedMonth}
                onChange={(e) => {
                  if (e.target.value) {
                    onMonthChange(e.target.value);
                  }
                }}
                title="Directly pick any month and year"
              />
            </div>
          )}

          {/* Quick jump to Current Month button */}
          {!isViewingCurrent && !isViewingAll && (
            <button
              type="button"
              className="btn btn-sm btn-outline btn-quick-nav"
              onClick={handleJumpToCurrent}
              title="Jump back to current calendar month"
            >
              <RotateCcw size={14} />
              <span>Current Month</span>
            </button>
          )}
        </div>
      </div>

      {/* Available Months Quick Switcher Bar (shows past months with actual data) */}
      {availableMonths.length > 0 && (
        <div className="month-history-bar">
          <div className="month-history-label">
            <Clock size={13} />
            <span>Past Recorded Months:</span>
          </div>
          <div className="month-pills-scroll">
            {availableMonths.map((m) => {
              const isSelected = selectedMonth === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  className={`month-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => onMonthChange(m.key)}
                  title={`View ${m.label} (${m.count} txns, ${formatCurrency(m.total)})`}
                >
                  <span className="pill-month-name">{m.label}</span>
                  <span className="pill-month-amount">{formatCurrency(m.total)}</span>
                  {m.isCurrent && <span className="pill-dot" title="Current calendar month"></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthNavigator;
