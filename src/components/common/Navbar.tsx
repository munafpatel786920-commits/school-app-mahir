import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { translations } from '../../utils/translations';
import { Role } from '../../types';
import {
  Menu,
  Search,
  Languages,
  Printer,
  Bell,
  Shield,
  ChevronDown,
  Calendar,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    settings,
    notices,
    setActiveView
  } = useSchool();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNoticeDropdown, setShowNoticeDropdown] = useState(false);

  // Global keydown for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const roles: Role[] = ['Admin', 'Principal', 'Teacher', 'Accountant', 'Staff'];

  const t = translations[language];

  const currentDateFormatted = new Date().toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between no-print transition-all">
      {/* Left: Mobile Toggle & School Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs font-bold text-lg overflow-hidden border border-emerald-500/20 shrink-0">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.schoolName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>SP</span>
            )}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
              {language === 'gu' && settings.schoolNameGu ? settings.schoolNameGu : settings.schoolName}
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-200">
                {settings.academicYear}
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {settings.city}, {settings.state} • {settings.schoolTagline}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Quick Search Trigger Button */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-xs group"
        >
          <span className="flex items-center gap-2 text-slate-500">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>{t.searchPlaceholder}</span>
          </span>
          <kbd className="text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Date Stamp */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDateFormatted}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          title="Toggle Language: English / ગુજરાતી"
        >
          <Languages className="w-4 h-4 text-emerald-600" />
          <span>{language === 'en' ? 'ગુજરાતી' : 'English'}</span>
        </button>

        {/* Quick Print Page */}
        <button
          onClick={() => window.print()}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          title="Print Current View"
        >
          <Printer className="w-4.5 h-4.5" />
        </button>

        {/* Notice Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNoticeDropdown(!showNoticeDropdown)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="School Notices"
          >
            <Bell className="w-4.5 h-4.5" />
            {notices.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {notices.length}
              </span>
            )}
          </button>

          {showNoticeDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Notices ({notices.length})
                </span>
                <button
                  onClick={() => {
                    setActiveView('notices');
                    setShowNoticeDropdown(false);
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                {notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => {
                      setActiveView('notices');
                      setShowNoticeDropdown(false);
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {notice.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {notice.description}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      {notice.date} • {notice.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-xs text-xs font-bold"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Role Mode
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    role === r ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
