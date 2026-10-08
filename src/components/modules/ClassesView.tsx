import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ClassDefinition } from '../../types';
import { Modal } from '../common/Modal';
import {
  School,
  Plus,
  Users,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, students, teachers, addClass, updateClass, deleteClass } = useSchool();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDefinition | null>(null);

  const [className, setClassName] = useState('');
  const [divisionsText, setDivisionsText] = useState('A, B');
  const [subjectsText, setSubjectsText] = useState('English, Gujarati, Mathematics, Science');
  const [classTeacher, setClassTeacher] = useState('');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('');
    setDivisionsText('A, B');
    setSubjectsText('English, Mathematics, Science, Social Studies, Gujarati');
    setClassTeacher(teachers[0]?.name || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassDefinition) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setDivisionsText(cls.divisions.join(', '));
    setSubjectsText(cls.subjects.join(', '));
    setClassTeacher(cls.classTeacher || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    const divisions = divisionsText
      .split(',')
      .map((d) => d.trim().toUpperCase())
      .filter(Boolean);

    const subjects = subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingClass) {
      updateClass(editingClass.id, {
        name: className.trim(),
        divisions,
        subjects,
        classTeacher
      });
    } else {
      addClass({
        name: className.trim(),
        divisions,
        subjects,
        classTeacher
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <School className="w-6 h-6 text-emerald-600" />
            <span>Class & Division Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard grades Nursery through 12th, division sections & appointed class teachers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const studentCount = students.filter((s) => s.class === cls.name).length;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center border border-emerald-200">
                      {cls.name}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Class {cls.name}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {cls.divisions.length} Division Sections
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {studentCount} Students
                  </span>
                </div>

                {/* Divisions Badges */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Sections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.divisions.map((div) => (
                      <span
                        key={div}
                        className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        Section {div}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Appointed Teacher */}
                <div className="mb-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Class Teacher:
                  </span>
                  <span className="font-bold text-slate-800">
                    {cls.classTeacher || 'Assigned per Term'}
                  </span>
                </div>

                {/* Subjects Preview */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Curriculum Subjects ({cls.subjects.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.slice(0, 4).map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {sub}
                      </span>
                    ))}
                    {cls.subjects.length > 4 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                        +{cls.subjects.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Edit Class Structure"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove Class ${cls.name}?`)) {
                      deleteClass(cls.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? `Edit Class ${editingClass.name}` : 'Add Standard Class'}
        subtitle="Configure sections, assigned subjects and class teacher"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Class Name / Standard <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1st, 10th, 11th Science"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Divisions (Comma Separated) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="A, B, C, D"
              value={divisionsText}
              onChange={(e) => setDivisionsText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assigned Class Teacher
            </label>
            <select
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Select Class Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subjects (Comma Separated)
            </label>
            <textarea
              rows={3}
              placeholder="English, Mathematics, Science, Social Studies, Gujarati, Computer"
              value={subjectsText}
              onChange={(e) => setSubjectsText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Save Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
