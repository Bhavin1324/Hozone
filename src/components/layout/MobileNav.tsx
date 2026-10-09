import React, { useState } from 'react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Users,
  Settings,
  Menu,
  Brain,
  Stethoscope,
  PawPrint,
} from 'lucide-react';
import { Drawer } from 'antd';
import { NAVIGATION_ITEMS, APP_CONFIG } from '@/core/config/constants';

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

export const MobileNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Main 4 quick items for bottom bar
  const bottomBarItems = NAVIGATION_ITEMS.slice(0, 4);

  return (
    <>
      {/* Fixed Touch-Friendly Bottom Bar for Small Screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-card border-t border-border-subtle z-40 flex items-center justify-around px-2 shadow-lg backdrop-blur-md">
        {bottomBarItems.map((item) => {
          const IconComponent =
            ICON_MAP[item.icon as keyof typeof ICON_MAP] || LayoutDashboard;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-primary-500 font-semibold' : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-text-muted hover:text-text-secondary"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-out Drawer for Extended Mobile Navigation */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
              H
            </div>
            <span className="font-bold text-sm text-text-primary">{APP_CONFIG.name}</span>
          </div>
        }
        placement="bottom"
        height="auto"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="[&_.ant-drawer-content]:rounded-t-2xl [&_.ant-drawer-body]:p-4"
      >
        <div className="space-y-1.5 pb-6">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent =
              ICON_MAP[item.icon as keyof typeof ICON_MAP] || LayoutDashboard;

            return (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-500 font-semibold border border-primary-500/20'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`
                }
              >
                <IconComponent className="w-5 h-5 text-primary-500" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};
