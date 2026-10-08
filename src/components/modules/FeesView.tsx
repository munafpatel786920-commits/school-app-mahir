import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeePayment, FeeType, PaymentMode } from '../../types';
import { translations, formatCurrency } from '../../utils/translations';
import { Modal } from '../common/Modal';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Filter,
  FileText
} from 'lucide-react';

export const FeesView: React.FC = () => {
  const {
    fees,
    students,
    classes,
    addFeePayment,
    updateFeePayment,
    deleteFeePayment,
    settings,
    selectedReceiptIdForPrint,
    setSelectedReceiptIdForPrint
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeeType, setFilterFeeType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, paid, pending

  // Modals
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeePayment | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<FeePayment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check global receipt print request (e.g. from Dashboard or Search)
  useEffect(() => {
    if (selectedReceiptIdForPrint) {
      const rec = fees.find((f) => f.id === selectedReceiptIdForPrint);
      if (rec) {
        setViewingReceipt(rec);
      }
      setSelectedReceiptIdForPrint(null);
    }
  }, [selectedReceiptIdForPrint, fees, setSelectedReceiptIdForPrint]);

  // Form State
  const initialFormData: Omit<FeePayment, 'id' | 'receiptNo'> = {
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    fatherName: students[0]?.fatherName || '',
    class: students[0]?.class || '10th',
    division: students[0]?.division || 'A',
    academicYear: settings.academicYear,
    feeType: 'Tuition Fee',
    totalFee: 30000,
    paidAmount: 20000,
    pendingAmount: 10000,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI/Online',
    remarks: 'Term installment paid'
  };

  const [formData, setFormData] = useState<Omit<FeePayment, 'id' | 'receiptNo'>>(initialFormData);

  const handleStudentSelect = (studentId: string) => {
    const st = students.find((s) => s.id === studentId);
    if (!st) return;
    setFormData((prev) => ({
      ...prev,
      studentId: st.id,
      studentName: st.name,
      fatherName: st.fatherName,
      class: st.class,
      division: st.division
    }));
  };

  const handleTotalOrPaidChange = (total: number, paid: number) => {
    const pending = Math.max(0, total - paid);
    setFormData((prev) => ({
      ...prev,
      totalFee: total,
      paidAmount: paid,
      pendingAmount: pending
    }));
  };

  const handleOpenCollect = () => {
    setEditingFee(null);
    if (students.length > 0) {
      const st = students[0];
      setFormData({
        ...initialFormData,
        studentId: st.id,
        studentName: st.name,
        fatherName: st.fatherName,
        class: st.class,
        division: st.division
      });
    } else {
      setFormData(initialFormData);
    }
    setIsCollectModalOpen(true);
  };

  const handleOpenEdit = (fee: FeePayment) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId,
      studentName: fee.studentName,
      fatherName: fee.fatherName,
      class: fee.class,
      division: fee.division,
      academicYear: fee.academicYear,
      feeType: fee.feeType,
      totalFee: fee.totalFee,
      paidAmount: fee.paidAmount,
      pendingAmount: fee.pendingAmount,
      paymentDate: fee.paymentDate,
      paymentMode: fee.paymentMode,
      remarks: fee.remarks
    });
    setIsCollectModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paidAmount <= 0) {
      alert('Paid amount must be greater than 0');
      return;
    }

    if (editingFee) {
      updateFeePayment(editingFee.id, formData);
      setViewingReceipt({ ...editingFee, ...formData });
    } else {
      const newId = addFeePayment(formData);
      const generated = fees.find((f) => f.id === newId);
      if (generated) setViewingReceipt(generated);
    }
    setIsCollectModalOpen(false);
  };

  // Filtered List
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      searchTerm === '' ||
      fee.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.class.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterFeeType === 'all' || fee.feeType === filterFeeType;

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'paid'
        ? fee.pendingAmount === 0
        : fee.pendingAmount > 0;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>Fees & Accounts Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fee collection, official receipts, payment tracking & outstanding dues
          </p>
        </div>

        <button
          onClick={handleOpenCollect}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Collect Fee & Issue Receipt</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Collected</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {formatCurrency(totalCollected)}
            </div>
            <span className="text-xs text-emerald-600 font-semibold">{fees.length} Receipts Issued</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Dues Pending</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">
              {formatCurrency(totalPending)}
            </div>
            <span className="text-xs text-slate-400">Across active terms</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Ticket</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {fees.length > 0 ? formatCurrency(Math.round(totalCollected / fees.length)) : '₹ 0'}
            </div>
            <span className="text-xs text-slate-400">Per student receipt</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by receipt number, student name, class..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterFeeType}
            onChange={(e) => setFilterFeeType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Fee Types</option>
            <option value="Tuition Fee">Tuition Fee</option>
            <option value="Admission Fee">Admission Fee</option>
            <option value="Exam Fee">Exam Fee</option>
            <option value="Computer Fee">Computer Fee</option>
            <option value="Transport Fee">Transport Fee</option>
            <option value="Other Fee">Other Fee</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Fully Cleared (Pending ₹0)</option>
            <option value="pending">With Outstanding Balance</option>
          </select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Fee Head</th>
                <th className="py-3 px-4">Total Fee</th>
                <th className="py-3 px-4">Paid (INR)</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Date & Mode</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No fee receipts match your query.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {fee.receiptNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700">
                        {fee.studentName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Class {fee.class}-{fee.division} • {fee.fatherName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {fee.feeType}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      {formatCurrency(fee.totalFee)}
                    </td>

                    <td className="py-3 px-4 font-black text-emerald-700">
                      {formatCurrency(fee.paidAmount)}
                    </td>

                    <td className="py-3 px-4">
                      {fee.pendingAmount > 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          {formatCurrency(fee.pendingAmount)}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Nil (Cleared)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{fee.paymentDate}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{fee.paymentMode}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingReceipt(fee)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                          title="View & Print Official Receipt"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(fee)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Payment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(fee.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Receipt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLECT FEE MODAL */}
      <Modal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        title={editingFee ? 'Edit Payment Receipt' : 'Collect Student Fee'}
        subtitle="Generate authentic school money receipt"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Select Enrolled Student <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} (Class {st.class}-{st.division}) - Adm #{st.admissionNo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fee Type / Head</label>
              <select
                value={formData.feeType}
                onChange={(e) => setFormData({ ...formData, feeType: e.target.value as FeeType })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Admission Fee">Admission Fee</option>
                <option value="Exam Fee">Exam Fee</option>
                <option value="Computer Fee">Computer Fee</option>
                <option value="Transport Fee">Transport Fee</option>
                <option value="Other Fee">Other Fee</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as PaymentMode })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Cash">Cash</option>
                <option value="UPI/Online">UPI / Google Pay / PhonePe</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Fee Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.totalFee}
                onChange={(e) => handleTotalOrPaidChange(Number(e.target.value), formData.paidAmount)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Paying Amount Now (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.paidAmount}
                onChange={(e) => handleTotalOrPaidChange(formData.totalFee, Number(e.target.value))}
                className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl font-mono font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pending Balance (₹)</label>
              <input
                type="number"
                disabled
                value={formData.pendingAmount}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
              <input
                type="text"
                placeholder="e.g. Cleared 1st term dues, UPI ref #942104"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCollectModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Generate Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* OFFICIAL PRINTABLE RECEIPT MODAL */}
      {viewingReceipt && (
        <Modal
          isOpen={Boolean(viewingReceipt)}
          onClose={() => setViewingReceipt(null)}
          title={`Fee Receipt #${viewingReceipt.receiptNo}`}
          subtitle={`${viewingReceipt.studentName} • ${viewingReceipt.paymentDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>

            {/* Official School Receipt Template */}
            <div className="border-2 border-slate-800 p-6 rounded-2xl bg-white shadow-sm space-y-4 text-xs font-sans">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={settings.logoUrl}
                    alt={settings.schoolName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                  />
                  <div>
                    <h3 className="text-base font-black uppercase text-slate-900 leading-tight">
                      {settings.schoolName}
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      {settings.address}, {settings.city}, {settings.state}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Affiliation: {settings.affiliationNo} • Phone: {settings.phone}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-1 inline-block">
                    Official Fee Receipt
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs">
                    Receipt: {viewingReceipt.receiptNo}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Date: {viewingReceipt.paymentDate}
                  </div>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Student Name:</span>
                  <strong className="text-slate-900 text-sm">{viewingReceipt.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Father's Name:</span>
                  <strong className="text-slate-800">{viewingReceipt.fatherName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Class & Division:</span>
                  <strong className="text-slate-800">
                    Class {viewingReceipt.class} - Section {viewingReceipt.division}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Academic Session:</span>
                  <strong className="text-slate-800">{viewingReceipt.academicYear}</strong>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-left">Particulars / Head</th>
                    <th className="p-2 border-r border-slate-300 text-right">Total Payable</th>
                    <th className="p-2 border-r border-slate-300 text-right">Amount Received</th>
                    <th className="p-2 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 font-semibold text-slate-800">
                      {viewingReceipt.feeType}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        Mode: {viewingReceipt.paymentMode} • {viewingReceipt.remarks}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right font-mono">
                      {formatCurrency(viewingReceipt.totalFee)}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right font-mono font-bold text-emerald-800">
                      {formatCurrency(viewingReceipt.paidAmount)}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-rose-600">
                      {formatCurrency(viewingReceipt.pendingAmount)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2 border-r border-slate-300 text-slate-900">Total Net Received</td>
                    <td className="p-2 border-r border-slate-300 text-right font-mono">
                      {formatCurrency(viewingReceipt.totalFee)}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right font-mono text-emerald-800 text-sm">
                      {formatCurrency(viewingReceipt.paidAmount)}
                    </td>
                    <td className="p-2 text-right font-mono text-rose-600">
                      {formatCurrency(viewingReceipt.pendingAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footnotes & Signatures */}
              <div className="pt-6 flex justify-between items-end border-t border-slate-200">
                <div className="text-[10px] text-slate-400">
                  <p>* Fees once deposited are non-refundable.</p>
                  <p>* Valid with official school seal or cashier authorization.</p>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    Authorized Cashier
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Fee Record Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to delete this payment receipt record?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirmId) {
                  deleteFeePayment(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
