import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { translations, formatCurrency } from '../../utils/translations';
import { StatCard } from '../common/StatCard';
import {
  Users,
  GraduationCap,
  Briefcase,
  School,
  CalendarCheck,
  Receipt,
  AlertCircle,
  PlusCircle,
  FileSpreadsheet,
  Bell,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    language,
    students,
    teachers,
    staff,
    classes,
    attendance,
    fees,
    expenses,
    notices,
    setActiveView,
    setSelectedStudentIdForProfile,
    setSelectedReceiptIdForPrint
  } = useSchool();

  const t = translations[language];

  // Calculations
  const totalStudents = students.filter((s) => s.status === 'Active').length;
  const totalTeachers = teachers.filter((t) => t.status === 'Active').length;
  const totalStaff = staff.filter((m) => m.status === 'Active').length;
  const totalClasses = classes.length;

  // Today's attendance percentage
  const todayStr = '2026-10-06';
  const todayRecords = attendance.filter((a) => a.date === todayStr);
  const presentCount = todayRecords.filter((a) => a.status === 'Present').length;
  const todayAttendanceRate =
    todayRecords.length > 0 ? Math.round((presentCount / todayRecords.length) * 100) : 94;

  // Financials
  const totalCollectedFees = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalPendingFees = fees.reduce((acc, f) => acc + (f.pendingAmount || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  // Recent admissions
  const recentAdmissions = [...students]
    .sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    .slice(0, 5);

  // Recent fee payments
  const recentFees = [...fees]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  // Monthly fee chart mock points derived from real data
  const monthlyData = [
    { month: 'Jun', amount: 84000 },
    { month: 'Jul', amount: 96000 },
    { month: 'Aug', amount: 72000 },
    { month: 'Sep', amount: 110000 },
    { month: 'Oct', amount: totalCollectedFees > 100000 ? totalCollectedFees : 102500 }
  ];
  const maxMonthly = Math.max(...monthlyData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Academic Session 2026-2027 Live
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Smart Public School Portal
            </h2>
            <p className="text-emerald-100/80 text-sm mt-1 leading-relaxed">
              Ikhar, Bharuch, Gujarat • Complete management of admissions, academics, fee receipts,
              attendance registers, and official reporting.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('students')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addStudent}</span>
            </button>
            <button
              onClick={() => setActiveView('fees')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-xs border border-white/15 transition-all"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>{t.collectFee}</span>
            </button>
            <button
              onClick={() => setActiveView('student-attendance')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-xs border border-white/15 transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-teal-400" />
              <span>{t.markAttendance}</span>
            </button>
            <button
              onClick={() => setActiveView('report-card')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-xs border border-white/15 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>{t.generateReportCard}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalStudents}
          value={totalStudents}
          subValue="Across 17 class streams"
          icon={Users}
          color="indigo"
          onClick={() => setActiveView('students')}
        />
        <StatCard
          title={t.totalTeachers}
          value={totalTeachers}
          subValue="Faculty & subject specialists"
          icon={GraduationCap}
          color="emerald"
          onClick={() => setActiveView('teachers')}
        />
        <StatCard
          title={t.todayAttendance}
          value={`${todayAttendanceRate}%`}
          subValue={`${presentCount} present today`}
          icon={CalendarCheck}
          color="sky"
          onClick={() => setActiveView('student-attendance')}
        />
        <StatCard
          title={t.feeCollection}
          value={formatCurrency(totalCollectedFees)}
          subValue={`Pending: ${formatCurrency(totalPendingFees)}`}
          icon={Receipt}
          color="amber"
          onClick={() => setActiveView('fees')}
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalStaff}</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{totalStaff} Members</div>
            <div className="text-xs text-slate-400">Accountant, clerk, transport, security</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalClasses}</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{totalClasses} Active Classes</div>
            <div className="text-xs text-slate-400">Nursery to 12th Sci & Comm</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <School className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</div>
            <div className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(totalExpenses)}</div>
            <div className="text-xs text-rose-500 font-semibold">Tracked via School Accounts</div>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Monthly Collection Chart & Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Fee Collection Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Fee Collection Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Academic Session 2026-2027 Inflow (INR)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +14% vs Previous Term
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-4 pt-6 px-4 pb-2 border-b border-slate-100">
            {monthlyData.map((item) => {
              const heightPercent = Math.max(15, Math.round((item.amount / maxMonthly) * 100));
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] bg-linear-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-300 shadow-sm relative cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600 mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-600" />
              <span>Tuition & Laboratory Fees</span>
            </div>
            <button
              onClick={() => setActiveView('reports')}
              className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Detailed Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Attendance & Class Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Attendance Roster</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Today
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Class 10th-A (Secondary)</span>
                  <span className="text-emerald-600 font-bold">96% Present</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Class 9th-A (Secondary)</span>
                  <span className="text-emerald-600 font-bold">92% Present</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Class 8th-A (Upper Primary)</span>
                  <span className="text-emerald-600 font-bold">98% Present</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Primary & Kindergarten</span>
                  <span className="text-emerald-600 font-bold">94% Present</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-6">
            <button
              onClick={() => setActiveView('student-attendance')}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              Open Daily Attendance Sheet <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Admissions & Recent Fee Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.recentAdmissions}</h3>
              <p className="text-xs text-slate-500">Latest enrolled students</p>
            </div>
            <button
              onClick={() => setActiveView('students')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              All Students ({students.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAdmissions.map((student) => (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudentIdForProfile(student.id);
                  setActiveView('students');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600">
                      {student.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Class {student.class}-{student.division} • Adm #{student.admissionNo}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {student.status}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">{student.admissionDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fee Payments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.recentPayments}</h3>
              <p className="text-xs text-slate-500">Recent cash & online collection</p>
            </div>
            <button
              onClick={() => setActiveView('fees')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              View Accounts ({fees.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentFees.map((fee) => (
              <div
                key={fee.id}
                onClick={() => {
                  setSelectedReceiptIdForPrint(fee.id);
                  setActiveView('fees');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-200">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600">
                      {fee.studentName}
                    </div>
                    <div className="text-xs text-slate-500">
                      Receipt #{fee.receiptNo} • {fee.paymentMode}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{formatCurrency(fee.paidAmount)}</div>
                  <div className="text-[11px] font-semibold text-emerald-600">{fee.feeType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* School Notice Board Teaser */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Latest Bulletin</div>
            <div className="text-sm font-semibold text-white">
              {notices[0]?.title || 'Mid-Term Examinations Schedule Announced'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveView('notices')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700 shrink-0"
        >
          View All Bulletins
        </button>
      </div>
    </div>
  );
};
