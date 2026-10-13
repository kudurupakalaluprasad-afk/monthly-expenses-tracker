import { MONTH_NAMES } from '../constants/expenseConstants';

/**
 * Currency formatter - formats numerical values to standard USD format ($X,XXX.XX)
 */
export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(val || 0);
};

/**
 * Date formatter - formats 'YYYY-MM-DD' to 'Oct 12, 2026'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month, 10) - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Short Date formatter - formats 'YYYY-MM-DD' to 'Oct 12'
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month, 10) - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns current month key in 'YYYY-MM' format
 */
export const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Extracts 'YYYY-MM' key from 'YYYY-MM-DD'
 */
export const getMonthKey = (dateString) => {
  if (!dateString) return '';
  return dateString.substring(0, 7);
};

/**
 * Parses 'YYYY-MM' into year (number) and month (1-12)
 */
export const parseMonthKey = (monthKey) => {
  if (!monthKey || monthKey === 'all') return null;
  const [yearStr, monthStr] = monthKey.split('-');
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10),
  };
};

/**
 * Formats 'YYYY-MM' into full label e.g. 'October 2026'
 */
export const formatMonthLabel = (monthKey) => {
  if (!monthKey || monthKey === 'all') return 'All Time';
  const parsed = parseMonthKey(monthKey);
  if (!parsed || isNaN(parsed.year) || isNaN(parsed.month)) return monthKey;
  const monthName = MONTH_NAMES[parsed.month - 1] || '';
  return `${monthName} ${parsed.year}`;
};

/**
 * Returns adjacent month key given an offset (-1 for previous month, +1 for next month)
 */
export const getAdjacentMonth = (monthKey, offset) => {
  const parsed = parseMonthKey(monthKey);
  if (!parsed) {
    const now = new Date();
    parsed.year = now.getFullYear();
    parsed.month = now.getMonth() + 1;
  }

  // Create date pointing to the 1st of that month, then shift
  const date = new Date(parsed.year, parsed.month - 1 + offset, 1);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${nextYear}-${nextMonth}`;
};

/**
 * Checks if a given month key 'YYYY-MM' is the current calendar month
 */
export const isCurrentMonth = (monthKey) => {
  return monthKey === getCurrentMonthKey();
};
