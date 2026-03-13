'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Code2, LayoutDashboard, BookOpen, Map, Trophy,
  Brain, User, LogOut, ChevronLeft, ChevronRight,
  Flame, Star, Zap, ClipboardCheck
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/ai', label: 'AI Tutor', icon: Brain },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    router.push('/');
  };

  return (
    <aside style={{
      width: collapsed ? '68px' : '220px',
      minHeight: '100vh',
      background: 'rgba(8, 8, 22, 0.65)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '1rem 0' : '1rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '64px',
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px', flexShrink: 0,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={18} color="white" />
          </div>
          {!collapsed && (
            <span style={{
              fontSize: '1rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
            }}>DSA Mastery</span>
          )}
        </Link>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#475569', padding: '4px', borderRadius: '6px',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#475569', padding: '8px', margin: '8px auto',
          borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* User badge */}
      {!collapsed && user && (
        <div style={{
          margin: '0.75rem 0.75rem 0',
          padding: '0.75rem',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user.skillLevel}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#fbbf24' }}>
              <Star size={11} fill="#fbbf24" /> {user.coins}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#f97316' }}>
              <Flame size={11} fill="#f97316" /> {user.streak}d
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#a78bfa' }}>
              <Zap size={11} fill="#a78bfa" /> {user.totalSolved}
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : '0.625rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
              borderRadius: '10px',
              textDecoration: 'none',
              background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: active ? '#a78bfa' : '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 400,
              transition: 'all 0.2s',
              position: 'relative',
            }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }
              }}
            >
              {active && (
                <span style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: '3px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  borderRadius: '0 3px 3px 0',
                }} />
              )}
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : '0.625rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
          width: '100%', borderRadius: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: '0.875rem', fontWeight: 500,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#f87171';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#64748b';
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
