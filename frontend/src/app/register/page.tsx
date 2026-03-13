'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Code2, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const languages = [
  { value: 'python', label: '🐍 Python' },
  { value: 'javascript', label: '⚡ JavaScript' },
  { value: 'cpp', label: '⚙️ C++' },
  { value: 'java', label: '☕ Java' },
];

const perks = [
  'Access to 500+ curated problems',
  'AI-powered hints & explanations',
  'Structured learning roadmaps',
  'Leaderboard & gamification',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('python');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await register(name, email, password, language);
      toast.success('Welcome to DSA Mastery! 🚀');
      router.push('/assessment');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
      <div style={{
        position: 'absolute', top: '10%', right: '15%',
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        style={{
          display: 'flex', gap: '3rem', alignItems: 'center',
          maxWidth: '900px', width: '100%',
          position: 'relative', zIndex: 1,
      }}>
        {/* Left Side Perks */}
        <div style={{ flex: 1, display: 'none' }} className="show-lg">
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={22} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DSA Mastery</span>
          </Link>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            Start your <span className="gradient-text">DSA journey</span> today
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of developers who mastered DSA and landed their dream jobs.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {perks.map(perk => (
              <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={18} color="#34d399" fill="rgba(52,211,153,0.1)" />
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, maxWidth: '440px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DSA Mastery</span>
            </Link>
          </div>

          <div style={{
            background: 'rgba(10,10,31,0.85)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '20px', padding: '2.25rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.375rem' }}>
              Create your account
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Free forever. No credit card needed.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Full name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#475569" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe" className="input-field" style={{ paddingLeft: '2.5rem' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#475569" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-field" style={{ paddingLeft: '2.5rem' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#475569" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                    className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569',
                  }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Preferred language
                </label>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="input-field" id="language" style={{ cursor: 'pointer' }}>
                  {languages.map(l => (
                    <option key={l.value} value={l.value} style={{ background: '#0a0a1f' }}>{l.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{
                width: '100%', padding: '0.875rem',
                fontSize: '0.9rem', marginTop: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}>
                {isLoading ? (
                  <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Creating account...</>
                ) : (
                  <>Create Free Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
