import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TeacherAttendanceRecord, AttendanceStatus } from '../../types';
import {
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Users
} from 'lucide-react';

export const TeacherAttendanceView: React.FC = () => {
  const { teachers, teacherAttendance, saveTeacherAttendance, settings } = useSchool();

  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, string>>({});

  useEffect(() => {
    const existing = teacherAttendance.filter((r) => r.date === selectedDate);
    const statusMap: Record<string, AttendanceStatus> = {};
    const remarksMap: Record<string, string> = {};

    teachers.forEach((t) => {
      const rec = existing.find((r) => r.teacherId === t.id);
      statusMap[t.id] = rec ? rec.status : 'Present';
      remarksMap[t.id] = rec?.remarks || '';
    });

    setLocalStatuses(statusMap);
    setLocalRemarks(remarksMap);
  }, [selectedDate, teacherAttendance, teachers]);

  const handleStatusChange = (teacherId: string, status: AttendanceStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [teacherId]: status }));
  };

  const handleRemarkChange = (teacherId: string, remark: string) => {
    setLocalRemarks((prev) => ({ ...prev, [teacherId]: remark }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    teachers.forEach((t) => {
      updated[t.id] = status;
    });
    setLocalStatuses(updated);
  };

  const handleSave = () => {
    const records: TeacherAttendanceRecord[] = teachers.map((t) => ({
      id: `tatt-${selectedDate}-${t.id}`,
      date: selectedDate,
      teacherId: t.id,
      status: localStatuses[t.id] || 'Present',
      remarks: localRemarks[t.id] || ''
    }));
    saveTeacherAttendance(records);
  };

  const total = teachers.length;
  const presentCount = teachers.filter((t) => (localStatuses[t.id] || 'Present') === 'Present').length;
  const absentCount = teachers.filter((t) => localStatuses[t.id] === 'Absent').length;
  const leaveCount = teachers.filter((t) => localStatuses[t.id] === 'Leave').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Faculty Attendance Register</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daily teacher arrival, casual leaves & administrative muster roll
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Muster</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {/* Date & Quick Action bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Muster Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('Present')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Faculty Total</span>
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
            <span className="text-[10px] font-bold text-amber-700 uppercase">On Leave</span>
            <div className="text-xl font-black text-amber-800">{leaveCount}</div>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Teacher</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Remarks / Leave Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((teacher) => {
                const currentStatus = localStatuses[teacher.id] || 'Present';

                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.photoUrl}
                          alt={teacher.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{teacher.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{teacher.teacherId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-700">{teacher.subject}</td>

                    <td className="py-3 px-4 font-mono text-slate-700">{teacher.mobile}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(teacher.id, 'Present')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100/60'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(teacher.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-100/60'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(teacher.id, 'Leave')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            currentStatus === 'Leave'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100/60'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="e.g. Casual leave approved..."
                        value={localRemarks[teacher.id] || ''}
                        onChange={(e) => handleRemarkChange(teacher.id, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
