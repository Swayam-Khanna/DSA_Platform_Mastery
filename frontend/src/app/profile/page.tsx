'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Flame, Star, Zap, Github, Linkedin,
  Edit3, Save, X, BookOpen, CheckCircle, Award,
  TrendingUp, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usersAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';

const BADGES = [
  { emoji: '🔥', name: 'First Solve', desc: 'Solved your first problem', unlocked: true },
  { emoji: '⚡', name: 'Speed Demon', desc: 'Solve in under 10 minutes', unlocked: true },
  { emoji: '🎯', name: 'Sharpshooter', desc: '10 problems solved', unlocked: true },
  { emoji: '🌟', name: '7-Day Streak', desc: 'Maintain 7-day streak', unlocked: true },
  { emoji: '💎', name: 'Diamond Coder', desc: '100 problems solved', unlocked: false },
  { emoji: '🏆', name: 'Top 10', desc: 'Reach top 10 leaderboard', unlocked: false },
];

const SKILL_COLORS: Record<string, string> = {
  beginner: '#34d399', intermediate: '#fbbf24',
  advanced: '#f87171', unassessed: '#64748b',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', github: '', linkedin: '' });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) {
      setForm({ name: user.name, bio: user.bio, github: user.github, linkedin: user.linkedin });
    }
  }, [isAuthenticated, user, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile(form);
      const updated = res.data?.user || res.data?.data || user;
      setUser({ ...user!, ...form });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile. Try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const levelColor = SKILL_COLORS[user.skillLevel] || '#64748b';

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}
      >
        {/* Header Card */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px', flexShrink: 0,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: 'white',
              boxShadow: '0 0 30px rgba(139,92,246,0.3)',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              {editing ? (
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field" style={{ maxWidth: '280px', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}
                  placeholder="Your name" />
              ) : (
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }}>{user.name}</h1>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={{ padding: '0.2rem 0.625rem', background: levelColor + '18', border: `1px solid ${levelColor}30`, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: levelColor, textTransform: 'capitalize' }}>
                  {user.skillLevel}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.email}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              {editing ? (
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  className="input-field" rows={2} style={{ resize: 'none', fontSize: '0.875rem' }}
                  placeholder="Write a short bio..." />
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {user.bio || 'No bio yet. Click edit to add one.'}
                </p>
              )}
            </div>

            {/* Edit Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.85rem' }}>
                    <X size={15} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.85rem' }}>
                    {saving ? <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> : <Save size={15} />}
                    Save
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.85rem' }}>
                  <Edit3 size={15} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Social links */}
          {editing ? (
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Github size={15} color="#475569" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                  className="input-field" placeholder="GitHub username" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
              </div>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Linkedin size={15} color="#475569" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                  className="input-field" placeholder="LinkedIn username" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              {user.github && (
                <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f1f5f9'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                >
                  <Github size={15} /> {user.github}
                </a>
              )}
              {user.linkedin && (
                <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0ea5e9'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                >
                  <Linkedin size={15} /> {user.linkedin}
                </a>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Stats */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <TrendingUp size={17} color="#a78bfa" /> Statistics
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Problems Solved', value: user.totalSolved, icon: Zap, color: '#8b5cf6' },
                { label: 'Current Streak', value: `${user.streak} days`, icon: Flame, color: '#f97316' },
                { label: 'Longest Streak', value: `${user.longestStreak} days`, icon: Calendar, color: '#34d399' },
                { label: 'Coins Earned', value: user.coins, icon: Star, color: '#fbbf24' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={15} color={color} />
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Score */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <BookOpen size={17} color="#a78bfa" /> Assessment
            </h2>
            {user.assessmentCompleted ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '80px', height: '80px', margin: '0 auto 1rem',
                  background: `${levelColor}12`,
                  border: `3px solid ${levelColor}30`,
                  borderRadius: '50%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: levelColor }}>{user.assessmentScore}</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>/ 10</div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: levelColor, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                  {user.skillLevel}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {Math.round((user.assessmentScore / 10) * 100)}% accuracy
                </div>
                <CheckCircle size={16} color="#34d399" style={{ marginTop: '0.75rem' }} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Take the assessment to unlock your personalized roadmap.
                </p>
                <a href="/assessment" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                  Take Now
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Award size={17} color="#a78bfa" /> Achievements
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {BADGES.map(badge => (
              <div key={badge.name} style={{
                padding: '1rem',
                background: badge.unlocked ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${badge.unlocked ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: '12px', textAlign: 'center',
                opacity: badge.unlocked ? 1 : 0.4,
                filter: badge.unlocked ? 'none' : 'grayscale(1)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (badge.unlocked) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = badge.unlocked ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.375rem' }}>{badge.emoji}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: badge.unlocked ? '#f1f5f9' : '#475569', marginBottom: '0.2rem' }}>{badge.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.3 }}>{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
