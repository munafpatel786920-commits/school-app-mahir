import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolSettings } from '../../types';
import { Modal } from '../common/Modal';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  School,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetDemoData,
    exportDataJson,
    importDataJson,
    addToast
  } = useSchool();

  const [form, setForm] = useState<SchoolSettings>(settings);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartSchool_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Full system backup JSON exported successfully');
  };

  const handleImportBackup = () => {
    if (!jsonImportText.trim()) return;
    const success = importDataJson(jsonImportText);
    if (success) {
      setIsImportModalOpen(false);
      setJsonImportText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>School Institutional Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official institute identity, academic year, contact credentials, seals & backup restore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
          </button>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section: Basic School Info */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-600" />
              <span>School Identity & Branding</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  School Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  School Name (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={form.schoolNameGu}
                  onChange={(e) => setForm({ ...form, schoolNameGu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Tagline / Motto</label>
                <input
                  type="text"
                  value={form.schoolTagline}
                  onChange={(e) => setForm({ ...form, schoolTagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affiliation / Board Code</label>
                <input
                  type="text"
                  value={form.affiliationNo}
                  onChange={(e) => setForm({ ...form, affiliationNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Session Year</label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Prefix</label>
                <input
                  type="text"
                  value={form.receiptPrefix}
                  onChange={(e) => setForm({ ...form, receiptPrefix: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <ImageUploadField
                  label="Official School Crest / Logo"
                  value={form.logoUrl}
                  onChange={(dataUrl) => setForm({ ...form, logoUrl: dataUrl })}
                  helperText="Attach official school logo/crest image file from device (appears on receipts, report cards & ID cards)"
                  maxDimension={500}
                  shape="square"
                />
              </div>
            </div>
          </div>

          {/* Section: Principal Authority */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Headmaster / Principal Endorsement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Principal Name</label>
                <input
                  type="text"
                  required
                  value={form.principalName}
                  onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Principal Signature Title & Degrees
                </label>
                <input
                  type="text"
                  required
                  value={form.principalSignatureText}
                  onChange={(e) => setForm({ ...form, principalSignatureText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section: Address and Communications */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Address & Communications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Phone / Mobile</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Town</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State & Pincode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save School Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p>
              This will restore all initial records for <strong>Smart Public School, Ikhar</strong>, including students, teachers, classes, fees, exam marks, timetables and notices.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-xl font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetConfirmOpen(false);
              }}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
            >
              Yes, Reset Demo Data
            </button>
          </div>
        </div>
      </Modal>

      {/* RESTORE JSON BACKUP MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Restore System Database from JSON"
        maxWidth="lg"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            Paste previously exported backup JSON content into the box below to restore all modules:
          </p>
          <textarea
            rows={8}
            value={jsonImportText}
            onChange={(e) => setJsonImportText(e.target.value)}
            placeholder='{"settings": {...}, "students": [...]}'
            className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleImportBackup}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Apply Restore
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
