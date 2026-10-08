import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { translations } from '../../utils/translations';
import { Modal } from '../common/Modal';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Printer,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  User
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    language,
    settings,
    selectedStudentIdForProfile,
    setSelectedStudentIdForProfile
  } = useSchool();

  const t = translations[language];

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check if a student was selected globally (e.g. from Dashboard or Search)
  React.useEffect(() => {
    if (selectedStudentIdForProfile) {
      const st = students.find((s) => s.id === selectedStudentIdForProfile);
      if (st) {
        setViewingStudent(st);
        setIsProfileModalOpen(true);
      }
      setSelectedStudentIdForProfile(null);
    }
  }, [selectedStudentIdForProfile, students, setSelectedStudentIdForProfile]);

  // Form State
  const initialFormData: Omit<Student, 'id'> = {
    admissionNo: `ADM-2026-${String(students.length + 1).padStart(3, '0')}`,
    name: '',
    nameGu: '',
    fatherName: '',
    motherName: '',
    dob: '2012-01-01',
    gender: 'Male',
    mobile: '',
    parentMobile: '',
    address: 'Ikhar',
    city: 'Ikhar',
    state: 'Gujarat',
    bloodGroup: 'B+',
    aadhaarNumber: '',
    class: '10th',
    division: 'A',
    rollNumber: students.length + 1,
    admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: 'Primary School, Ikhar',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    busRoute: 'Route 1 - Ikhar Local'
  };

  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormData);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      ...initialFormData,
      admissionNo: `ADM-2026-${String(students.length + 1).padStart(3, '0')}`,
      rollNumber: students.length + 1
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      admissionNo: student.admissionNo,
      name: student.name,
      nameGu: student.nameGu || '',
      fatherName: student.fatherName,
      motherName: student.motherName,
      dob: student.dob,
      gender: student.gender,
      mobile: student.mobile,
      parentMobile: student.parentMobile,
      address: student.address,
      city: student.city,
      state: student.state,
      bloodGroup: student.bloodGroup,
      aadhaarNumber: student.aadhaarNumber,
      class: student.class,
      division: student.division,
      rollNumber: student.rollNumber,
      admissionDate: student.admissionDate,
      previousSchool: student.previousSchool,
      photoUrl: student.photoUrl,
      status: student.status,
      busRoute: student.busRoute || ''
    });
    setIsAddEditModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.fatherName.trim() || !formData.parentMobile.trim()) {
      alert('Please fill in required fields (Student Name, Father Name, Parent Mobile)');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Delete Action
  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirmId(null);
    if (viewingStudent?.id === id) {
      setIsProfileModalOpen(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.rollNumber) === searchTerm;

    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesDiv = selectedDivision === 'all' || student.division === selectedDivision;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesDiv && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>{t.students} Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled students roster, personal profiles, ID cards & records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addStudent}</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, father's name, admission ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter by Class */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                Class {c.name}
              </option>
            ))}
          </select>

          {/* Filter by Division */}
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

          {/* Filter by Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Adm No / Roll</th>
                <th className="py-3.5 px-3">Class & Div</th>
                <th className="py-3.5 px-3">Parents Info</th>
                <th className="py-3.5 px-3">Contact</th>
                <th className="py-3.5 px-3">City</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No students found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700">
                            {student.name}
                          </div>
                          {student.nameGu && (
                            <div className="text-[10px] text-slate-400 font-medium">
                              {student.nameGu}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400">
                            DOB: {student.dob} ({student.gender})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Adm & Roll */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-700">{student.admissionNo}</div>
                      <div className="text-[10px] text-slate-400">Roll #{student.rollNumber}</div>
                    </td>

                    {/* Class & Div */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {student.class} - {student.division}
                      </span>
                    </td>

                    {/* Parents */}
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{student.fatherName}</div>
                      <div className="text-[10px] text-slate-400">M: {student.motherName}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{student.parentMobile}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">BG: {student.bloodGroup}</div>
                    </td>

                    {/* City */}
                    <td className="py-3 px-3 text-slate-600">
                      <div>{student.city}</div>
                      <div className="text-[10px] text-slate-400">{student.busRoute || 'Self'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {student.status === 'Active' ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5" />
                        )}
                        {student.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setViewingStudent(student);
                            setIsProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setIdCardStudent(student);
                            setIsIdCardModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                          title="Generate Student ID Card"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(student.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-slate-500 text-xs flex justify-between items-center">
          <span>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
          </span>
          <span className="text-slate-400 text-[11px]">School Session 2026-2027</span>
        </div>
      </div>

      {/* ADD / EDIT STUDENT MODAL */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingStudent ? 'Edit Student Details' : 'New Student Admission Form'}
        subtitle="Complete official student record and biometric details"
        maxWidth="3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
          {/* Section: Academic Info */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              1. Academic & Admission Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Admission Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.admissionNo}
                  onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      Class {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Division <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="A">Division A</option>
                  <option value="B">Division B</option>
                  <option value="C">Division C</option>
                  <option value="D">Division D</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                <input
                  type="number"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admission Date</label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
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
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Personal Details */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              2. Student Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zaid Munaf Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Name (ગુજરાતી)
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. ઝૈદ મુનાફ પટેલ"
                  value={formData.nameGu || ''}
                  onChange={(e) => setFormData({ ...formData, nameGu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  placeholder="xxxx xxxx xxxx"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Student Passport Photo"
                  value={formData.photoUrl}
                  onChange={(dataUrl) => setFormData({ ...formData, photoUrl: dataUrl })}
                  helperText="Attach student photograph from your device (JPG, PNG, WebP)"
                  shape="square"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Previous School</label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section: Parents & Contact Info */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              3. Parents & Address Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Father's Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit mobile"
                  value={formData.parentMobile}
                  onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Village</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transport Bus Route</label>
                <input
                  type="text"
                  value={formData.busRoute}
                  onChange={(e) => setFormData({ ...formData, busRoute: e.target.value })}
                  placeholder="e.g. Route 1 - Ikhar Local"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Full Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20"
            >
              {editingStudent ? 'Save Changes' : 'Confirm Admission'}
            </button>
          </div>
        </form>
      </Modal>

      {/* STUDENT PROFILE VIEW MODAL & PRINTABLE */}
      {viewingStudent && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title={`Student Profile: ${viewingStudent.name}`}
          subtitle={`Admission No: ${viewingStudent.admissionNo} • Class ${viewingStudent.class}-${viewingStudent.division}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Action Bar inside modal */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 no-print">
              <span className="text-xs text-slate-500 font-semibold">
                Official Student Record of {settings.schoolName}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIdCardStudent(viewingStudent);
                    setIsIdCardModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ID Card</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Profile</span>
                </button>
              </div>
            </div>

            {/* Profile printable sheet */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-xs space-y-6">
              {/* Header with School Branding */}
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={settings.logoUrl}
                    alt={settings.schoolName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      {settings.schoolName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{settings.address}, {settings.city}, {settings.state}</p>
                    <p className="text-[11px] text-slate-500">Contact: {settings.phone} • {settings.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    Official Student File
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                    {viewingStudent.admissionNo}
                  </div>
                </div>
              </div>

              {/* Top Profile Card */}
              <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <img
                  src={viewingStudent.photoUrl}
                  alt={viewingStudent.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{viewingStudent.name}</h4>
                      {viewingStudent.nameGu && (
                        <p className="text-xs text-slate-500 font-semibold">{viewingStudent.nameGu}</p>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {viewingStudent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Class & Div:</span>
                      <strong className="text-slate-800">
                        {viewingStudent.class} - {viewingStudent.division}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Roll Number:</span>
                      <strong className="text-slate-800">#{viewingStudent.rollNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Gender:</span>
                      <strong className="text-slate-800">{viewingStudent.gender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                      <strong className="text-rose-600 font-black">{viewingStudent.bloodGroup}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed 2-Column Info Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <h5 className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                    Family & Biometrics
                  </h5>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Father's Name:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.fatherName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mother's Name:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.motherName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.dob}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Aadhaar Card No:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {viewingStudent.aadhaarNumber || 'Verified on file'}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <h5 className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                    Address & Transport
                  </h5>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Parent Mobile:</span>
                    <span className="font-mono font-semibold text-emerald-700">{viewingStudent.parentMobile}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Town / Village:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.city}, {viewingStudent.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Transport:</span>
                    <span className="font-semibold text-slate-800">{viewingStudent.busRoute || 'Self Conv.'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-medium text-slate-800 text-right">{viewingStudent.address}</span>
                  </div>
                </div>
              </div>

              {/* Signature footer for print */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="text-[10px] text-slate-500 font-semibold">Class Teacher Signature</span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold font-serif text-slate-800 mb-1 italic">
                    {settings.principalSignatureText}
                  </div>
                  <div className="w-44 border-b border-slate-400 mb-1" />
                  <span className="text-[10px] text-slate-500 font-semibold">Principal / Headmaster</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* STUDENT ID CARD MODAL & PRINT */}
      {idCardStudent && (
        <Modal
          isOpen={isIdCardModalOpen}
          onClose={() => setIsIdCardModalOpen(false)}
          title={`Identity Card: ${idCardStudent.name}`}
          subtitle="Official student smart identity card"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center no-print pb-2">
              <span className="text-xs text-slate-500 font-semibold">Ready for plastic card print</span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ID Card</span>
              </button>
            </div>

            {/* Standard CR80 ID Card layout */}
            <div className="w-80 mx-auto bg-white rounded-2xl border-2 border-emerald-700 shadow-xl overflow-hidden text-slate-800 font-sans">
              {/* Header Strip */}
              <div className="bg-linear-to-r from-emerald-800 to-teal-700 text-white p-3 text-center relative">
                <h4 className="text-xs font-black uppercase tracking-tight leading-tight">
                  {settings.schoolName}
                </h4>
                <p className="text-[9px] text-emerald-200">{settings.city}, Gujarat • {settings.academicYear}</p>
              </div>

              {/* Photo & Main Details */}
              <div className="p-4 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md mb-2">
                  <img
                    src={idCardStudent.photoUrl}
                    alt={idCardStudent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-sm font-extrabold text-slate-900 leading-tight">
                  {idCardStudent.name}
                </div>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  CLASS {idCardStudent.class} - {idCardStudent.division} • ROLL #{idCardStudent.rollNumber}
                </div>

                {/* Specs Grid */}
                <div className="w-full text-left text-[10px] space-y-1 mt-3 pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Student ID:</span>
                    <span className="font-mono font-bold text-slate-800">{idCardStudent.admissionNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Father:</span>
                    <span className="font-semibold text-slate-800">{idCardStudent.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Emergency Mobile:</span>
                    <span className="font-mono font-bold text-slate-900">{idCardStudent.parentMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Blood Group:</span>
                    <span className="font-bold text-rose-600">{idCardStudent.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">City:</span>
                    <span className="font-semibold text-slate-800">{idCardStudent.city}</span>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="w-full mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[8px] text-slate-400">
                  <span>Authorized Signature</span>
                  <span className="italic font-serif font-bold text-slate-700">{settings.principalName}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Student Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to permanently remove this student record from the system?
            This will also detach their attendance and fee entries.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
