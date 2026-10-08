/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { canRoleAccess } from './utils/permissions';

// Modules
import { DashboardView } from './components/modules/DashboardView';
import { StudentsView } from './components/modules/StudentsView';
import { TeachersView } from './components/modules/TeachersView';
import { ClassesView } from './components/modules/ClassesView';
import { StudentAttendanceView } from './components/modules/StudentAttendanceView';
import { TeacherAttendanceView } from './components/modules/TeacherAttendanceView';
import { FeesView } from './components/modules/FeesView';
import { ExamsView } from './components/modules/ExamsView';
import { ReportCardView } from './components/modules/ReportCardView';
import { HomeworkView } from './components/modules/HomeworkView';
import { TimetableView } from './components/modules/TimetableView';
import { ExpensesView } from './components/modules/ExpensesView';
import { TransportView } from './components/modules/TransportView';
import { StaffView } from './components/modules/StaffView';
import { NoticesView } from './components/modules/NoticesView';
import { CertificatesView } from './components/modules/CertificatesView';
import { IdCardsView } from './components/modules/IdCardsView';
import { ReportsView } from './components/modules/ReportsView';
import { SettingsView } from './components/modules/SettingsView';

import { ShieldAlert, ArrowLeft } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, activeView, setActiveView } = useSchool();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hasAccess = canRoleAccess(role, activeView);

  const renderActiveView = () => {
    if (!hasAccess) {
      return (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Restricted Access Module</h3>
          <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto leading-relaxed">
            Your current logged-in role (<strong>{role}</strong>) does not have authorization to view or edit this section. You can switch to <strong>Admin</strong> in the top header role menu.
          </p>
          <button
            onClick={() => setActiveView('dashboard')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'classes':
        return <ClassesView />;
      case 'student-attendance':
        return <StudentAttendanceView />;
      case 'teacher-attendance':
        return <TeacherAttendanceView />;
      case 'fees':
        return <FeesView />;
      case 'exams':
        return <ExamsView />;
      case 'report-card':
        return <ReportCardView />;
      case 'homework':
        return <HomeworkView />;
      case 'timetable':
        return <TimetableView />;
      case 'expenses':
        return <ExpensesView />;
      case 'transport':
        return <TransportView />;
      case 'staff':
        return <StaffView />;
      case 'notices':
        return <NoticesView />;
      case 'certificates':
        return <CertificatesView />;
      case 'id-cards':
        return <IdCardsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 no-print flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Smart School Management System • <strong>Ikhar, Gujarat</strong>
            </div>
            <div>
              Session 2026-2027 • Production Release
            </div>
          </footer>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
