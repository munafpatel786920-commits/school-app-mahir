import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Check,
  Search,
  Users
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const {
    students,
    classes,
    attendance,
    saveStudentAttendance,
    getStudentAttendanceStats,
    settings
  } = useSchool();

  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  const [selectedClass, setSelectedClass] = useState('10th');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students for current Class & Division
  const classStudents = students.filter(
    (s) => s.class === selectedClass && s.division === selectedDivision && s.status === 'Active'
  );

  // Sync statuses whenever date, class, or division changes
  useEffect(() => {
    const existing = attendance.filter(
      (r) => r.date === selectedDate && r.class === selectedClass && r.division === selectedDivision
    );

    const statusMap: Record<string, AttendanceStatus> = {};
    const remarksMap: Record<string, string> = {};

    classStudents.forEach((st) => {
      const rec = existing.find((r) => r.studentId === st.id);
      statusMap[st.id] = rec ? rec.status : 'Present';
      remarksMap[st.id] = rec?.remarks || '';
    });

    setLocalStatuses(statusMap);
    setLocalRemarks(remarksMap);
  }, [selectedDate, selectedClass, selectedDivision, attendance, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setLocalRemarks((prev) => ({ ...prev, [studentId]: remark }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setLocalStatuses(updated);
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = classStudents.map((st) => ({
      id: `att-${selectedDate}-${st.id}`,
      date: selectedDate,
      class: selectedClass,
      division: selectedDivision,
      studentId: st.id,
      status: localStatuses[st.id] || 'Present',
      remarks: localRemarks[st.id] || ''
    }));
    saveStudentAttendance(records);
  };

  // Summary counts
  const total = classStudents.length;
  const presentCount = classStudents.filter((s) => (localStatuses[s.id] || 'Present') === 'Present').length;
  const absentCount = classStudents.filter((s) => localStatuses[s.id] === 'Absent').length;
  const leaveCount = classStudents.filter((s) => localStatuses[s.id] === 'Leave').length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  const filteredDisplayStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.rollNumber).includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            <span>Student Daily Attendance Register</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard attendance roll call, leave logs, monthly percentage calculation & reporting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Class Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  Class {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Division Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Division Section
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
              <option value="D">Division D</option>
            </select>
          </div>

          {/* Quick search in class */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter Name / Roll
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Quick Bulk Action Buttons */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={() => markAll('Present')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Students</span>
            <div className="text-xl font-black text-slate-900">{total}</div>
          </div>
          <Users className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Present</span>
            <div className="text-xl font-black text-emerald-800">{presentCount}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase">Absent</span>
            <div className="text-xl font-black text-rose-800">{absentCount}</div>
          </div>
          <XCircle className="w-5 h-5 text-rose-600" />
        </div>

        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase">On Leave / Rate</span>
            <div className="text-xl font-black text-amber-800">
              {leaveCount} ({rate}%)
            </div>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Printable School Title Header */}
        <div className="p-4 border-b border-slate-200 print-only">
          <h2 className="text-lg font-black text-center uppercase">{settings.schoolName}</h2>
          <p className="text-xs text-center text-slate-600">
            Student Attendance Sheet • Date: {selectedDate} • Class: {selectedClass}-{selectedDivision}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-14">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4 text-center">Status (Mark)</th>
                <th className="py-3 px-4">Overall %</th>
                <th className="py-3 px-4">Remarks / Excuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisplayStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No active students enrolled in Class {selectedClass} - Division {selectedDivision}.
                  </td>
                </tr>
              ) : (
                filteredDisplayStudents.map((st) => {
                  const currentStatus = localStatuses[st.id] || 'Present';
                  const stats = getStudentAttendanceStats(st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">#{st.rollNumber}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.photoUrl}
                            alt={st.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{st.admissionNo}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">{st.fatherName}</td>

                      {/* Status Selector Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Present')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100/60'
                            }`}
                          >
                            P
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Absent')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-100/60'
                            }`}
                          >
                            A
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Leave')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'Leave'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-100/60'
                            }`}
                          >
                            L
                          </button>
                        </div>
                      </td>

                      {/* Cumulative Percentage */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                stats.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                          <span
                            className={`font-bold text-[11px] ${
                              stats.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {stats.percentage}%
                          </span>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Optional reason..."
                          value={localRemarks[st.id] || ''}
                          onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
