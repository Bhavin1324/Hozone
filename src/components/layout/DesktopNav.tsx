import React from 'react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Brain,
  Stethoscope,
  PawPrint,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleSidebar } from '@/app/store/slices/preferencesSlice';
import { NAVIGATION_ITEMS, APP_CONFIG } from '@/core/config/constants';
import { Tooltip } from 'antd';

const ICON_MAP = {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Brain,
  Stethoscope,
  Users,
  PawPrint,
  Settings,
};

export const DesktopNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.preferences.sidebarCollapsed);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border-subtle bg-surface-card transition-all duration-300 select-none z-30 sticky top-0 h-screen ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-border-subtle">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="font-bold text-base tracking-wider">H</span>
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-tight text-text-primary block">
                {APP_CONFIG.shortName}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
                Clinical Core
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          const IconComponent =
            ICON_MAP[item.icon as keyof typeof ICON_MAP] || LayoutDashboard;

          const content = (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-primary-500' : 'text-text-muted group-hover:text-text-primary'
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-500">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );

          return collapsed ? (
            <Tooltip key={item.key} title={item.label} placement="right">
              <div>{content}</div>
            </Tooltip>
          ) : (
            <div key={item.key}>{content}</div>
          );
        })}
      </nav>

      {/* Security & Audit Stamp */}
      {!collapsed && (
        <div className="mx-3 my-2 p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-muted flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold text-text-primary block">HIPAA / Clinical Mode</span>
            Local session encrypted with audit log trail active.
          </div>
        </div>
      )}

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-border-subtle flex items-center justify-end">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-xs font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
