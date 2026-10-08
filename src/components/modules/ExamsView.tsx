import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ExamRecord, ExamType, ExamSubjectMark, Student } from '../../types';
import { Modal } from '../common/Modal';
import {
  Award,
  Plus,
  Search,
  FileSpreadsheet,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Users,
  Percent,
  TrendingUp,
  Check
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const {
    exams,
    students,
    classes,
    saveExamRecord,
    deleteExamRecord,
    setActiveView,
    setSelectedStudentIdForProfile,
    settings
  } = useSchool();

  const [selectedExamType, setSelectedExamType] = useState<ExamType>('Semester 1');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [filterMarksStatus, setFilterMarksStatus] = useState<'all' | 'entered' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);

  // Form State
  const [formStudentId, setFormStudentId] = useState<string>('');
  const [formExamType, setFormExamType] = useState<ExamType>('Semester 1');
  const [formSubjects, setFormSubjects] = useState<ExamSubjectMark[]>([]);
  const [formRemarks, setFormRemarks] = useState('Excellent performance and disciplined conduct');

  // Helper to calculate Grade
  const calculateGrade = (pct: number): string => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 35) return 'D';
    return 'F';
  };

  // Helper to load default curriculum subjects for a given student's class
  const getSubjectsForStudent = (student: Student): ExamSubjectMark[] => {
    const classDef = classes.find((c) => c.name.toLowerCase() === student.class.toLowerCase());
    const subjectList = classDef?.subjects && classDef.subjects.length > 0
      ? classDef.subjects
      : ['Mathematics', 'Science', 'English', 'Social Science', 'Gujarati', 'Computer'];

    return subjectList.map((subName) => ({
      subject: subName,
      maxMarks: 100,
      passingMarks: 35,
      obtainedMarks: 80
    }));
  };

  // Open modal for a specific student
  const handleOpenForStudent = (student: Student) => {
    setEditingExam(null);
    setFormStudentId(student.id);
    setFormExamType(selectedExamType);

    // Check if an exam record already exists for this student & term
    const existing = exams.find(
      (e) => e.studentId === student.id && e.examType === selectedExamType
    );

    if (existing) {
      setEditingExam(existing);
      setFormSubjects(existing.subjects);
      setFormRemarks(existing.teacherRemarks || 'Consistent performance throughout the term');
    } else {
      setFormSubjects(getSubjectsForStudent(student));
      setFormRemarks('Hardworking and regular with syllabus completion');
    }

    setIsEntryModalOpen(true);
  };

  // Open general Add Modal
  const handleOpenGeneralAdd = () => {
    const firstStudent = students[0];
    if (firstStudent) {
      handleOpenForStudent(firstStudent);
    } else {
      setIsEntryModalOpen(true);
    }
  };

  // When student selection changes inside the modal
  const handleFormStudentChange = (stId: string) => {
    setFormStudentId(stId);
    const st = students.find((s) => s.id === stId);
    if (!st) return;

    const existing = exams.find(
      (e) => e.studentId === st.id && e.examType === formExamType
    );

    if (existing) {
      setEditingExam(existing);
      setFormSubjects(existing.subjects);
      setFormRemarks(existing.teacherRemarks);
    } else {
      setEditingExam(null);
      setFormSubjects(getSubjectsForStudent(st));
    }
  };

  // When exam term changes inside modal
  const handleFormExamTypeChange = (term: ExamType) => {
    setFormExamType(term);
    const existing = exams.find(
      (e) => e.studentId === formStudentId && e.examType === term
    );
    if (existing) {
      setEditingExam(existing);
      setFormSubjects(existing.subjects);
      setFormRemarks(existing.teacherRemarks);
    }
  };

  const handleSubjectMarkChange = (index: number, val: number) => {
    setFormSubjects((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, obtainedMarks: Math.max(0, Number(val)) } : s))
    );
  };

  const handleSubjectMaxChange = (index: number, val: number) => {
    setFormSubjects((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, maxMarks: Math.max(1, Number(val)) } : s))
    );
  };

  const handleAddCustomSubject = () => {
    const newName = prompt('Enter new subject name:');
    if (newName && newName.trim()) {
      setFormSubjects((prev) => [
        ...prev,
        { subject: newName.trim(), maxMarks: 100, passingMarks: 35, obtainedMarks: 75 }
      ]);
    }
  };

  const handleRemoveSubject = (idx: number) => {
    if (formSubjects.length <= 1) {
      alert('At least one subject is required.');
      return;
    }
    setFormSubjects((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === formStudentId);
    if (!st) {
      alert('Please select a student.');
      return;
    }

    const totalMax = formSubjects.reduce((acc, s) => acc + (s.maxMarks || 100), 0);
    const totalObt = formSubjects.reduce((acc, s) => acc + (s.obtainedMarks || 0), 0);
    const percentage = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
    const grade = calculateGrade(percentage);
    const isPassed = formSubjects.every((s) => s.obtainedMarks >= s.passingMarks);

    // Calculate class rank among students with marks
    const classExams = exams.filter(
      (ex) => ex.class === st.class && ex.examType === formExamType && ex.id !== editingExam?.id
    );
    const allPercentages = [...classExams.map((ex) => ex.percentage), percentage].sort(
      (a, b) => b - a
    );
    const computedRank = allPercentages.indexOf(percentage) + 1;

    saveExamRecord({
      id: editingExam?.id,
      examType: formExamType,
      academicYear: settings.academicYear,
      studentId: st.id,
      class: st.class,
      division: st.division,
      subjects: formSubjects,
      totalMaxMarks: totalMax,
      totalObtainedMarks: totalObt,
      percentage,
      grade,
      isPassed,
      rank: computedRank,
      teacherRemarks: formRemarks
    });

    setIsEntryModalOpen(false);
  };

  // Filter students across the school
  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesDiv = selectedDivision === 'all' || student.division === selectedDivision;

    const matchesSearch =
      searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.rollNumber) === searchTerm;

    const examRecord = exams.find(
      (e) => e.studentId === student.id && e.examType === selectedExamType
    );

    const matchesMarksStatus =
      filterMarksStatus === 'all'
        ? true
        : filterMarksStatus === 'entered'
        ? Boolean(examRecord)
        : !examRecord;

    return matchesClass && matchesDiv && matchesSearch && matchesMarksStatus;
  });

  // Calculate live modal stats
  const modalTotalMax = formSubjects.reduce((acc, s) => acc + (s.maxMarks || 100), 0);
  const modalTotalObt = formSubjects.reduce((acc, s) => acc + (s.obtainedMarks || 0), 0);
  const modalPct = modalTotalMax > 0 ? Number(((modalTotalObt / modalTotalMax) * 100).toFixed(2)) : 0;
  const modalGrade = calculateGrade(modalPct);
  const modalPassed = formSubjects.every((s) => s.obtainedMarks >= s.passingMarks);

  // Overall Statistics for current selection
  const totalInSelection = filteredStudents.length;
  const enteredCount = filteredStudents.filter((s) =>
    exams.some((e) => e.studentId === s.id && e.examType === selectedExamType)
  ).length;
  const pendingCount = totalInSelection - enteredCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Examination & Marks Register</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete student academic evaluation, marks entry, grades (A+ to F), and report card generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('report-card')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs border border-indigo-200 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Report Cards</span>
          </button>
          <button
            onClick={handleOpenGeneralAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Marks</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Students in Roster</span>
            <div className="text-xl font-black text-slate-900">{totalInSelection}</div>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Marks Evaluated</span>
            <div className="text-xl font-black text-emerald-800">{enteredCount}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase">Marks Pending</span>
            <div className="text-xl font-black text-amber-800">{pendingCount}</div>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase">Active Term</span>
            <div className="text-base font-black text-indigo-900 truncate">{selectedExamType}</div>
          </div>
          <Award className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, father's name, admission number..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          {/* Exam Term Selector */}
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
          >
            <option value="Unit Test">Unit Test</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Final Exam">Final Exam</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Classes ({students.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Class {c.name}
              </option>
            ))}
          </select>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Divisions</option>
            <option value="A">Division A</option>
            <option value="B">Division B</option>
            <option value="C">Division C</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterMarksStatus}
            onChange={(e) => setFilterMarksStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Students</option>
            <option value="entered">Marks Evaluated ({enteredCount})</option>
            <option value="pending">Marks Pending ({pendingCount})</option>
          </select>
        </div>
      </div>

      {/* Main Students & Exam Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">Roll</th>
                <th className="py-3 px-4">Student & Parent</th>
                <th className="py-3 px-4">Class & Div</th>
                <th className="py-3 px-4">Term Status</th>
                <th className="py-3 px-4">Marks (Obt / Max)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    No students found matching your criteria. Make sure students are added in Student Management.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const examRecord = exams.find(
                    (e) => e.studentId === student.id && e.examType === selectedExamType
                  );

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 px-4 text-center font-bold text-slate-700 font-mono">
                        #{student.rollNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700">
                              {student.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Adm: {student.admissionNo} • Father: {student.fatherName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          Class {student.class} - {student.division}
                        </span>
                      </td>

                      {/* Status indicator */}
                      <td className="py-3 px-4">
                        {examRecord ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Evaluated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Not Entered
                          </span>
                        )}
                      </td>

                      {/* Marks obtained */}
                      <td className="py-3 px-4">
                        {examRecord ? (
                          <span className="font-mono font-bold text-slate-900">
                            {examRecord.totalObtainedMarks} / {examRecord.totalMaxMarks}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-- / --</span>
                        )}
                      </td>

                      {/* Percentage */}
                      <td className="py-3 px-4 text-center">
                        {examRecord ? (
                          <span className="font-bold text-slate-800 font-mono">
                            {examRecord.percentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">--</span>
                        )}
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-4 text-center">
                        {examRecord ? (
                          <span
                            className={`font-black px-2 py-0.5 rounded-md text-xs ${
                              examRecord.grade.startsWith('A')
                                ? 'bg-emerald-100 text-emerald-800'
                                : examRecord.grade.startsWith('B')
                                ? 'bg-blue-100 text-blue-800'
                                : examRecord.grade === 'C'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {examRecord.grade}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      {/* Result */}
                      <td className="py-3 px-4 text-center">
                        {examRecord ? (
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                              examRecord.isPassed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {examRecord.isPassed ? 'PASSED' : 'FAILED'}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {examRecord ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedStudentIdForProfile(student.id);
                                  setActiveView('report-card');
                                }}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                                title="View & Print Official Report Card"
                              >
                                <FileSpreadsheet className="w-3 h-3" />
                                <span>Report Card</span>
                              </button>
                              <button
                                onClick={() => handleOpenForStudent(student)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Edit Marks"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteExamRecord(examRecord.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Exam Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenForStudent(student)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Enter Marks</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-slate-500 text-xs flex justify-between items-center">
          <span>
            Showing <strong>{filteredStudents.length}</strong> students for <strong>{selectedExamType}</strong>
          </span>
          <span className="text-slate-400 text-[11px]">Academic Session {settings.academicYear}</span>
        </div>
      </div>

      {/* MARKS ENTRY MODAL */}
      <Modal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        title={editingExam ? 'Edit Student Examination Marks' : 'Enter Student Examination Marks'}
        subtitle="Automatic aggregation of totals, percentage, grades (A+ to F), and pass/fail calculation"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student <span className="text-rose-500">*</span>
              </label>
              <select
                value={formStudentId}
                onChange={(e) => handleFormStudentChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} (Class {st.class}-{st.division}) - Roll #{st.rollNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Examination Term</label>
              <select
                value={formExamType}
                onChange={(e) => handleFormExamTypeChange(e.target.value as ExamType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Unit Test">Unit Test</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Final Exam">Final Exam</option>
              </select>
            </div>
          </div>

          {/* Subject-wise Marks Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Curriculum Subjects & Marks Roster
              </h4>
              <button
                type="button"
                onClick={handleAddCustomSubject}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Additional Subject
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-2.5 px-3">Subject Name</th>
                    <th className="p-2.5 px-3 w-28 text-center">Max Marks</th>
                    <th className="p-2.5 px-3 w-28 text-center">Passing Marks</th>
                    <th className="p-2.5 px-3 w-32 text-center">Obtained Marks</th>
                    <th className="p-2.5 px-2 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formSubjects.map((sub, idx) => {
                    const isSubjectPassed = sub.obtainedMarks >= sub.passingMarks;
                    return (
                      <tr key={sub.subject + idx} className="hover:bg-slate-50/50">
                        <td className="p-2 px-3 font-bold text-slate-800">{sub.subject}</td>
                        <td className="p-2 px-3 text-center">
                          <input
                            type="number"
                            min={1}
                            value={sub.maxMarks}
                            onChange={(e) => handleSubjectMaxChange(idx, Number(e.target.value))}
                            className="w-18 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                          />
                        </td>
                        <td className="p-2 px-3 text-center font-mono text-slate-500 font-bold">
                          {sub.passingMarks}
                        </td>
                        <td className="p-2 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={sub.maxMarks}
                            required
                            value={sub.obtainedMarks}
                            onChange={(e) => handleSubjectMarkChange(idx, Number(e.target.value))}
                            className={`w-20 px-2 py-1 text-center font-mono font-black text-sm rounded-lg border ${
                              isSubjectPassed
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-rose-50 border-rose-300 text-rose-900'
                            }`}
                          />
                        </td>
                        <td className="p-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="text-slate-300 hover:text-rose-600 p-1"
                            title="Remove Subject"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Dynamic Computation Preview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Grand Total</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {modalTotalObt} / {modalTotalMax}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Percentage</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {modalPct}%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Grade</span>
              <span
                className={`text-base font-black ${
                  modalGrade.startsWith('A')
                    ? 'text-emerald-700'
                    : modalGrade.startsWith('B')
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}
              >
                {modalGrade}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Result</span>
              <span
                className={`text-base font-black ${
                  modalPassed ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {modalPassed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Class Teacher Evaluation & Remarks
            </label>
            <input
              type="text"
              value={formRemarks}
              onChange={(e) => setFormRemarks(e.target.value)}
              placeholder="e.g. Good analytical acumen, regular with homework"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEntryModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Save Marks & Compute Results
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
