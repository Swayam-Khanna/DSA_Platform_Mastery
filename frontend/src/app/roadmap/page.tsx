'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Map, Lock, CheckCircle, ChevronRight, BookOpen,
  Star, Layers, Hash, GitBranch, TreePine, Network, Brain,
  Database, Target, Code, SortAsc, ArrowRight, Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

const topicIcons: Record<string, any> = {
  arrays: Layers, strings: Hash, 'linked-lists': GitBranch, trees: TreePine,
  graphs: Network, 'dynamic-programming': Brain, hashing: Database, 'binary-search': Target,
  recursion: Code, sorting: SortAsc, stacks: Layers, queues: Layers, greedy: Star,
  backtracking: GitBranch, 'sliding-window': ArrowRight,
};

const roadmapData = [
  { topic: 'arrays', title: 'Arrays & Matrices', desc: 'Foundation of DSA. Master traversal, subarrays, two pointers and more.', totalProblems: 45, difficulty: 'Beginner', color: '#8b5cf6', isLocked: false },
  { topic: 'strings', title: 'Strings', desc: 'Pattern matching, manipulation, and string algorithms.', totalProblems: 38, difficulty: 'Beginner', color: '#06b6d4', isLocked: false },
  { topic: 'hashing', title: 'Hashing & Maps', desc: 'HashMaps, HashSets — the key to O(1) lookups.', totalProblems: 28, difficulty: 'Beginner', color: '#34d399', isLocked: false },
  { topic: 'linked-lists', title: 'Linked Lists', desc: 'Singly, doubly linked lists, fast/slow pointers.', totalProblems: 32, difficulty: 'Intermediate', color: '#ec4899', isLocked: false },
  { topic: 'stacks', title: 'Stacks', desc: 'LIFO structures for expression parsing and monotonic problems.', totalProblems: 25, difficulty: 'Intermediate', color: '#f97316', isLocked: false },
  { topic: 'binary-search', title: 'Binary Search', desc: 'Efficiently search sorted arrays and answer problems.', totalProblems: 25, difficulty: 'Intermediate', color: '#fbbf24', isLocked: false },
  { topic: 'recursion', title: 'Recursion & Backtracking', desc: 'Divide and conquer, subsets, permutations.', totalProblems: 30, difficulty: 'Intermediate', color: '#a78bfa', isLocked: false },
  { topic: 'trees', title: 'Trees & BST', desc: 'Binary trees, BST operations, traversals, views.', totalProblems: 40, difficulty: 'Intermediate', color: '#22d3ee', isLocked: false },
  { topic: 'graphs', title: 'Graphs & BFS/DFS', desc: 'Graph representations, traversals, shortest paths.', totalProblems: 35, difficulty: 'Advanced', color: '#f87171', isLocked: false },
  { topic: 'sliding-window', title: 'Sliding Window', desc: 'Optimize brute-force to linear with window technique.', totalProblems: 22, difficulty: 'Intermediate', color: '#34d399', isLocked: false },
  { topic: 'dynamic-programming', title: 'Dynamic Programming', desc: 'Memoization, tabulation, classic DP patterns.', totalProblems: 50, difficulty: 'Advanced', color: '#fbbf24', isLocked: true },
  { topic: 'greedy', title: 'Greedy Algorithms', desc: 'Make locally optimal choices for global optimum.', totalProblems: 20, difficulty: 'Advanced', color: '#06b6d4', isLocked: true },
];

const difficultyBadge = (d: string) => {
  const colors: Record<string, string> = { Beginner: '#34d399', Intermediate: '#fbbf24', Advanced: '#f87171' };
  return colors[d] || '#94a3b8';
};

export default function RoadmapPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setMounted(true);
  }, [isAuthenticated, router]);

  // Fake progress
  const getProgress = (topic: string) => {
    if (!user) return 0;
    const seed = topic.charCodeAt(0) + (user.totalSolved || 0);
    return Math.min(100, Math.round((seed % 80)));
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={26} color="#8b5cf6" /> Learning Roadmap
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Follow this structured path from beginner to mastery. Complete topics in order for the best results.
          </p>
        </div>

        {/* Progress Summary */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.07) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '14px',
          marginBottom: '2rem',
          display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }} className="gradient-text">
              {roadmapData.filter(t => !t.isLocked).length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics Available</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>
              {roadmapData.reduce((a, t) => a + t.totalProblems, 0)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Problems</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{user?.totalSolved || 0}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Problems Solved</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Overall Progress</div>
            <div className="progress-bar" style={{ width: '200px', height: '8px' }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(((user?.totalSolved || 0) / roadmapData.reduce((a, t) => a + t.totalProblems, 0)) * 100))}%` }} />
            </div>
          </div>
        </div>

        {/* Roadmap Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {roadmapData.map((topic, index) => {
            const Icon = topicIcons[topic.topic] || BookOpen;
            const progress = getProgress(topic.topic);
            const solved = Math.round((progress / 100) * topic.totalProblems);

            return (
              <div key={topic.topic} style={{
                background: 'rgba(10,10,31,0.7)',
                border: `1px solid ${topic.isLocked ? 'rgba(255,255,255,0.04)' : topic.color + '25'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                opacity: topic.isLocked ? 0.55 : 1,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  if (!topic.isLocked) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = topic.color + '50';
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = `0 4px 20px ${topic.color}15`;
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = topic.isLocked ? 'rgba(255,255,255,0.04)' : topic.color + '25';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Step number */}
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  fontSize: '0.7rem', color: '#475569', fontWeight: 700,
                  background: 'rgba(255,255,255,0.03)', padding: '0.15rem 0.5rem', borderRadius: '999px',
                }}>#{index + 1}</div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: topic.isLocked ? 'rgba(255,255,255,0.04)' : `${topic.color}15`,
                    border: `1px solid ${topic.isLocked ? 'rgba(255,255,255,0.06)' : topic.color + '25'}`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {topic.isLocked ? (
                      <Lock size={18} color="#475569" />
                    ) : (
                      <Icon size={20} color={topic.color} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{topic.title}</div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, color: difficultyBadge(topic.difficulty),
                      background: difficultyBadge(topic.difficulty) + '15',
                      padding: '0.1rem 0.5rem', borderRadius: '999px',
                    }}>{topic.difficulty}</span>
                  </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {topic.desc}
                </p>

                {!topic.isLocked && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Progress</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{solved}/{topic.totalProblems}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${topic.color}, ${topic.color}aa)` }} />
                    </div>
                  </div>
                )}

                <Link href={`/problems?topic=${topic.topic}`} style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                  color: topic.isLocked ? '#475569' : topic.color,
                  cursor: topic.isLocked ? 'not-allowed' : 'pointer',
                  pointerEvents: topic.isLocked ? 'none' : 'auto',
                  transition: 'all 0.2s',
                }}>
                  {topic.isLocked
                    ? <><Lock size={13} /> Complete previous topics to unlock</>
                    : progress === 0
                      ? <><Play size={13} /> Start Learning <ChevronRight size={13} /></>
                      : progress === 100
                        ? <><CheckCircle size={13} /> Completed! Review →</>
                        : <><BookOpen size={13} /> Continue Learning <ChevronRight size={13} /></>}
                </Link>
              </div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
