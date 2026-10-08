import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolExpense, ExpenseCategory, PaymentMode } from '../../types';
import { formatCurrency } from '../../utils/translations';
import { Modal } from '../common/Modal';
import {
  Wallet,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Calendar,
  Filter
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<SchoolExpense | null>(null);

  // Form State
  const initialForm: Omit<SchoolExpense, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    category: 'Electricity',
    description: '',
    amount: 5000,
    paymentMode: 'UPI/Online',
    paidTo: '',
    remarks: ''
  };

  const [formData, setFormData] = useState<Omit<SchoolExpense, 'id'>>(initialForm);

  const categories: ExpenseCategory[] = [
    'Electricity',
    'Salary',
    'Stationery',
    'Maintenance',
    'Transport',
    'Rent',
    'Other'
  ];

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: SchoolExpense) => {
    setEditingExpense(exp);
    setFormData({
      date: exp.date,
      category: exp.category,
      description: exp.description,
      amount: exp.amount,
      paymentMode: exp.paymentMode,
      paidTo: exp.paidTo,
      remarks: exp.remarks
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.amount <= 0) return;

    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      addExpense(formData);
    }
    setIsModalOpen(false);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      searchTerm === '' ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-emerald-600" />
            <span>School Expense Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Institutional operational expenditures, utility bills, maintenance & payroll outflows
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Expenses</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {formatCurrency(totalExpense)}
            </div>
            <span className="text-xs text-slate-400">{expenses.length} Voucher Records</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Highest Category</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">Salary & Payroll</div>
            <span className="text-xs text-emerald-600 font-semibold">Staff compensation</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Voucher</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {expenses.length > 0 ? formatCurrency(Math.round(totalExpense / expenses.length)) : '₹ 0'}
            </div>
            <span className="text-xs text-slate-400">Per expenditure</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or paid to recipient..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Expense Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 font-mono">Amount (INR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">{exp.date}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{exp.description}</td>
                  <td className="py-3 px-4 text-slate-700">{exp.paidTo}</td>
                  <td className="py-3 px-4 text-slate-500">{exp.paymentMode}</td>
                  <td className="py-3 px-4 font-black text-rose-600 font-mono text-sm">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(exp)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense Record' : 'Log New School Expense'}
        subtitle="Operational payments and ledger accounting"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as PaymentMode })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Cash">Cash</option>
                <option value="UPI/Online">UPI / Online</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Paid To (Vendor / Agency / Name)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DGVCL Electricity, Navrang Printers"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description / Voucher Details
            </label>
            <textarea
              rows={2}
              required
              placeholder="Provide reason, invoice number or work completed..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
