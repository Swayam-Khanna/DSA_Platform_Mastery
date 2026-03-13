'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';
import { FloatingCubes } from '@/components/ui/FloatingCubes';
import { GlowingCTA } from '@/components/ui/GlowingCTA';
import { AlgorithmFlowLines } from '@/components/ui/AlgorithmFlowLines';
import { platformAPI } from '@/lib/api';
import { useSocket } from '@/components/providers/SocketProvider';
import { motion } from 'framer-motion';
import {
  Code2, BookOpen, Map, Trophy, Brain, Zap, ArrowRight,
  CheckCircle, Star, Flame, Users, Target, TrendingUp,
  GitBranch, Database, Layers, Hash, Network, TreePine,
  ChevronRight, Play
} from 'lucide-react';

const topics = [
  { name: 'Arrays', icon: Layers, color: '#8b5cf6', problems: 45 },
  { name: 'Strings', icon: Hash, color: '#06b6d4', problems: 38 },
  { name: 'Linked Lists', icon: GitBranch, color: '#ec4899', problems: 32 },
  { name: 'Trees', icon: TreePine, color: '#34d399', problems: 40 },
  { name: 'Graphs', icon: Network, color: '#f97316', problems: 35 },
  { name: 'Dynamic Programming', icon: Brain, color: '#fbbf24', problems: 50 },
  { name: 'Hashing', icon: Database, color: '#a78bfa', problems: 28 },
  { name: 'Binary Search', icon: Target, color: '#22d3ee', problems: 25 },
];

const features = [
  {
    icon: BookOpen, color: '#8b5cf6',
    title: 'Curated Problem Sets',
    desc: '500+ handpicked problems organized by topic and difficulty, with company-wise tags for targeted interview prep.'
  },
  {
    icon: Brain, color: '#06b6d4',
    title: 'AI-Powered Tutor',
    desc: 'Get instant hints, explanations, and code reviews from our AI assistant trained on DSA concepts.'
  },
  {
    icon: Map, color: '#34d399',
    title: 'Structured Roadmaps',
    desc: 'Follow curated learning paths from beginner to advanced, with progress tracking at every step.'
  },
  {
    icon: Target, color: '#fbbf24',
    title: 'Skill Assessment',
    desc: 'Start with an MCQ assessment to identify your skill level and get a personalized learning plan.'
  },
  {
    icon: Trophy, color: '#ec4899',
    title: 'Gamified Learning',
    desc: 'Earn coins, maintain streaks, and climb the leaderboard. Make learning addictively fun.'
  },
  {
    icon: TrendingUp, color: '#f97316',
    title: 'Progress Analytics',
    desc: 'Detailed activity heatmaps, topic-wise progress, and streak tracking to keep you motivated.'
  },
];

