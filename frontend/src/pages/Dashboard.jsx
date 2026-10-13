import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import MonthNavigator from '../components/MonthNavigator';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import DailyExpenseChart from '../components/DailyExpenseChart';
import TransactionDistributionChart from '../components/TransactionDistributionChart';
import expenseService from '../services/expenseService';
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthKey,
  isCurrentMonth,
  getMonthKey,
} from '../utils/formatters';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

/**
 * Dashboard Page
 * Main container coordinating state management, month-by-month navigation,
 * user-scoped API calls, summary metrics, visualizations, form, and table.
 */
function Dashboard({ currentUser, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Active month navigation state (defaults to current calendar month YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthKey());

  const fetchExpenses = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await expenseService.getAllExpenses(currentUser.id);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setErrorMessage(
        'Unable to connect to the backend server. Make sure the Spring Boot application is running on port 8080 and MySQL is active.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch expenses for the currently logged in user whenever currentUser changes
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Auto-dismiss success notification after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Add or Update expense handler
  const handleSaveExpense = async (formData) => {
    setErrorMessage('');
    try {
      if (editingExpense) {
        // Update existing expense
        const payload = {
          ...formData,
          userId: currentUser?.id,
        };
        const updated = await expenseService.updateExpense(editingExpense.id, payload);
        setExpenses((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setSuccessMessage(`Expense "${updated.title}" updated successfully!`);
        setEditingExpense(null);
      } else {
        // Create new expense scoped to current user
        const payload = {
          ...formData,
          userId: currentUser?.id,
        };
        const created = await expenseService.createExpense(payload);
        setExpenses((prev) => [created, ...prev]);
        setSuccessMessage(`Expense "${created.title}" added successfully!`);

        // If the newly created expense is in a different month, optionally switch to that month
        if (created.expenseDate) {
          const createdMonthKey = getMonthKey(created.expenseDate);
          if (createdMonthKey && selectedMonth !== 'all' && selectedMonth !== createdMonthKey) {
            setSelectedMonth(createdMonthKey);
          }
        }
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrorMessage(
        editingExpense
          ? 'Failed to update expense. Please check your backend connection.'
          : 'Failed to create expense. Please check your backend connection.'
      );
    }
  };

  // Delete expense handler with confirmation
  const handleDeleteExpense = async (id, title) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${title || 'this expense'}"? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    setErrorMessage('');
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage('Expense deleted successfully!');

      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      setErrorMessage('Failed to delete expense. Please try again.');
    }
  };

  const handleStartEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Derive distinct past recorded months for quick switching
  const availableMonths = useMemo(() => {
    const map = new Map();
    const currentKey = getCurrentMonthKey();

    expenses.forEach((item) => {
      if (item.expenseDate) {
        const key = getMonthKey(item.expenseDate);
        if (!map.has(key)) {
          map.set(key, { key, total: 0, count: 0 });
        }
        const entry = map.get(key);
        entry.total += Number(item.amount) || 0;
        entry.count += 1;
      }
    });

    // Ensure current month is represented in the list
    if (!map.has(currentKey)) {
      map.set(currentKey, { key: currentKey, total: 0, count: 0 });
    }

    // Sort descending chronologically (latest first)
    return Array.from(map.values())
      .sort((a, b) => b.key.localeCompare(a.key))
      .map((item) => ({
        ...item,
        label: formatMonthLabel(item.key),
        isCurrent: item.key === currentKey,
      }));
  }, [expenses]);

  // Filter expenses by active month
  const monthlyExpenses = useMemo(() => {
    if (selectedMonth === 'all') {
      return expenses;
    }
    return expenses.filter(
      (item) => item.expenseDate && item.expenseDate.startsWith(selectedMonth)
    );
  }, [expenses, selectedMonth]);

  // Statistics for selected month
  const monthStats = useMemo(() => {
    const total = monthlyExpenses.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    );
    return {
      total,
      count: monthlyExpenses.length,
    };
  }, [monthlyExpenses]);

  // Global / all-time statistics
  const globalStats = useMemo(() => {
    let total = 0;
    expenses.forEach((item) => {
      total += Number(item.amount) || 0;
    });
    return {
      totalAllTime: total,
      totalCount: expenses.length,
    };
  }, [expenses]);

  // Filter monthly expenses further by client-side search query
  const displayedExpenses = useMemo(() => {
    if (!searchTerm.trim()) return monthlyExpenses;
    const query = searchTerm.toLowerCase().trim();
    return monthlyExpenses.filter((exp) =>
      exp.title ? exp.title.toLowerCase().includes(query) : false
    );
  }, [monthlyExpenses, searchTerm]);

  const isViewingAll = selectedMonth === 'all';
  const isViewingCurrent = isCurrentMonth(selectedMonth);

  return (
    <div className="app-layout">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <main className="main-content">
        <div className="container">
          {/* Notifications */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-error" role="alert">
              <AlertCircle size={18} />
              <div className="alert-content">
                <strong>Connection Error:</strong> {errorMessage}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={fetchExpenses}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Month Navigation Control Bar */}
          <MonthNavigator
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
            monthStats={monthStats}
          />

          {/* Metric Summary Cards */}
          <section className="summary-cards-grid">
            {/* Active Month Spending Card */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">
                  {isViewingAll ? 'All Months Spending' : `Spending (${formatMonthLabel(selectedMonth)})`}
                </span>
                <div className="metric-icon-badge badge-green">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="metric-value">{formatCurrency(monthStats.total)}</div>
              <div className="metric-footer">
                <span>
                  {isViewingAll
                    ? 'Total spending across all recorded months'
                    : isViewingCurrent
                      ? 'Current calendar month spending'
                      : `Expenditure recorded in ${formatMonthLabel(selectedMonth)}`}
                </span>
              </div>
            </div>



            {/* Transactions Count for Active Period */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">
                  {isViewingAll ? 'Total Transactions' : `Transactions in ${formatMonthLabel(selectedMonth)}`}
                </span>
                <div className="metric-icon-badge badge-purple">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="metric-value">{monthStats.count}</div>
              <div className="metric-footer">
                <span>
                  {monthStats.count === 1
                    ? '1 expense record'
                    : `${monthStats.count} expense records`}
                </span>
              </div>
            </div>
          </section>

          {/* Visualizations Section: Daily Trend + Circular Distribution Visual */}
          {monthlyExpenses.length > 0 && (
            <section className="visualizations-grid">
              {/* Daily Spending Visualization */}
              <DailyExpenseChart
                expenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />

              {/* Circular Visual for Transaction Types */}
              <TransactionDistributionChart
                expenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
            </section>
          )}

          {/* Main Content Layout: Form on Left, Table on Right */}
          <div className="dashboard-grid">
            <aside className="dashboard-form-column">
              <ExpenseForm
                onSubmit={handleSaveExpense}
                editingExpense={editingExpense}
                onCancelEdit={handleCancelEdit}
                selectedMonth={selectedMonth}
              />
            </aside>

            <section className="dashboard-table-column">
              <ExpenseList
                expenses={displayedExpenses}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleStartEdit}
                onDelete={handleDeleteExpense}
                isLoading={isLoading}
                selectedMonth={selectedMonth}
                onClearMonthFilter={() => setSelectedMonth('all')}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© Kudurupaka Lalu Prasad's Project</p>
          <span className="footer-tech">Monthly Expense Tracker</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
