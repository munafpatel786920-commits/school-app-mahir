import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { translations } from '../../utils/translations';
import { navigationItems, canRoleAccess } from '../../utils/permissions';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  UserCheck,
  Receipt,
  Award,
  FileSpreadsheet,
  BookOpen,
  Clock,
  Wallet,
  Bus,
  Briefcase,
  Bell,
  Scroll,
  CreditCard,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  UserCheck,
  Receipt,
  Award,
  FileSpreadsheet,
  BookOpen,
  Clock,
  Wallet,
  Bus,
  Briefcase,
  Bell,
  Scroll,
  CreditCard,
  BarChart3,
  Settings
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    role,
    language,
    activeView,
    setActiveView,
    students,
    teachers,
    fees,
    notices,
    homework
  } = useSchool();

  const t = translations[language];

  // Badges calculation
  const getBadgeCount = (badgeKey?: string) => {
    switch (badgeKey) {
      case 'students':
        return students.length;
      case 'teachers':
        return teachers.length;
      case 'fees':
        return fees.length;
      case 'notices':
        return notices.length;
      case 'homework':
        return homework.length;
      default:
        return null;
    }
  };

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs no-print transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">
                Smart School
              </div>
              <div className="text-[11px] font-medium text-emerald-400">
                Ikhar • Bharuch
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            v2.4
          </span>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Navigation
          </div>

          {navigationItems.map((item) => {
            const hasAccess = canRoleAccess(role, item.id);
            if (!hasAccess) return null;

            const IconComponent = iconMap[item.iconName] || LayoutDashboard;
            const isActive = activeView === item.id;
            const badgeCount = getBadgeCount(item.badgeKey);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{t[item.labelKey] || item.id}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {badgeCount !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info & Role Badge */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                {role.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{role} Portal</div>
                <div className="text-[10px] text-slate-400 truncate">
                  Role: {role}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveView('settings')}
              className="text-slate-400 hover:text-white p-1 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