const stats = [
  { value: '500+', label: 'Problems', icon: BookOpen },
  { value: '1', label: 'Active Learners', icon: Users },
  { value: '10+', label: 'Companies', icon: Target },
  { value: '100%', label: 'Commitment', icon: Star },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { activeUsers } = useSocket();
  const [dbStats, setDbStats] = useState({ users: 0, problems: 0, submissions: 0 });

  useEffect(() => {
    setMounted(true);
    platformAPI.getStats().then(res => {
      if (res.data?.success) setDbStats(res.data.stats);
    }).catch(console.error);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px',
      }}>
        {/* Background effects */}
        <ParticlesBackground />
        <FloatingCubes />
        {/* Matrix background is global, we just add overlays here */}
        
        {/* Glassmorphism gradient overlays */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0 }} />
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
        }} />

        {/* Algorithm connections */}
        <AlgorithmFlowLines />

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 1.5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 20, /* Above 3D canvas */
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 1rem',
            background: 'rgba(5,5,16,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#a78bfa',
            marginBottom: '2rem',
            animation: mounted ? 'fadeInUp 0.6s ease forwards' : 'none',
            boxShadow: '0 0 20px rgba(139,92,246,0.2)',
          }}>
            <Zap size={12} fill="#a78bfa" />
            AI-Powered DSA Learning Platform
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #db2777)',
              color: 'white', fontSize: '0.65rem',
              padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700,
              boxShadow: '0 0 10px rgba(219,39,119,0.5)',
            }}>V2.0</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            animation: mounted ? 'fadeInUp 0.7s ease 0.1s forwards' : 'none',
            opacity: mounted ? undefined : 0,
            textShadow: '0 0 40px rgba(255,255,255,0.1)'
          }}>
            Master{' '}
            <span className="gradient-text" style={{ background: 'var(--gradient-glow)', WebkitBackgroundClip: 'text' }}>Data Structures</span>
            <br />& <span className="gradient-text">Algorithms</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#cbd5e1',
            maxWidth: '650px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
            animation: mounted ? 'fadeInUp 0.7s ease 0.2s forwards' : 'none',
            opacity: mounted ? undefined : 0,
            background: 'rgba(5,5,16,0.4)',
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            The ultimate platform to crack FAANG interviews. Solve problems, get AI hints,
            track your progress, and compete with thousands of developers worldwide.
          </p>

          <div style={{
            display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap',
            animation: mounted ? 'fadeInUp 0.7s ease 0.3s forwards' : 'none',
            opacity: mounted ? undefined : 0,
          }}>
            <GlowingCTA href="/register" text="Start Learning Free" />
            <Link href="/problems" className="glass-card" style={{
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              gap: '0.5rem', padding: '0.9rem 2.5rem', fontSize: '1rem', color: '#f1f5f9', fontWeight: 600,
              background: 'rgba(255,255,255,0.03)',
            }}>
              <Play size={16} color="#22d3ee" /> Browse Problems
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            marginTop: '3.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#94a3b8',
            fontSize: '0.85rem',
            animation: mounted ? 'fadeInUp 0.7s ease 0.4s forwards' : 'none',
            opacity: mounted ? undefined : 0,
            background: 'rgba(5,5,16,0.4)',
            backdropFilter: 'blur(8px)',
            padding: '0.5rem 1.5rem',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'inline-flex'
          }}>
            <CheckCircle size={14} color="#34d399" />
            <span>Modern tech stack</span>
            <span style={{ color: '#334155' }}>|</span>
            <CheckCircle size={14} color="#34d399" />
            <span>Interactive Code Editor</span>
            <span style={{ color: '#334155' }}>|</span>
            <CheckCircle size={14} color="#34d399" />
            <span>Join our community</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,31,0.6)',
        backdropFilter: 'blur(10px)',
        padding: '2rem 0',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
        }}>
          {/* Dynamic Stats Output */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }} className="gradient-text">
              {mounted && dbStats.problems > 0 ? `${dbStats.problems}+` : '500+'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <BookOpen size={13} /> Problems
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }} className="gradient-text">
              {mounted ? (activeUsers > 0 ? activeUsers.toLocaleString() : '1') : '1'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Users size={13} /> Active Students
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }} className="gradient-text">
              {mounted && dbStats.users > 0 ? dbStats.users.toLocaleString() : '1'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Target size={13} /> Total Users
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }} className="gradient-text">
              {mounted && dbStats.submissions > 0 ? dbStats.submissions.toLocaleString() : '95%'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Star size={13} /> {mounted && dbStats.submissions > 0 ? 'Total Submissions' : 'Success Rate'}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Everything you need to{' '}
              <span className="gradient-text">get hired</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              A complete ecosystem designed to take you from zero to FAANG-ready.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {features.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: `${color}1a`,
                  border: `1px solid ${color}30`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section style={{ padding: '4rem 0 6rem', background: 'rgba(10,10,31,0.3)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Cover all{' '}
              <span className="gradient-text">DSA Topics</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              From basics to advanced — every topic you need for interviews.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {topics.map(({ name, icon: Icon, color, problems }) => (
              <motion.div
                key={name}
                whileHover={{ 
                  scale: 1.05, 
                  perspective: '1000px',
                  rotateX: 5,
                  rotateY: 5
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link href={`/problems?topic=${name.toLowerCase().replace(/ /g, '-')}`}
                  style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '1.75rem',
                    background: 'rgba(15,15,40,0.65)',
                    border: `1px solid ${color}25`,
                    borderRadius: '20px',
                    backdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    transition: 'all 0.4s var(--ease-premium)',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    boxShadow: `0 4px 20px -5px ${color}15`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}25`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}25`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px -5px ${color}15`;
                    }}
                  >
                    <div style={{
                      width: '48px', height: '48px',
                      background: `${color}15`,
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `inset 0 0 10px ${color}10`
                    }}>
                      <Icon size={24} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>{name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{problems} Curated Questions</div>
                    </div>
                    <div style={{ 
                      position: 'absolute', right: '1.25rem', bottom: '1.25rem',
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <ChevronRight size={16} color={color} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '300px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Flame size={28} color="#f97316" fill="#f97316" />
              <Star size={28} color="#fbbf24" fill="#fbbf24" />
              <Trophy size={28} color="#a78bfa" fill="#a78bfa" />
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">crack your interview?</span>
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.6 }}>
              Unlock your full potential with our structured approach,
              AI assistance, and gamified learning experience.
            </p>
            <Link href="/register" className="btn-primary" style={{
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
              gap: '0.5rem', padding: '1rem 2.5rem',
              fontSize: '1rem',
            }}>
              <Zap size={18} /> Start for Free Today
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 0',
        textAlign: 'center',
        color: '#475569',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Code2 size={16} color="#8b5cf6" />
          <span style={{ fontWeight: 700, color: '#8b5cf6' }}>DSA Mastery</span>
        </div>
        <p>© 2026 DSA Mastery Platform. Built to help you succeed.</p>
      </footer>
    </div>
  );
}
