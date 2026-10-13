import React, { useState, useEffect } from 'react';
import { PlusCircle, Check, X, RotateCcw } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/expenseConstants';
import { getCurrentMonthKey } from '../utils/formatters';

/**
 * Computes a sensible initial date for a new expense:
 * If the active month is the current month or 'all', use today.
 * If the user has navigated to a past month (e.g. '2026-09'), default to the 1st of that month.
 */
const getDefaultDateForMonth = (selectedMonth) => {
  const today = new Date().toISOString().split('T')[0];
  if (!selectedMonth || selectedMonth === 'all') {
    return today;
  }
  const currentMonthKey = getCurrentMonthKey();
  if (selectedMonth === currentMonthKey) {
    return today;
  }
  // Selected is a past or different month: return YYYY-MM-01
  return `${selectedMonth}-01`;
};

/**
 * ExpenseForm Component
 * A reusable form used for both adding a new expense and editing an existing one.
 */
function ExpenseForm({ onSubmit, editingExpense, onCancelEdit, selectedMonth }) {
  const getInitialState = () => ({
    title: '',
    amount: '',
    category: '',
    expenseDate: getDefaultDateForMonth(selectedMonth),
    paymentMethod: 'Credit Card',
    notes: '',
  });

  const [formData, setFormData] = useState(getInitialState);
  const [validationError, setValidationError] = useState('');

  // Synchronize form when editingExpense or selectedMonth changes
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount !== undefined ? editingExpense.amount : '',
        category: editingExpense.category || '',
        expenseDate: editingExpense.expenseDate || '',
        paymentMethod: editingExpense.paymentMethod || 'Credit Card',
        notes: editingExpense.notes || '',
      });
      setValidationError('');
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        expenseDate: getDefaultDateForMonth(selectedMonth),
        paymentMethod: 'Credit Card',
        notes: '',
      });
    }
  }, [editingExpense, selectedMonth]);

  // Handle generic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationError) {
      setValidationError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setValidationError('Please enter an expense title.');
      return;
    }
    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!formData.category) {
      setValidationError('Please select an expense category.');
      return;
    }
    if (!formData.expenseDate) {
      setValidationError('Please select the date.');
      return;
    }
    if (!formData.paymentMethod) {
      setValidationError('Please select a payment method.');
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      amount: parseFloat(numericAmount.toFixed(2)),
      title: formData.title.trim(),
      notes: formData.notes.trim(),
    };

    onSubmit(payload);

    // Reset if adding new
    if (!editingExpense) {
      setFormData(getInitialState());
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setFormData(getInitialState());
    setValidationError('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const isEditing = Boolean(editingExpense);

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2 className="card-title">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        {isEditing && (
          <span className="badge badge-warning">Editing ID #{editingExpense.id}</span>
        )}
      </div>

      {validationError && (
        <div className="alert alert-error" role="alert">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form" noValidate>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g. Weekly Grocery Shopping"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount and Category (2 columns on tablet/desktop) */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($) <span className="required">*</span>
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date and Payment Method (2 columns) */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expenseDate" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              id="expenseDate"
              name="expenseDate"
              type="date"
              className="form-input"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod" className="form-label">
              Payment Method <span className="required">*</span>
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="form-select"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes (Optional) */}
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="2"
            className="form-textarea"
            placeholder="Add any extra details, receipts info, or store name..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? (
              <>
                <Check size={18} /> Update Expense
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Add Expense
              </>
            )}
          </button>

          {isEditing ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <X size={18} /> Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setFormData(getInitialState())}
            >
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
