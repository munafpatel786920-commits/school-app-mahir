import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { formatCurrency } from '../../utils/translations';
import {
  BarChart3,
  Download,
  Printer,
  Search,
  Filter,
  Users,
  Receipt,
  GraduationCap,
  CalendarCheck,
  Award,
  Wallet,
  Bus,
  School,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    fees,
    expenses,
    exams,
    vehicles,
    attendance,
    settings
  } = useSchool();

  const [activeReportKey, setActiveReportKey] = useState<string>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const reportTabs = [
    { key: 'student', label: '1. Student Roster Report', icon: Users },
    { key: 'admission', label: '2. Admission Log Report', icon: FileSpreadsheet },
    { key: 'attendance', label: '3. Attendance Register Report', icon: CalendarCheck },
    { key: 'fee-collection', label: '4. Fee Collection Report', icon: Receipt },
    { key: 'pending-fee', label: '5. Pending Fee Dues Report', icon: Receipt },
    { key: 'teacher', label: '6. Faculty & Staff Report', icon: GraduationCap },
    { key: 'exam-result', label: '7. Exam Result Standings', icon: Award },
    { key: 'expense', label: '8. Expense Ledger Report', icon: Wallet },
    { key: 'transport', label: '9. Transport Logistics Report', icon: Bus },
    { key: 'class-summary', label: '10. Class Strength Summary', icon: School }
  ];

  // Helper to export CSV
  const handleExportCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render current report table & export data
  const renderReportContent = () => {
    switch (activeReportKey) {
      case 'student': {
        const filtered = students.filter((s) => {
          const matchCls = selectedClass === 'all' || s.class === selectedClass;
          const matchQ =
            searchTerm === '' ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
          return matchCls && matchQ;
        });

        const headers = ['Adm No', 'Student Name', 'Class', 'Div', 'Roll', 'Father Name', 'Mobile', 'City', 'Status'];
        const rows = filtered.map((s) => [
          s.admissionNo,
          s.name,
          s.class,
          s.division,
          s.rollNumber,
          s.fatherName,
          s.parentMobile,
          s.city,
          s.status
        ]);

        return {
          title: 'Official Student Directory Report',
          count: filtered.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('students_report', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.admissionNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3">{s.class}</td>
                    <td className="py-2.5 px-3">{s.division}</td>
                    <td className="py-2.5 px-3 font-bold">#{s.rollNumber}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.fatherName}</td>
                    <td className="py-2.5 px-3 font-mono">{s.parentMobile}</td>
                    <td className="py-2.5 px-3">{s.city}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'admission': {
        const filtered = [...students].sort(
          (a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
        );
        const headers = ['Adm Date', 'Admission No', 'Student Name', 'Class', 'Previous School', 'City'];
        const rows = filtered.map((s) => [
          s.admissionDate,
          s.admissionNo,
          s.name,
          s.class,
          s.previousSchool,
          s.city
        ]);

        return {
          title: 'Admissions & Enrollment History Log',
          count: filtered.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('admissions_log', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-700">{s.admissionDate}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.admissionNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">Class {s.class}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.previousSchool}</td>
                    <td className="py-2.5 px-3">{s.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'fee-collection': {
        const filtered = fees.filter((f) => {
          const matchQ =
            searchTerm === '' ||
            f.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.studentName.toLowerCase().includes(searchTerm.toLowerCase());
          return matchQ;
        });

        const headers = ['Receipt No', 'Date', 'Student Name', 'Class', 'Fee Head', 'Paid (INR)', 'Mode'];
        const rows = filtered.map((f) => [
          f.receiptNo,
          f.paymentDate,
          f.studentName,
          f.class,
          f.feeType,
          f.paidAmount,
          f.paymentMode
        ]);

        return {
          title: 'Fee Collection Ledger Statement',
          count: filtered.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('fee_collection_statement', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{f.receiptNo}</td>
                    <td className="py-2.5 px-3 text-slate-600">{f.paymentDate}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{f.studentName}</td>
                    <td className="py-2.5 px-3">{f.class}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{f.feeType}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{formatCurrency(f.paidAmount)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{f.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'pending-fee': {
        const filtered = fees.filter((f) => f.pendingAmount > 0);
        const headers = ['Receipt No', 'Student Name', 'Class', 'Fee Head', 'Total Fee', 'Paid', 'Pending (INR)'];
        const rows = filtered.map((f) => [
          f.receiptNo,
          f.studentName,
          f.class,
          f.feeType,
          f.totalFee,
          f.paidAmount,
          f.pendingAmount
        ]);

        return {
          title: 'Outstanding Fee Dues & Defaulters List',
          count: filtered.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('pending_fee_dues', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{f.receiptNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{f.studentName}</td>
                    <td className="py-2.5 px-3">{f.class}</td>
                    <td className="py-2.5 px-3">{f.feeType}</td>
                    <td className="py-2.5 px-3">{formatCurrency(f.totalFee)}</td>
                    <td className="py-2.5 px-3 text-emerald-700">{formatCurrency(f.paidAmount)}</td>
                    <td className="py-2.5 px-3 font-bold text-rose-600 font-mono text-sm">
                      {formatCurrency(f.pendingAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'teacher': {
        const headers = ['ID', 'Teacher Name', 'Subject', 'Mobile', 'Qualification', 'Salary', 'Status'];
        const rows = teachers.map((t) => [
          t.teacherId,
          t.name,
          t.subject,
          t.mobile,
          t.qualification,
          t.salary,
          t.status
        ]);

        return {
          title: 'Faculty Profiles & Compensation Roster',
          count: teachers.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('faculty_report', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold">{t.teacherId}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{t.name}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">{t.subject}</td>
                    <td className="py-2.5 px-3 font-mono">{t.mobile}</td>
                    <td className="py-2.5 px-3 text-slate-600">{t.qualification}</td>
                    <td className="py-2.5 px-3 font-bold">{formatCurrency(t.salary)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'exam-result': {
        const headers = ['Student Name', 'Class', 'Term', 'Max Marks', 'Obt Marks', 'Percentage', 'Grade', 'Result'];
        const rows = exams.map((e) => {
          const st = students.find((s) => s.id === e.studentId);
          return [
            st?.name || 'Student',
            e.class,
            e.examType,
            e.totalMaxMarks,
            e.totalObtainedMarks,
            `${e.percentage}%`,
            e.grade,
            e.isPassed ? 'PASS' : 'FAIL'
          ];
        });

        return {
          title: 'Examination Merit & Marksheet Report',
          count: exams.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('exam_merit_report', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.map((e) => {
                  const st = students.find((s) => s.id === e.studentId);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{st?.name}</td>
                      <td className="py-2.5 px-3">{e.class}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{e.examType}</td>
                      <td className="py-2.5 px-3 font-mono">{e.totalMaxMarks}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{e.totalObtainedMarks}</td>
                      <td className="py-2.5 px-3 font-bold">{e.percentage}%</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{e.grade}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">
                        {e.isPassed ? 'PASSED' : 'FAILED'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        };
      }

      case 'expense': {
        const headers = ['Date', 'Category', 'Description', 'Amount (INR)', 'Paid To', 'Mode'];
        const rows = expenses.map((e) => [
          e.date,
          e.category,
          e.description,
          e.amount,
          e.paidTo,
          e.paymentMode
        ]);

        return {
          title: 'Institutional Expense Statement',
          count: expenses.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('expense_statement', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-700">{e.date}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{e.category}</td>
                    <td className="py-2.5 px-3 text-slate-700">{e.description}</td>
                    <td className="py-2.5 px-3 font-bold text-rose-600 font-mono text-sm">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{e.paidTo}</td>
                    <td className="py-2.5 px-3 text-slate-500">{e.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'transport': {
        const headers = ['Vehicle No', 'Route', 'Driver Name', 'Mobile', 'Capacity', 'Assigned Students', 'Monthly Fare'];
        const rows = vehicles.map((v) => [
          v.vehicleNumber,
          v.route,
          v.driverName,
          v.driverMobile,
          v.capacity,
          v.assignedStudentsCount,
          v.transportFee
        ]);

        return {
          title: 'Transport Logistics & Fleet Coverage',
          count: vehicles.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('transport_fleet_report', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.vehicleNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{v.route}</td>
                    <td className="py-2.5 px-3">{v.driverName}</td>
                    <td className="py-2.5 px-3 font-mono">{v.driverMobile}</td>
                    <td className="py-2.5 px-3 font-mono">{v.capacity} Seats</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{v.assignedStudentsCount}</td>
                    <td className="py-2.5 px-3 font-bold">{formatCurrency(v.transportFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        };
      }

      case 'class-summary':
      default: {
        const headers = ['Class Name', 'Sections', 'Enrolled Students', 'Appointed Class Teacher'];
        const rows = classes.map((c) => {
          const count = students.filter((s) => s.class === c.name).length;
          return [c.name, c.divisions.join(', '), count, c.classTeacher || 'Assigned per Term'];
        });

        return {
          title: 'Class-wise Student Enrollment Summary',
          count: classes.length,
          headers,
          rows,
          exportFn: () => handleExportCsv('class_strength_summary', headers, rows),
          table: (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => {
                  const count = students.filter((s) => s.class === c.name).length;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">Class {c.name}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">
                        {c.divisions.map((d) => `Sec ${d}`).join(', ')}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{count} Students</td>
                      <td className="py-2.5 px-3 text-slate-700">{c.classTeacher || 'Assigned per Term'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        };
      }
    }
  };

  const currentReport = renderReportContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Comprehensive Reports & Data Export</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Institutional metrics, accounting balance sheets, student registers & CSV export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={currentReport.exportFn}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex gap-1.5 overflow-x-auto no-print">
        {reportTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeReportKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveReportKey(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-container">
        {/* Printable Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 uppercase tracking-tight">
              {currentReport.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {settings.schoolName} • Academic Year {settings.academicYear}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
            {currentReport.count} Total Records
          </span>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">{currentReport.table}</div>
      </div>
    </div>
  );
};
