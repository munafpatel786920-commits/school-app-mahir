import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Search, Users, GraduationCap, Briefcase, Receipt, Bell, X, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    students,
    teachers,
    staff,
    fees,
    notices,
    setActiveView,
    setSelectedStudentIdForProfile,
    setSelectedReceiptIdForPrint
  } = useSchool();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedStudents = q
    ? students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.admissionNo.toLowerCase().includes(q) ||
            s.fatherName.toLowerCase().includes(q) ||
            s.class.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : [];

  const matchedTeachers = q
    ? teachers
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            t.teacherId.toLowerCase().includes(q) ||
            t.mobile.includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedStaff = q
    ? staff
        .filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.position.toLowerCase().includes(q) ||
            m.staffId.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedFees = q
    ? fees
        .filter(
          (f) =>
            f.receiptNo.toLowerCase().includes(q) ||
            f.studentName.toLowerCase().includes(q) ||
            f.feeType.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedNotices = q
    ? notices
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            n.type.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const totalResults =
    matchedStudents.length +
    matchedTeachers.length +
    matchedStaff.length +
    matchedFees.length +
    matchedNotices.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto no-print">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, teachers, staff, fees, notices..."
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-hidden text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 border border-slate-300 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type at least 1 character to search across students, teachers, staff, fees, and notices.
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Students */}
          {matchedStudents.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Students ({matchedStudents.length})
              </div>
              {matchedStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveView('students');
                    setSelectedStudentIdForProfile(s.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Class {s.class}-{s.division} • Adm #{s.admissionNo} • Roll #{s.rollNumber}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Teachers */}
          {matchedTeachers.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                Teachers ({matchedTeachers.length})
              </div>
              {matchedTeachers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveView('teachers');
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {t.subject} • {t.teacherId} • {t.mobile}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Fees */}
          {matchedFees.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-500" />
                Fee Receipts ({matchedFees.length})
              </div>
              {matchedFees.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setActiveView('fees');
                    setSelectedReceiptIdForPrint(f.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-600">
                      Receipt #{f.receiptNo} - {f.studentName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {f.feeType} • Paid ₹{f.paidAmount.toLocaleString()} • Class {f.class}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Staff */}
          {matchedStaff.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                Staff Members ({matchedStaff.length})
              </div>
              {matchedStaff.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveView('staff');
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-600">
                      {m.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {m.position} • {m.staffId} • {m.mobile}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Notices */}
          {matchedNotices.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-500" />
                Notices ({matchedNotices.length})
              </div>
              {matchedNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveView('notices');
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-rose-600">
                      {n.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {n.type} • {n.date}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
