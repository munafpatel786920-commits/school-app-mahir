import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolNotice, NoticeType } from '../../types';
import { Modal } from '../common/Modal';
import { Bell, Plus, Search, Calendar, Printer, Edit, Trash2, Tag, AlertCircle } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice, settings } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<SchoolNotice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<SchoolNotice | null>(null);

  const initialForm: Omit<SchoolNotice, 'id'> = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'General',
    publishedBy: 'Principal Office',
    important: false
  };

  const [formData, setFormData] = useState<Omit<SchoolNotice, 'id'>>(initialForm);

  const noticeTypes: NoticeType[] = ['General', 'Academic', 'Holiday', 'Exam', 'Sports'];

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: SchoolNotice) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      description: n.description,
      date: n.date,
      type: n.type,
      publishedBy: n.publishedBy,
      important: n.important
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingNotice) {
      updateNotice(editingNotice.id, formData);
    } else {
      addNotice(formData);
    }
    setIsModalOpen(false);
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      searchTerm === '' ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || n.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>School Notice Board & Official Circulars</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exam schedules, public holiday notices, academic circulars & administrative announcements
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Circular</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars by keywords..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Circular Types</option>
          {noticeTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border ${
              n.important ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {n.type}
                  </span>
                  {n.important && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">{n.date}</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mt-2">{n.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                {n.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                Issued By: <strong className="text-slate-700">{n.publishedBy}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewingNotice(n)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Circular</span>
                </button>
                <button
                  onClick={() => handleOpenEdit(n)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNotice ? 'Edit Notice Circular' : 'Publish School Circular'}
        subtitle="School bulletin and student-parent broadcasts"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Science Exhibition & Working Model Submissions"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as NoticeType })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {noticeTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

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
              <label className="block font-semibold text-slate-700 mb-1">Published By</label>
              <input
                type="text"
                required
                value={formData.publishedBy}
                onChange={(e) => setFormData({ ...formData, publishedBy: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="importantNotice"
                checked={formData.important}
                onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600"
              />
              <label htmlFor="importantNotice" className="font-semibold text-slate-700 cursor-pointer">
                Mark as High Priority / Urgent
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Circular Body</label>
            <textarea
              rows={4}
              required
              placeholder="Full text of the announcement..."
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
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE CIRCULAR MODAL */}
      {viewingNotice && (
        <Modal
          isOpen={Boolean(viewingNotice)}
          onClose={() => setViewingNotice(null)}
          title={`Circular: ${viewingNotice.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Circular</span>
              </button>
            </div>

            <div className="border-2 border-slate-900 p-8 rounded-2xl bg-white space-y-6 text-slate-900 font-serif">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 font-sans">
                <h2 className="text-xl font-black uppercase tracking-tight">{settings.schoolName}</h2>
                <p className="text-xs text-slate-600">{settings.address}, {settings.city}, {settings.state}</p>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  Official Administrative Circular
                </div>
              </div>

              {/* Date & Ref */}
              <div className="flex justify-between text-xs font-sans font-semibold text-slate-700">
                <span>Ref: SPS/CIR/2026/088</span>
                <span>Date: {viewingNotice.date}</span>
              </div>

              {/* Subject */}
              <div className="text-center font-bold text-base uppercase underline font-sans text-slate-900">
                SUBJECT: {viewingNotice.title}
              </div>

              {/* Body */}
              <div className="text-sm leading-relaxed text-slate-800 space-y-3">
                <p>{viewingNotice.description}</p>
                <p>
                  All concerned teachers, students, and parents are requested to take note of the above circular and adhere strictly to the instructed schedule.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-12 flex justify-between items-end font-sans">
                <div>
                  <span className="text-xs text-slate-500 block">Issued By:</span>
                  <span className="text-xs font-bold text-slate-800">{viewingNotice.publishedBy}</span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-serif font-black italic text-slate-900 mb-1">
                    {settings.principalSignatureText}
                  </div>
                  <div className="w-40 border-b border-slate-800 mb-1" />
                  <span className="text-[10px] font-bold uppercase text-slate-700">
                    Principal & Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
