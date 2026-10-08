import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, FileSpreadsheet, CheckCircle2, Award, Calendar, User, Plus } from 'lucide-react';

export const ReportCardView: React.FC = () => {
  const {
    students,
    exams,
    settings,
    attendance,
    getStudentAttendanceStats,
    selectedStudentIdForProfile,
    setSelectedStudentIdForProfile,
    setActiveView
  } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    selectedStudentIdForProfile || students[0]?.id || ''
  );
  const [selectedTerm, setSelectedTerm] = useState<string>('Semester 1');

  useEffect(() => {
    if (selectedStudentIdForProfile) {
      setSelectedStudentId(selectedStudentIdForProfile);
      setSelectedStudentIdForProfile(null);
    }
  }, [selectedStudentIdForProfile, setSelectedStudentIdForProfile]);

  const student = students.find((s) => s.id === selectedStudentId);

  // Find or construct exam record for this student
  const studentExam = exams.find(
    (e) => e.studentId === selectedStudentId && e.examType === selectedTerm
  ) || exams.find((e) => e.studentId === selectedStudentId);

  const attendanceStats = student ? getStudentAttendanceStats(student.id) : { totalDays: 100, presentDays: 95, percentage: 95 };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <span>Academic Progress & Report Card Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Formal A4 grade sheet, subject marks break-up, term rank & certified principal approval
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print A4 Report Card</span>
        </button>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 no-print">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Select Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} (Class {st.class}-{st.division}) • Adm #{st.admissionNo} • Roll #{st.rollNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Exam Term
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Unit Test">Unit Test</option>
            <option value="Final Exam">Final Exam</option>
          </select>
        </div>
      </div>

      {/* Official Printable Report Card Document */}
      {student && (
        <div className="max-w-4xl mx-auto bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900 font-sans print-container">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-4">
              <img
                src={settings.logoUrl}
                alt={settings.schoolName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-700 shadow-sm"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                  {settings.schoolName}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </p>
                <p className="text-[10px] text-slate-500">
                  Affiliation No: {settings.affiliationNo} • Phone: {settings.phone} • Email: {settings.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-emerald-800 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full inline-block tracking-wider mb-1">
                Progress Report Card
              </div>
              <div className="font-bold text-xs text-slate-800">
                Academic Year {settings.academicYear}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700">{selectedTerm}</div>
            </div>
          </div>

          {/* Student Biometrics & Details Card */}
          <div className="my-5 p-4 bg-slate-50 border border-slate-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">{student.name}</h3>
                {student.nameGu && (
                  <div className="text-xs text-slate-500 font-medium">{student.nameGu}</div>
                )}
                <div className="text-xs text-slate-600">
                  Father: <strong className="text-slate-800">{student.fatherName}</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Mother: <strong className="text-slate-800">{student.motherName}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-t sm:border-t-0 sm:border-l border-slate-300 pt-3 sm:pt-0 sm:pl-6">
              <div>
                <span className="text-slate-500 text-[10px] block">Admission No:</span>
                <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Class & Div:</span>
                <span className="font-bold text-slate-900">
                  Class {student.class} - {student.division}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Roll Number:</span>
                <span className="font-bold text-slate-900">#{student.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Attendance:</span>
                <span className="font-bold text-emerald-700">{attendanceStats.percentage}% Present</span>
              </div>
            </div>
          </div>

          {/* Subject-wise Marks Table */}
          <div className="overflow-x-auto my-5">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase tracking-wider text-[11px]">
                  <th className="p-2.5 border-r border-slate-300">Sr.</th>
                  <th className="p-2.5 border-r border-slate-300">Curriculum Subject</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Max Marks</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Passing Marks</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Marks Obtained</th>
                  <th className="p-2.5 text-center">Subject Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentExam ? (
                  studentExam.subjects.map((sub, idx) => {
                    const pct = (sub.obtainedMarks / sub.maxMarks) * 100;
                    const subGrade =
                      pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 35 ? 'D' : 'F';

                    return (
                      <tr key={sub.subject} className="border-b border-slate-200">
                        <td className="p-2.5 border-r border-slate-300 text-slate-500 font-mono text-center">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 font-bold text-slate-800">
                          {sub.subject}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono">
                          {sub.maxMarks}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono text-slate-500">
                          {sub.passingMarks}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono font-black text-slate-900 text-sm">
                          {sub.obtainedMarks}
                        </td>
                        <td className="p-2.5 text-center font-bold text-emerald-800">
                          {subGrade}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <p className="text-sm font-semibold mb-3">
                        No examination entries recorded yet for {student.name} in {selectedTerm}.
                      </p>
                      <button
                        onClick={() => setActiveView('exams')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enter Marks in Exam Management</span>
                      </button>
                    </td>
                  </tr>
                )}

                {/* Grand Total Row */}
                {studentExam && (
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <td colSpan={2} className="p-3 border-r border-slate-300 text-slate-900 font-black uppercase">
                      Grand Total Marks
                    </td>
                    <td className="p-3 border-r border-slate-300 text-center font-mono text-slate-900 font-bold">
                      {studentExam.totalMaxMarks}
                    </td>
                    <td className="p-3 border-r border-slate-300 text-center font-mono text-slate-500">
                      210
                    </td>
                    <td className="p-3 border-r border-slate-300 text-center font-mono font-black text-slate-900 text-base">
                      {studentExam.totalObtainedMarks}
                    </td>
                    <td className="p-3 text-center font-black text-emerald-800 text-base">
                      {studentExam.grade}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Performance Summary Strip */}
          {studentExam && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-center">
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentage</span>
                <span className="text-xl font-black text-slate-900">{studentExam.percentage}%</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Grade</span>
                <span className="text-xl font-black text-emerald-700">{studentExam.grade}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Result</span>
                <span
                  className={`text-xl font-black ${
                    studentExam.isPassed ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {studentExam.isPassed ? 'QUALIFIED' : 'DETRACTED'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Standing</span>
                <span className="text-xl font-black text-indigo-700">Rank #{studentExam.rank || 1}</span>
              </div>
            </div>
          )}

          {/* Teacher Remarks & Grading Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 text-xs">
            <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                Class Teacher Observation & Remarks:
              </span>
              <p className="text-slate-800 italic leading-relaxed">
                "{studentExam?.teacherRemarks || 'Punctual, attentive in classrooms and maintains disciplined deportment.'}"
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-[10px]">
              <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Standard Grading Scheme:
              </span>
              <div className="grid grid-cols-2 gap-0.5 text-slate-600 font-mono">
                <span>A+ : 90-100%</span>
                <span>A : 80-89%</span>
                <span>B+ : 70-79%</span>
                <span>B : 60-69%</span>
                <span>C : 50-59%</span>
                <span>D : 35-49%</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-12 mt-6 flex items-end justify-between border-t-2 border-slate-900">
            <div className="text-center">
              <div className="w-36 border-b border-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 uppercase">Class Teacher</span>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600/40 flex items-center justify-center text-[9px] font-bold text-emerald-800 uppercase text-center p-2 mx-auto">
                Official School Seal
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs font-serif font-black italic text-slate-900 mb-1">
                {settings.principalSignatureText}
              </div>
              <div className="w-44 border-b border-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 uppercase">
                Principal / Headmaster
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
