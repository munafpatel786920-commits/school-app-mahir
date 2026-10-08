import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CreditCard, Printer, Search, Filter, Phone, MapPin } from 'lucide-react';

export const IdCardsView: React.FC = () => {
  const { students, classes, settings } = useSchool();

  const [selectedClass, setSelectedClass] = useState('10th');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [viewMode, setViewMode] = useState<'batch' | 'single'>('batch');
  const [selectedSingleStudentId, setSelectedSingleStudentId] = useState(students[0]?.id || '');

  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesDiv = selectedDivision === 'all' || s.division === selectedDivision;
    return matchesClass && matchesDiv;
  });

  const singleStudent = students.find((s) => s.id === selectedSingleStudentId) || students[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Smart Student Identity Card Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard PVC CR80 format with barcodes, emergency contact numbers & school crest
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Cards</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('batch')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'batch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Batch Sheet (Class Print)
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Individual Card
            </button>
          </div>

          {viewMode === 'batch' ? (
            <>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="all">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    Class {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="all">All Divisions</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
              </select>
            </>
          ) : (
            <select
              value={selectedSingleStudentId}
              onChange={(e) => setSelectedSingleStudentId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} (Class {st.class}-{st.division})
                </option>
              ))}
            </select>
          )}
        </div>

        <span className="text-xs font-bold text-slate-400">
          Showing {viewMode === 'batch' ? filteredStudents.length : 1} Card(s)
        </span>
      </div>

      {/* BATCH GRID OR SINGLE CARD VIEW */}
      {viewMode === 'batch' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="w-full max-w-[340px] mx-auto bg-white rounded-2xl border-2 border-emerald-700 shadow-lg overflow-hidden text-slate-800 font-sans print-container"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-emerald-800 to-teal-700 text-white p-3 text-center">
                <h4 className="text-xs font-black uppercase tracking-tight leading-tight">
                  {settings.schoolName}
                </h4>
                <p className="text-[9px] text-emerald-200">
                  {settings.city}, Gujarat • {settings.academicYear}
                </p>
              </div>

              {/* Photo & Details */}
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md mb-2">
                  <img src={st.photoUrl} alt={st.name} className="w-full h-full object-cover" />
                </div>

                <div className="text-sm font-extrabold text-slate-900 leading-tight">{st.name}</div>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  CLASS {st.class} - {st.division} • ROLL #{st.rollNumber}
                </div>

                <div className="w-full text-left text-[10px] space-y-1 mt-3 pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Student ID:</span>
                    <span className="font-mono font-bold text-slate-800">{st.admissionNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Father:</span>
                    <span className="font-semibold text-slate-800">{st.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Emergency Mobile:</span>
                    <span className="font-mono font-bold text-slate-900">{st.parentMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Blood Group:</span>
                    <span className="font-bold text-rose-600">{st.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Address:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">
                      {st.city}, {st.state}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[8px] text-slate-400">
                  <span>Authorized Signature</span>
                  <span className="italic font-serif font-bold text-slate-700">
                    {settings.principalName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single Preview */
        singleStudent && (
          <div className="max-w-md mx-auto py-8">
            <div className="w-80 mx-auto bg-white rounded-2xl border-2 border-emerald-700 shadow-2xl overflow-hidden text-slate-800 font-sans print-container">
              <div className="bg-linear-to-r from-emerald-800 to-teal-700 text-white p-3.5 text-center">
                <h4 className="text-xs font-black uppercase tracking-tight leading-tight">
                  {settings.schoolName}
                </h4>
                <p className="text-[9px] text-emerald-200">
                  {settings.city}, Gujarat • {settings.academicYear}
                </p>
              </div>

              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md mb-2">
                  <img
                    src={singleStudent.photoUrl}
                    alt={singleStudent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-base font-extrabold text-slate-900 leading-tight">
                  {singleStudent.name}
                </div>
                {singleStudent.nameGu && (
                  <div className="text-xs text-slate-500 font-semibold">{singleStudent.nameGu}</div>
                )}
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200">
                  CLASS {singleStudent.class} - {singleStudent.division} • ROLL #{singleStudent.rollNumber}
                </div>

                <div className="w-full text-left text-xs space-y-1.5 mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Student ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {singleStudent.admissionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Father's Name:</span>
                    <span className="font-semibold text-slate-800">{singleStudent.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Emergency Mobile:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {singleStudent.parentMobile}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Blood Group:</span>
                    <span className="font-bold text-rose-600">{singleStudent.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Address:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[160px]">
                      {singleStudent.address}, {singleStudent.city}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
                  <span>Authorized Signature</span>
                  <span className="italic font-serif font-bold text-slate-700 text-xs">
                    {settings.principalName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
