'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Flame, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { leaderboardAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

type Period = 'all' | 'monthly' | 'weekly';

// Normalized shape used by the UI
interface NormalizedEntry {
  rank: number;
  userId: string;
  name: string;
  skillLevel: string;
  coins: number;
  streak: number;
  totalSolved: number;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'monthly', label: 'This Month' },
  { value: 'weekly', label: 'This Week' },
];

const podiumColors = ['#fbbf24', '#94a3b8', '#f97316'];
const podiumLabels = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

// Backend returns flat { rank, userId, name, coins, ... }
// Mock fallback uses nested { user: { _id, name } }
// This normalizer handles both
function normalizeEntry(raw: Record<string, unknown>, index: number): NormalizedEntry {
  const nested = raw.user as Record<string, unknown> | undefined;
  return {
    rank: (raw.rank as number) || index + 1,
    userId: (raw.userId as string) || (nested?._id as string) || (nested?.id as string) || String(index),
    name: (raw.name as string) || (nested?.name as string) || 'Unknown',
    skillLevel: (raw.skillLevel as string) || (nested?.skillLevel as string) || 'unassessed',
    coins: (raw.coins as number) || 0,
    streak: (raw.streak as number) || 0,
    totalSolved: (raw.totalSolved as number) || 0,
  };
}

function SkillBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    beginner: '#34d399', intermediate: '#fbbf24',
    advanced: '#f87171', unassessed: '#64748b',
  };
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '999px', background: (colors[level] || '#64748b') + '18', color: colors[level] || '#64748b', textTransform: 'capitalize' }}>
      {level}
    </span>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [entries, setEntries] = useState<NormalizedEntry[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get(period).then(res => {
      const data = res.data;
      const raw = data?.leaderboard || data?.data || data || [];
      setEntries(raw.map((r: Record<string, unknown>, i: number) => normalizeEntry(r, i)));
    }).catch(() => {
      setEntries([
        { rank: 1, userId: '1', name: 'Arjun Sharma', skillLevel: 'advanced', coins: 2840, streak: 45, totalSolved: 312 },
        { rank: 2, userId: '2', name: 'Priya Patel', skillLevel: 'advanced', coins: 2620, streak: 38, totalSolved: 287 },
        { rank: 3, userId: '3', name: 'Rahul Kumar', skillLevel: 'advanced', coins: 2450, streak: 30, totalSolved: 265 },
        { rank: 4, userId: '4', name: 'Sneha Gupta', skillLevel: 'intermediate', coins: 2100, streak: 22, totalSolved: 198 },
        { rank: 5, userId: '5', name: 'Vikram Singh', skillLevel: 'intermediate', coins: 1980, streak: 18, totalSolved: 175 },
      ]);
    }).finally(() => setLoading(false));
  }, [period]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const getAvatar = (name: string, idx: number) => {
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#34d399', '#f97316', '#fbbf24'];
    return { letter: name?.charAt(0).toUpperCase() || '?', color: colors[idx % colors.length] };
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={26} color="#fbbf24" /> Leaderboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Compete with developers worldwide. Earn coins and climb the ranks.</p>
          </div>
          {/* Period selector */}
          <div style={{ display: 'flex', gap: '0.375rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.25rem' }}>
            {PERIOD_OPTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => setPeriod(value)} style={{
                padding: '0.4rem 0.875rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: period === value ? 'rgba(139,92,246,0.2)' : 'transparent',
                color: period === value ? '#a78bfa' : '#64748b',
                fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div>{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', marginBottom: '0.5rem', borderRadius: '12px' }} />)}</div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 3 && (
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                  const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                  const heights = [160, 200, 140];
                  const av = getAvatar(entry.name, actualRank - 1);
                  const color = podiumColors[actualRank - 1];
                  return (
                    <div key={entry.userId} style={{ textAlign: 'center', flex: 1, maxWidth: '200px' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{podiumLabels[actualRank - 1].split(' ')[0]}</div>
                        <div style={{
                          width: '52px', height: '52px', margin: '0 auto 0.5rem',
                          background: `linear-gradient(135deg, ${av.color}, ${av.color}aa)`,
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.25rem', fontWeight: 700, color: 'white',
                          border: `3px solid ${color}`,
                          boxShadow: `0 0 20px ${color}40`,
                        }}>{av.letter}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>{entry.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{entry.totalSolved} solved</div>
                      </div>
                      <div style={{
                        height: `${heights[podiumIdx]}px`,
                        background: `linear-gradient(180deg, ${color}25 0%, ${color}08 100%)`,
                        border: `1px solid ${color}35`,
                        borderRadius: '12px 12px 0 0',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 700 }}>
                          <Star size={14} fill="#fbbf24" /> {entry.coins}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f97316', fontSize: '0.8rem' }}>
                          <Flame size={13} fill="#f97316" /> {entry.streak}d
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th>Developer</th>
                    <th>Level</th>
                    <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={12} fill="#fbbf24" color="#fbbf24" /> Coins</div></th>
                    <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Flame size={12} fill="#f97316" color="#f97316" /> Streak</div></th>
                    <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={12} color="#a78bfa" /> Solved</div></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => {
                    const isCurrentUser = user && entry.userId === user._id;
                    const av = getAvatar(entry.name, i);
                    const rankColors = ['#fbbf24', '#94a3b8', '#f97316'];

                    return (
                      <tr key={entry.userId} style={{ background: isCurrentUser ? 'rgba(139,92,246,0.06)' : 'transparent' }}>
                        <td>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: i < 3 ? rankColors[i] + '18' : 'rgba(255,255,255,0.03)',
                            color: i < 3 ? rankColors[i] : '#64748b',
                            fontWeight: 700, fontSize: '0.8rem',
                          }}>
                            {i < 3 ? ['🥇', '🥈', '🥉'][i] : entry.rank}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{
                              width: '32px', height: '32px',
                              background: `linear-gradient(135deg, ${av.color}, ${av.color}aa)`,
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
                            }}>{av.letter}</div>
                            <span style={{ fontWeight: isCurrentUser ? 700 : 500, color: isCurrentUser ? '#a78bfa' : '#f1f5f9', fontSize: '0.9rem' }}>
                              {entry.name}
                              {isCurrentUser && <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', color: '#8b5cf6' }}>(You)</span>}
                            </span>
                          </div>
                        </td>
                        <td><SkillBadge level={entry.skillLevel} /></td>
                        <td style={{ color: '#fbbf24', fontWeight: 600 }}>{entry.coins?.toLocaleString()}</td>
                        <td style={{ color: '#f97316' }}>{entry.streak}d</td>
                        <td style={{ color: '#a78bfa', fontWeight: 600 }}>{entry.totalSolved}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
