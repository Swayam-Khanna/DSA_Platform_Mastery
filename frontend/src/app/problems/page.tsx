'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Filter, ChevronLeft, ChevronRight, X, Building2, ExternalLink, 
  Layers, Hash, GitBranch, TreePine, Network, Brain, Database, Target,
  Zap, Clock, BarChart3, Star, CheckCircle2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { problemsAPI } from '@/lib/api';
import { Problem } from '@/types';
import { useAuthStore } from '@/lib/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import DataNodeNetwork from '@/components/ui/DataNodeNetwork';

const TOPIC_ICONS: Record<string, any> = {
  'arrays': Layers,
  'strings': Hash,
  'linked-lists': GitBranch,
  'stacks': Layers,
  'queues': Layers,
  'trees': TreePine,
  'graphs': Network,
  'dynamic-programming': Brain,
  'greedy': Zap,
  'backtracking': GitBranch,
  'hashing': Database,
  'sliding-window': Clock,
  'recursion': GitBranch,
  'binary-search': Target,
  'sorting': BarChart3,
};

const TOPICS = ['arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'hashing', 'sliding-window', 'recursion', 'binary-search', 'sorting'];
const COMPANIES = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Uber', 'LinkedIn', 'Adobe'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

function ProblemsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (search) params.search = search;
      if (selectedTopic) params.topic = selectedTopic;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedCompany) params.company = selectedCompany;

      const res = await problemsAPI.getAll(params);
      // Handle various response formats from backend
      const problemsData = res.data?.problems || res.data?.data?.problems || res.data?.data || [];
      const totalCount = res.data?.pagination?.total || res.data?.total || res.data?.data?.total || 0;

      setProblems(problemsData);
      setTotal(totalCount);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setProblems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedTopic, selectedDifficulty, selectedCompany]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const clearFilter = (type: string) => {
    if (type === 'topic') setSelectedTopic('');
    if (type === 'difficulty') setSelectedDifficulty('');
    if (type === 'company') setSelectedCompany('');
    if (type === 'search') setSearch('');
    setPage(1);
  };

  const activeFilters = [
    selectedTopic && { type: 'topic', label: selectedTopic.replace(/-/g, ' ') },
    selectedDifficulty && { type: 'difficulty', label: selectedDifficulty },
    selectedCompany && { type: 'company', label: selectedCompany },
    search && { type: 'search', label: `"${search}"` },
  ].filter(Boolean) as { type: string; label: string }[];

  const totalPages = Math.ceil(total / 20);

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        {/* Header with 3D Background */}
        <div style={{ position: 'relative', marginBottom: '1.75rem', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.15)', background: 'linear-gradient(135deg, rgba(10,10,31,0.6) 0%, rgba(6,182,212,0.05) 100%)', overflow: 'hidden' }}>
          <DataNodeNetwork />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Problems Directory</h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Master <span style={{ color: '#a78bfa', fontWeight: 600 }}>{total}</span> curated data structure and algorithm challenges.
            </p>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
            <Search size={16} color="#475569" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search problems..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field" style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Topic */}
          <select value={selectedTopic} onChange={e => { setSelectedTopic(e.target.value); setPage(1); }}
            className="input-field" style={{ flex: '0 0 auto', width: 'auto', minWidth: '140px', cursor: 'pointer' }}>
            <option value="">All Topics</option>
            {TOPICS.map(t => <option key={t} value={t} style={{ background: '#0a0a1f' }}>{t.replace(/-/g, ' ')}</option>)}
          </select>

          {/* Difficulty */}
          <select value={selectedDifficulty} onChange={e => { setSelectedDifficulty(e.target.value); setPage(1); }}
            className="input-field" style={{ flex: '0 0 auto', width: 'auto', minWidth: '130px', cursor: 'pointer' }}>
            <option value="">All Levels</option>
            {DIFFICULTIES.map(d => <option key={d} value={d} style={{ background: '#0a0a1f', textTransform: 'capitalize' }}>{d}</option>)}
          </select>

          {/* Company */}
          <select value={selectedCompany} onChange={e => { setSelectedCompany(e.target.value); setPage(1); }}
            className="input-field" style={{ flex: '0 0 auto', width: 'auto', minWidth: '130px', cursor: 'pointer' }}>
            <option value="">All Companies</option>
            {COMPANIES.map(c => <option key={c} value={c} style={{ background: '#0a0a1f' }}>{c}</option>)}
          </select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {activeFilters.map(({ type, label }) => (
              <span key={type} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.25rem 0.625rem',
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '999px',
                fontSize: '0.75rem', color: '#a78bfa',
                textTransform: 'capitalize',
              }}>
                <Filter size={11} />
                {label}
                <button onClick={() => clearFilter(type)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#8b5cf6' }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Problems Grid */}
        <div style={{ position: 'relative' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '1rem 0' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '200px', padding: '1.5rem' }}>
                  <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '2rem' }} />
                  <div className="skeleton" style={{ height: '32px', width: '100%' }} />
                </div>
              ))}
            </div>
          ) : problems.length === 0 ? (
            <div style={{ padding: '5rem 3rem', textAlign: 'center', color: '#475569', background: 'rgba(15,15,40,0.3)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.05)' }}>
              <Filter size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
              <h3 style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No problems found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSelectedTopic(''); setSelectedDifficulty(''); setSelectedCompany(''); setSearch(''); }}
                style={{ marginTop: '1.5rem', color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem',
              perspective: '1000px'
            }}>
              <AnimatePresence mode="popLayout">
                {problems.map((p, idx) => {
                  const TopicIcon = TOPIC_ICONS[p.topic] || Layers;
                  return (
                    <motion.div
                      key={p._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ 
                        y: -8, 
                        rotateX: 2,
                        rotateY: 2,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(139,92,246,0.1)'
                      }}
                      className="glass-card"
                      style={{ 
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      onClick={() => router.push(`/problems/${p._id}`)}
                    >
                      {/* Solved Overlay */}
                      {(p as any).userStatus === 'solved' && (
                        <div style={{ 
                          position: 'absolute', top: '1rem', right: '1rem', 
                          color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem',
                          background: 'rgba(16,185,129,0.1)', padding: '0.25rem 0.5rem', borderRadius: '999px',
                          fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)'
                        }}>
                          <CheckCircle2 size={12} /> Solved
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', height: '36px', 
                            background: 'rgba(139,92,246,0.1)', 
                            borderRadius: '10px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(139,92,246,0.2)'
                          }}>
                            <TopicIcon size={18} color="#a78bfa" />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {p.topic?.replace(/-/g, ' ')}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                          {p.title}
                          {p.isPremium && <span className="badge badge-purple" style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}>PRO</span>}
                        </h3>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                          <span className={`badge badge-${p.difficulty}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            {p.difficulty}
                          </span>
                          {p.companyTags?.slice(0, 2).map(c => (
                            <span key={c} style={{ 
                              fontSize: '0.65rem', padding: '0.15rem 0.5rem', 
                              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', 
                              borderRadius: '4px', color: '#94a3b8' 
                            }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ 
                        marginTop: 'auto', paddingTop: '1rem', 
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.75rem' }}>
                            <CheckCircle2 size={14} />
                            <span>{p.solveCount?.toLocaleString() || 0}</span>
                          </div>
                          {p.acceptanceRate > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.75rem' }}>
                              <Star size={14} />
                              <span>{p.acceptanceRate}%</span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {p.leetcodeLink && (
                            <a href={p.leetcodeLink} target="_blank" rel="noopener noreferrer" 
                              onClick={e => e.stopPropagation()}
                              style={{ color: '#f59e0b', opacity: 0.6 }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {p.gfgLink && (
                            <a href={p.gfgLink} target="_blank" rel="noopener noreferrer" 
                              onClick={e => e.stopPropagation()}
                              style={{ color: '#10b981', opacity: 0.6 }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Hover Gradient Effect */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(139,92,246,0.06), transparent 40%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        pointerEvents: 'none'
                      }} className="card-hover-bg" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: page === 1 ? '#475569' : '#94a3b8', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: page === totalPages ? '#475569' : '#94a3b8', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<div>Loading problems...</div>}>
      <ProblemsContent />
    </Suspense>
  );
}
