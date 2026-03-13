'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Flame, Star, Zap, Trophy, TrendingUp,
  Target, ArrowRight, CheckCircle, Lock, Play,
  Brain, Map, ClipboardCheck, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { problemsAPI } from '@/lib/api';

const topicProgress = [
  { name: 'Arrays', color: '#8b5cf6', progress: 72, total: 45 },
  { name: 'Strings', color: '#06b6d4', progress: 55, total: 38 },
  { name: 'Trees', color: '#34d399', progress: 30, total: 40 },
  { name: 'Dynamic Programming', color: '#fbbf24', progress: 18, total: 50 },
  { name: 'Graphs', color: '#f97316', progress: 10, total: 35 },
];

const quickActions = [
  { label: 'Solve a Problem', href: '/problems', icon: BookOpen, color: '#8b5cf6' },
  { label: 'Continue Roadmap', href: '/roadmap', icon: Map, color: '#06b6d4' },
  { label: 'Take Assessment', href: '/assessment', icon: ClipboardCheck, color: '#34d399' },
  { label: 'Ask AI Tutor', href: '/ai', icon: Brain, color: '#fbbf24' },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: '#ec4899' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [recentProblems, setRecentProblems] = useState<{ _id: string; title: string; difficulty: string; topic: string }[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Fetch recent problems
    problemsAPI.getAll({ limit: 5 }).then(res => {
      setRecentProblems(res.data?.problems || res.data?.data || []);
    }).catch(() => {});
  }, [isAuthenticated, router]);

  if (!user) return null;

  const statCards = [
    { label: 'Problems Solved', value: user.totalSolved, icon: Zap, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Current Streak', value: `${user.streak} days`, icon: Flame, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Coins Earned', value: user.coins, icon: Star, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Longest Streak', value: `${user.longestStreak} days`, icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  ];

  const diffColor = (d: string) => d === 'easy' ? '#34d399' : d === 'medium' ? '#fbbf24' : '#f87171';

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }}>
            Welcome back, <span className="gradient-text">{user.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user.assessmentCompleted
              ? `Skill Level: ${user.skillLevel} • Keep the streak going!`
              : 'Take your skill assessment to get a personalized learning path.'}
          </p>
        </div>

        {/* Assessment Banner */}
        {!user.assessmentCompleted && (
          <div style={{
            marginBottom: '1.75rem',
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Target size={22} color="#a78bfa" />
              <div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>Complete your Skill Assessment</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Get a personalized learning path based on your current level</div>
              </div>
            </div>
            <Link href="/assessment" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Play size={14} /> Take Quiz
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Topic Progress */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Topic Progress</h2>
              <Link href="/problems" style={{ fontSize: '0.75rem', color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {topicProgress.map(({ name, color, progress, total }) => {
                const solved = Math.round((progress / 100) * total);
                return (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{solved}/{total}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickActions.map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: '10px',
                  textDecoration: 'none', transition: 'all 0.2s',
                  border: '1px solid transparent',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}25`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ width: '32px', height: '32px', background: `${color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                  <ArrowRight size={14} color="#475569" style={{ marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Problems */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Recent Problems</h2>
            <Link href="/problems" style={{ fontSize: '0.75rem', color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              All Problems <ChevronRight size={12} />
            </Link>
          </div>
          {recentProblems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
              <BookOpen size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>Start solving problems to see them here.</p>
              <Link href="/problems" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Browse Problems <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Topic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProblems.map(p => (
                  <tr key={p._id}>
                    <td>
                      <Link href={`/problems/${p._id}`} style={{ color: '#f1f5f9', textDecoration: 'none', fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#f1f5f9'}
                      >{p.title}</Link>
                    </td>
                    <td><span className={`badge badge-${p.difficulty}`}>{p.difficulty}</span></td>
                    <td><span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{p.topic?.replace(/-/g, ' ')}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {Math.random() > 0.5
                          ? <><CheckCircle size={14} color="#34d399" /> <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Solved</span></>
                          : <><Lock size={14} color="#475569" /> <span style={{ color: '#475569', fontSize: '0.8rem' }}>Unsolved</span></>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
