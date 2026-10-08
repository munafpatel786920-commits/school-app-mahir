import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TimetableSlot } from '../../types';
import { Modal } from '../common/Modal';
import { Clock, Printer, Edit, Plus, Calendar, School } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const { timetable, classes, teachers, saveTimetableSlot, settings } = useSchool();

  const [selectedClass, setSelectedClass] = useState('10th');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [slotDay, setSlotDay] = useState<TimetableSlot['day']>('Monday');
  const [slotPeriod, setSlotPeriod] = useState<number>(1);
  const [slotTime, setSlotTime] = useState('08:00 - 08:45');
  const [slotSubject, setSlotSubject] = useState('Mathematics');
  const [slotTeacher, setSlotTeacher] = useState(teachers[0]?.name || '');
  const [slotRoom, setSlotRoom] = useState('Room 201');

  const days: TimetableSlot['day'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultPeriodTimes: Record<number, string> = {
    1: '08:00 - 08:45',
    2: '08:45 - 09:30',
    3: '09:45 - 10:30',
    4: '10:30 - 11:15',
    5: '11:45 - 12:30',
    6: '12:30 - 01:15',
    7: '01:15 - 02:00',
    8: '02:00 - 02:40'
  };

  const handleEditSlot = (day: TimetableSlot['day'], period: number) => {
    const existing = timetable.find(
      (s) =>
        s.day === day &&
        s.period === period &&
        s.class === selectedClass &&
        s.division === selectedDivision
    );

    if (existing) {
      setEditingSlot(existing);
      setSlotDay(existing.day);
      setSlotPeriod(existing.period);
      setSlotTime(existing.time);
      setSlotSubject(existing.subject);
      setSlotTeacher(existing.teacher);
      setSlotRoom(existing.roomNumber);
    } else {
      setEditingSlot(null);
      setSlotDay(day);
      setSlotPeriod(period);
      setSlotTime(defaultPeriodTimes[period] || '08:00 - 08:45');
      setSlotSubject('Mathematics');
      setSlotTeacher(teachers[0]?.name || '');
      setSlotRoom('Room 201');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingSlot?.id || `tt-${slotDay}-${slotPeriod}-${selectedClass}-${selectedDivision}`;
    saveTimetableSlot({
      id,
      day: slotDay,
      period: slotPeriod,
      time: slotTime,
      class: selectedClass,
      division: selectedDivision,
      subject: slotSubject,
      teacher: slotTeacher,
      roomNumber: slotRoom
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-emerald-600" />
            <span>Class Timetable & Master Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Weekly 8-period matrix, teacher allocations, laboratory schedules & room planning
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Timetable</span>
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 no-print">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Standard Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Class {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Division Section
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="A">Division A</option>
            <option value="B">Division B</option>
            <option value="C">Division C</option>
          </select>
        </div>
      </div>

      {/* Timetable Weekly Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Printable Header */}
        <div className="p-4 border-b border-slate-200 print-only">
          <h2 className="text-lg font-black text-center uppercase">{settings.schoolName}</h2>
          <p className="text-xs text-center text-slate-600 font-semibold">
            Weekly Class Schedule • Class: {selectedClass} - Section: {selectedDivision} • Academic Year {settings.academicYear}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3 border-r border-slate-200 text-left min-w-[90px]">Day \ Period</th>
                {periods.map((p) => (
                  <th key={p} className="p-2.5 border-r border-slate-200 min-w-[120px]">
                    <span className="block font-black text-slate-900">Period {p}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{defaultPeriodTimes[p]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-slate-200 hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900 border-r border-slate-200 text-left bg-slate-50/30">
                    {day}
                  </td>
                  {periods.map((period) => {
                    const slot = timetable.find(
                      (s) =>
                        s.day === day &&
                        s.period === period &&
                        s.class === selectedClass &&
                        s.division === selectedDivision
                    );

                    return (
                      <td
                        key={period}
                        onClick={() => handleEditSlot(day, period)}
                        className="p-2 border-r border-slate-200 align-top cursor-pointer hover:bg-emerald-50/50 transition-colors group"
                      >
                        {slot ? (
                          <div className="bg-slate-50 group-hover:bg-emerald-100/50 p-2 rounded-xl border border-slate-200 group-hover:border-emerald-300 transition-all text-left">
                            <div className="font-extrabold text-slate-900 text-[11px] truncate">
                              {slot.subject}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                              {slot.teacher}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate mt-0.5">
                              {slot.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-slate-300 group-hover:text-emerald-600 text-xs">
                            <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Set Period ${slotPeriod} - ${slotDay}`}
        subtitle={`Class ${selectedClass}-${selectedDivision}`}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={slotSubject}
              onChange={(e) => setSlotSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Teacher</label>
            <select
              value={slotTeacher}
              onChange={(e) => setSlotTeacher(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room / Lab</label>
              <input
                type="text"
                value={slotRoom}
                onChange={(e) => setSlotRoom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
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
              Save Period Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
