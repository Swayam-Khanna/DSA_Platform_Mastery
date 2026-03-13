'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Code2, Menu, X, LayoutDashboard, BookOpen, Map,
  Trophy, Brain, User, LogOut, ChevronDown, Zap, Star
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/ai', label: 'AI Tutor', icon: Brain },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setUserMenuOpen(false);
  };

  const isDashboard = pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/problems') ||
    pathname?.startsWith('/roadmap') ||
    pathname?.startsWith('/leaderboard') ||
    pathname?.startsWith('/profile') ||
    pathname?.startsWith('/ai') ||
    pathname?.startsWith('/assessment');

  if (isDashboard) return null; // Dashboard pages have their own sidebar nav

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(5, 5, 16, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Code2 size={20} color="white" />
          </div>
          <span style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>DSA Mastery</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hide-mobile">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: pathname === href ? '#a78bfa' : '#94a3b8',
              background: pathname === href ? 'rgba(139,92,246,0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (pathname !== href) {
                (e.target as HTMLElement).style.color = '#f1f5f9';
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={e => {
              if (pathname !== href) {
                (e.target as HTMLElement).style.color = '#94a3b8';
                (e.target as HTMLElement).style.background = 'transparent';
              }
            }}
            >{label}</Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '28px', height: '28px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24', fontSize: '0.75rem' }}>
                  <Star size={12} fill="#fbbf24" /> {user.coins}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'rgba(10, 10, 31, 0.98)', border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: '12px', minWidth: '180px', overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 1rem', textDecoration: 'none',
                    color: '#94a3b8', fontSize: '0.875rem', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 1rem', textDecoration: 'none',
                    color: '#94a3b8', fontSize: '0.875rem', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                  >
                    <User size={15} /> Profile
                  </Link>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.625rem 1rem', width: '100%', textAlign: 'left',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: '#f87171', fontSize: '0.875rem', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" style={{
                padding: '0.5rem 1rem', borderRadius: '8px',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                color: '#94a3b8', transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#f1f5f9'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#94a3b8'}
              >Login</Link>
              <Link href="/register" className="btn-primary" style={{
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <Zap size={14} /> Get Started
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'transparent', border: 'none',
              cursor: 'pointer', color: '#94a3b8', padding: '0.25rem',
            }}
            className="show-mobile"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 0.75rem', borderRadius: '8px',
              textDecoration: 'none', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500,
            }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
