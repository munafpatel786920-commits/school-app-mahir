import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher } from '../../types';
import { translations, formatCurrency } from '../../utils/translations';
import { Modal } from '../common/Modal';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    language,
    settings,
    teacherAttendance
  } = useSchool();

  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormData: Omit<Teacher, 'id'> = {
    teacherId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
    name: '',
    fatherName: '',
    mobile: '',
    email: '',
    address: 'Ikhar, Bharuch, Gujarat',
    dob: '1990-01-01',
    qualification: 'M.Sc., B.Ed.',
    subject: 'Mathematics',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 35000,
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  };

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>(initialFormData);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      ...initialFormData,
      teacherId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      teacherId: teacher.teacherId,
      name: teacher.name,
      fatherName: teacher.fatherName,
      mobile: teacher.mobile,
      email: teacher.email,
      address: teacher.address,
      dob: teacher.dob,
      qualification: teacher.qualification,
      subject: teacher.subject,
      joiningDate: teacher.joiningDate,
      salary: teacher.salary,
      photoUrl: teacher.photoUrl,
      status: teacher.status
    });
    setIsAddEditModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.subject.trim()) {
      alert('Please fill in required fields (Name, Mobile, Subject)');
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTeacher(id);
    setDeleteConfirmId(null);
    if (viewingTeacher?.id === id) setViewingTeacher(null);
  };

  // Unique Subjects for filter
  const subjectsList = Array.from(new Set(teachers.map((t) => t.subject)));

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      searchTerm === '' ||
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.mobile.includes(searchTerm);

    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>{t.teachers} Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Faculty profiles, subject specializations, qualifications & payroll records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addTeacher}</span>
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
            placeholder="Search teacher by name, subject, ID, phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjectsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => {
          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Strip */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {teacher.name}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-100 mt-0.5">
                        {teacher.subject}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      teacher.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Teacher ID:</span>
                    <span className="font-mono font-bold text-slate-800">{teacher.teacherId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Qualification:</span>
                    <span className="font-medium text-slate-700">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="font-mono text-slate-800">{teacher.mobile}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monthly Salary:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(teacher.salary)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingTeacher(teacher)}
                  className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Profile</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(teacher.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT TEACHER MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher Record' : 'Add New Faculty Member'}
        subtitle="Instructor credentials, subject specialization & salary"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teacher ID</label>
              <input
                type="text"
                required
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Father's / Spouse Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject Specialization <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Science, English"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (₹)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Faculty Profile Photo"
                value={formData.photoUrl}
                onChange={(dataUrl) => setFormData({ ...formData, photoUrl: dataUrl })}
                helperText="Attach faculty photograph from device (saved into teacher profile & muster)"
                shape="square"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              Save Teacher
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW TEACHER PROFILE MODAL */}
      {viewingTeacher && (
        <Modal
          isOpen={Boolean(viewingTeacher)}
          onClose={() => setViewingTeacher(null)}
          title={`Faculty Profile: ${viewingTeacher.name}`}
          subtitle={`${viewingTeacher.subject} Teacher • ${viewingTeacher.teacherId}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Teacher Sheet</span>
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={viewingTeacher.photoUrl}
                alt={viewingTeacher.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingTeacher.name}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{viewingTeacher.subject} Department</p>
                <p className="text-xs text-slate-500 mt-1">{viewingTeacher.qualification}</p>
                <div className="mt-2 text-xs font-bold text-slate-700">
                  Status: <span className="text-emerald-700 font-bold">{viewingTeacher.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Mobile</span>
                <span className="font-mono font-bold text-slate-800">{viewingTeacher.mobile}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Email</span>
                <span className="font-bold text-slate-800 truncate block">{viewingTeacher.email || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Joining Date</span>
                <span className="font-bold text-slate-800">{viewingTeacher.joiningDate}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Monthly Salary</span>
                <span className="font-bold text-emerald-700">{formatCurrency(viewingTeacher.salary)}</span>
              </div>
              <div className="col-span-2 p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Address</span>
                <span className="font-medium text-slate-800">{viewingTeacher.address}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Teacher Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to remove this faculty record? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
