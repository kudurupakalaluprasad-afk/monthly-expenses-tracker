import React, { useState, useMemo } from 'react';
import { PieChart, CreditCard, Tag } from 'lucide-react';
import { CHART_PALETTE } from '../constants/expenseConstants';
import { formatCurrency, formatMonthLabel } from '../utils/formatters';

/**
 * TransactionDistributionChart Component
 * Renders a circular donut visual calculating total usage and percentage breakdown
 * for every type of transaction (Category and Payment Method).
 */
function TransactionDistributionChart({ expenses, selectedMonth }) {
  // Toggle between 'category' and 'paymentMethod'
  const [distributionType, setDistributionType] = useState('category');

  // Calculate aggregation for every type of transaction
  const { data = [], grandTotal = 0, donutSegments = [] } = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { data: [], grandTotal: 0, donutSegments: [] };
    }

    const map = new Map();
    let totalSum = 0;

    expenses.forEach((item) => {
      const key = distributionType === 'category'
        ? (item.category || 'Other')
        : (item.paymentMethod || 'Other');

      const amt = parseFloat(item.amount) || 0;
      totalSum += amt;

      if (!map.has(key)) {
        map.set(key, { name: key, total: 0, count: 0 });
      }
      const existing = map.get(key);
      existing.total += amt;
      existing.count += 1;
    });

    // Sort by largest usage first
    const list = Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .map((item, index) => {
        const percentage = totalSum > 0 ? (item.total / totalSum) * 100 : 0;
        return {
          ...item,
          color: CHART_PALETTE[index % CHART_PALETTE.length],
          percentage,
        };
      });

    // SVG Circular Donut calculations
    const RADIUS = 70;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    let cumulativePercentage = 0;
    const segments = list.map((item) => {
      const strokeDasharray = `${(item.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
      const strokeDashoffset = -((cumulativePercentage / 100) * CIRCUMFERENCE);
      cumulativePercentage += item.percentage;

      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
      };
    });

    return { data: list, grandTotal: totalSum, donutSegments: segments };
  }, [expenses, distributionType]);

  const RADIUS = 70;

  const monthSubtitle = selectedMonth && selectedMonth !== 'all'
    ? `Spending distribution for ${formatMonthLabel(selectedMonth)}`
    : 'Circular breakdown of spending across all months';

  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div className="card chart-card">
      <div className="card-header chart-header-row">
        <div className="chart-title-group">
          <div className="chart-icon-wrap icon-purple">
            <PieChart size={18} />
          </div>
          <div>
            <h2 className="card-title">Transaction Usage Distribution</h2>
            <p className="card-subtitle">{monthSubtitle}</p>
          </div>
        </div>

        {/* Toggle between Category and Payment Method */}
        <div className="type-toggle-group">
          <button
            type="button"
            className={`btn-toggle ${distributionType === 'category' ? 'active' : ''}`}
            onClick={() => setDistributionType('category')}
          >
            <Tag size={14} /> By Category
          </button>
          <button
            type="button"
            className={`btn-toggle ${distributionType === 'paymentMethod' ? 'active' : ''}`}
            onClick={() => setDistributionType('paymentMethod')}
          >
            <CreditCard size={14} /> By Payment Method
          </button>
        </div>
      </div>

      <div className="circular-chart-body">
        {/* SVG Circular Donut Visual */}
        <div className="donut-visual-container">
          <svg className="donut-svg" viewBox="0 0 200 200" width="190" height="190">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="24"
            />
            {/* Colored arc segments */}
            {donutSegments.map((seg) => (
              <circle
                key={seg.name}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="24"
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="donut-segment"
              >
                <title>{`${seg.name}: ${formatCurrency(seg.total)} (${seg.percentage.toFixed(1)}%)`}</title>
              </circle>
            ))}
          </svg>

          {/* Centered Total inside Donut */}
          <div className="donut-center-info">
            <span className="donut-center-label">Total Usage</span>
            <span className="donut-center-value">{formatCurrency(grandTotal)}</span>
            <span className="donut-center-sub">{data.length} types</span>
          </div>
        </div>

        {/* Calculation Table / Legend */}
        <div className="distribution-breakdown-list">
          <div className="breakdown-list-header">
            <span>Type of Transaction</span>
            <span>Usage & Share</span>
          </div>

          <div className="breakdown-items-scroll">
            {data.map((item) => (
              <div key={item.name} className="breakdown-row">
                <div className="breakdown-name-cell">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="breakdown-name font-medium">{item.name}</span>
                  <span className="breakdown-count text-muted">
                    ({item.count} {item.count === 1 ? 'txn' : 'txns'})
                  </span>
                </div>

                <div className="breakdown-value-cell">
                  <span className="breakdown-amount font-semibold">
                    {formatCurrency(item.total)}
                  </span>
                  <span
                    className="breakdown-percentage-pill"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDistributionChart;
