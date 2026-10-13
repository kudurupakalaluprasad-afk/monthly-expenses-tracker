import React from 'react';
import { Edit2, Trash2, Search, Inbox, Calendar } from 'lucide-react';
import { formatCurrency, formatDate, formatMonthLabel } from '../utils/formatters';

/**
 * ExpenseList Component
 * Displays the expenses in a clean, readable table with search filtering,
 * edit actions, delete actions, empty state, and active month indicator.
 */
function ExpenseList({
  expenses,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isLoading,
  selectedMonth,
  onClearMonthFilter,
}) {
  const isViewingAll = selectedMonth === 'all';

  return (
    <div className="card table-card">
      <div className="card-header table-header-row">
        <div>
          <div className="table-title-row">
            <h2 className="card-title">Expense Records</h2>
            {!isViewingAll && selectedMonth && (
              <span className="badge badge-filter" title="Currently filtered by month">
                <Calendar size={12} />
                {formatMonthLabel(selectedMonth)}
                {onClearMonthFilter && (
                  <button
                    type="button"
                    className="badge-remove-btn"
                    onClick={onClearMonthFilter}
                    title="View all months"
                  >
                    ×
                  </button>
                )}
              </span>
            )}
          </div>
          <p className="card-subtitle">
            {expenses.length} {expenses.length === 1 ? 'record' : 'records'} found
            {!isViewingAll && selectedMonth && ` for ${formatMonthLabel(selectedMonth)}`}
          </p>
        </div>

        {/* Search input field */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="state-message">
          <div className="spinner"></div>
          <p>Loading expenses from database...</p>
        </div>
      ) : expenses.length === 0 ? (
        /* Friendly empty state */
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={48} />
          </div>
          <h3 className="empty-state-title">
            {searchTerm
              ? 'No matching expenses found'
              : !isViewingAll && selectedMonth
              ? `No expenses recorded for ${formatMonthLabel(selectedMonth)}`
              : 'No expenses recorded yet'}
          </h3>
          <p className="empty-state-text">
            {searchTerm
              ? `No expenses match "${searchTerm}". Try a different keyword.`
              : !isViewingAll && selectedMonth
              ? `You haven't recorded any expenses in ${formatMonthLabel(selectedMonth)}. Use the form on the left to add one for this month!`
              : 'Add your first expense using the form to start tracking your monthly budget!'}
          </p>
        </div>
      ) : (
        /* Expenses Table */
        <div className="table-responsive">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th className="text-right">Amount</th>
                <th>Notes</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="expense-row">
                  <td className="col-date">{formatDate(expense.expenseDate)}</td>
                  <td className="col-title font-medium">{expense.title}</td>
                  <td className="col-category">
                    <span className="category-pill">{expense.category}</span>
                  </td>
                  <td className="col-payment">{expense.paymentMethod}</td>
                  <td className="col-amount text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="col-notes text-muted">
                    {expense.notes || <span className="text-light">—</span>}
                  </td>
                  <td className="col-actions text-center">
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-icon btn-edit"
                        title="Edit expense"
                        onClick={() => onEdit(expense)}
                      >
                        <Edit2 size={16} />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-delete"
                        title="Delete expense"
                        onClick={() => onDelete(expense.id, expense.title)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
