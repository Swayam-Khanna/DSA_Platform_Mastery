'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { problemsAPI, executeAPI } from '@/lib/api';
import { Problem } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
   ArrowLeft, ChevronRight, Play, Send, Clock, MemoryStick, 
   CheckCircle2, XCircle, Info, Lightbulb, Code2, Terminal,
   Maximize2, Minimize2, Settings, History, Trophy, Share2,
   Loader2, ExternalLink, Sparkles, Sun, Moon
 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
const Split = dynamic(() => import('react-split'), { ssr: false });

const getLanguageTemplate = (langId: string, title: string) => {
  const methodName = title.toLowerCase().replace(/[^a-z0-9]/g, '_').split('_').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  switch(langId) {
    case 'python':
      return `from typing import List, Optional\n\nclass Solution:\n    def ${methodName}(self, nums: List[int]) -> int:\n        # Implementation goes here\n        pass`;
    case 'cpp':
      return `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${methodName}(vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};`;
    case 'java':
      return `import java.util.*;\n\nclass Solution {\n    public int ${methodName}(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`;
    case 'javascript':
      return `/**\n * @param {number[]} nums\n * @return {number}\n */\nvar ${methodName} = function(nums) {\n    // Your code here\n    \n};`;
    default:
      return `// Default solution template\nvoid solve() {\n    \n}`;
  }
};

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' }
];

export default function ProblemSolvePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    problemsAPI.getOne(id).then(res => {
      const p = res.data?.problem || res.data?.data?.problem || res.data?.data || (res.data?.success ? res.data : null);
      if (p && (p.title || p.description)) {
        setProblem(p);
        // Set initial code with template
        setCode(getLanguageTemplate(language.id, p.title));
      } else {
        setProblem(null);
      }
      setLoading(false);
    }).catch((err) => {
      toast.error('Failed to load problem');
      setLoading(false);
    });
  }, [id, language.id]);

  const handleLanguageChange = (langId: string) => {
    const newLang = LANGUAGES.find(l => l.id === langId)!;
    setLanguage(newLang);
    if (problem) {
      setCode(getLanguageTemplate(langId, problem.title));
    }
  };

  const handleRunSubmit = async (isSubmit: boolean) => {
    if (!code.trim()) {
      toast.error('Code cannot be empty');
      return;
    }
    
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await executeAPI.submitCode({
        problemId: problem!._id,
        code,
        language: language.id
      });
      
      setExecutionResult(res.data);
      if (res.data.status === 'Accepted') {
        toast.success(isSubmit ? 'Problem Solved! Coins Added+' : 'All Local Cases Passed!');
      } else {
        toast.error('Tests Failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader2 className="animate-spin" size={32} color="#8b5cf6" />
        </div>
      </DashboardLayout>
    );
  }

  if (!problem) return <DashboardLayout><div style={{ padding: '2rem', color: '#fff' }}>Problem not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        margin: '-1.5rem', 
        background: '#080816', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Top Navbar: Premium Glassmorphism */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.75rem 1.5rem', 
          background: 'rgba(10,10,30,0.85)', 
          borderBottom: '1px solid rgba(139,92,246,0.2)', 
          backdropFilter: 'blur(20px)',
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <motion.button 
              whileHover={{ x: -3 }}
              onClick={() => router.back()} 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Back
            </motion.button>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{problem.title}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.1rem' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: problem.difficulty === 'Easy' ? '#10b981' : (problem.difficulty === 'Medium' ? '#fbbf24' : '#ef4444'), fontWeight: 800 }}>{problem.difficulty}</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{problem.topic?.replace(/-/g, ' ')}</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
                borderRadius: '8px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Switch to ${editorTheme === 'vs-dark' ? 'Light' : 'Dark'} Mode`}
            >
              {editorTheme === 'vs-dark' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => handleLanguageChange(l.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: language.id === l.id ? 'rgba(139,92,246,0.2)' : 'transparent',
                    color: language.id === l.id ? '#a78bfa' : '#64748b',
                    border: 'none'
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRunSubmit(false)} 
                disabled={isExecuting} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', 
                  border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.25rem', 
                  borderRadius: '10px', fontSize: '0.85rem', 
                  cursor: isExecuting ? 'not-allowed' : 'pointer', fontWeight: 600 
                }}
              >
                {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />} Run
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRunSubmit(true)} 
                disabled={isExecuting} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  color: '#fff', border: 'none', padding: '0.6rem 1.5rem', 
                  borderRadius: '10px', fontSize: '0.85rem', 
                  cursor: isExecuting ? 'not-allowed' : 'pointer', fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(16,185,129,0.2)'
                }}
              >
                {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Submit
              </motion.button>
            </div>
          </div>
        </div>

        {/* Split UI */}
        <Split 
          sizes={[45, 55]} 
          minSize={300} 
          expandToMin={false} 
          gutterSize={8} 
          gutterAlign="center" 
          direction="horizontal" 
          cursor="col-resize"
          style={{ display: 'flex', flex: 1, overflow: 'hidden' }}
          className="split-wrapper"
        >
          {/* Left Pane: Description */}
          <div style={{ padding: '2rem', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }} className="hide-scrollbar">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
               <span className={`badge badge-${problem.difficulty}`}>{problem.difficulty}</span>
               {problem.topic && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', borderRadius: '999px', border: '1px solid rgba(139,92,246,0.2)' }}>{problem.topic.replace(/-/g, ' ')}</span>}
            </div>
            
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>{problem.title}</h1>
            
            {/* Practice Links — prominent CTA */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Practice this problem
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {problem.leetcodeLink && (
                  <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                      borderRadius: '8px', textDecoration: 'none',
                      color: '#000', fontWeight: 700, fontSize: '0.8rem',
                      transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(251,191,36,0.25)',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>⚡</span> Solve on LeetCode <ExternalLink size={12} />
                  </a>
                )}
                {problem.gfgLink && (
                  <a href={problem.gfgLink} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #34d399, #06b6d4)',
                      borderRadius: '8px', textDecoration: 'none',
                      color: '#000', fontWeight: 700, fontSize: '0.8rem',
                      transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(52,211,153,0.25)',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>🟢</span> Solve on GFG <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
            
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
            
            {problem.examples && problem.examples.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '1rem', fontWeight: 600 }}>Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}><strong style={{ color: '#e2e8f0' }}>Input:</strong> <code style={{ color: '#a78bfa', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{ex.input}</code></p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}><strong style={{ color: '#e2e8f0' }}>Output:</strong> <code style={{ color: '#a78bfa', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{ex.output}</code></p>
                    {ex.explanation && <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}><strong style={{ color: '#94a3b8' }}>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {problem.constraints && problem.constraints.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.75rem', fontWeight: 600 }}>Constraints</h3>
                <ul style={{ color: '#cbd5e1', paddingLeft: '1.2rem', margin: 0 }}>
                  {problem.constraints.map((c, i) => (
                     <li key={i} style={{ marginBottom: '0.4rem' }}><code style={{ color: '#a78bfa', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.85rem' }}>{c}</code></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Pane: Code Editor & Console Split */}
          <Split
            direction="vertical"
            sizes={[70, 30]}
            minSize={[200, 100]}
            gutterSize={8}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Editor Container: Premium Neon Border */}
            <div style={{ 
              height: '100%', 
              overflow: 'hidden', 
              position: 'relative',
              background: '#1a1a2e',
              padding: '2px', // Space for neon border
              boxShadow: 'inset 0 0 30px rgba(139,92,246,0.05)'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                border: '1px solid rgba(139,92,246,0.1)',
                pointerEvents: 'none',
                zIndex: 10
              }} />
              
              <Editor
                height="100%"
                language={language.id === 'cpp' ? 'cpp' : (language.id === 'python' ? 'python' : (language.id === 'java' ? 'java' : 'javascript'))}
                theme={editorTheme}
                value={code}
                onChange={val => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  padding: { top: 24, bottom: 24 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'expand',
                  cursorSmoothCaretAnimation: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  }
                }}
              />
              
              {/* Floating Editor Actions */}
              <div style={{ 
                position: 'absolute', top: '1rem', right: '1.5rem', 
                zIndex: 20, display: 'flex', gap: '0.5rem'
              }}>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }} title="Reset Code">
                  <History size={16} />
                </button>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }} title="Settings">
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* Console Output Container */}
            <div style={{ background: '#0a0a1f', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <Terminal size={14} /> Console
                </div>
                {executionResult && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: executionResult.success ? '#10b981' : '#ef4444' }}>
                    {executionResult.success ? 'ACCEPTED' : 'WRONG ANSWER'}
                  </div>
                )}
              </div>

              {/* Terminal Logs */}
              <div style={{ 
                flex: 1, 
                overflow: 'auto', 
                padding: '1.25rem',
                background: 'rgba(5,5,15,0.7)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem'
              }} className="custom-scrollbar">
                {!executionResult && !isExecuting && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', gap: '0.75rem' }}>
                    <Terminal size={32} opacity={0.2} />
                    <p style={{ fontSize: '0.8rem' }}>Run your code to see results here</p>
                  </div>
                )}
                
                {isExecuting && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8b5cf6' }}>
                    <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '0.85rem' }}>Executing test cases on cluster...</span>
                  </div>
                )}

                <AnimatePresence>
                  {executionResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {executionResult.success ? (
                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Trophy size={18} /> ACCEPTED
                            </div>
                          ) : (
                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <XCircle size={18} /> WRONG ANSWER
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                            <Clock size={14} /> <span style={{ fontSize: '0.8rem' }}>{executionResult.time || '12'}ms</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                            <MemoryStick size={14} /> <span style={{ fontSize: '0.8rem' }}>{executionResult.memory || '4.2'}MB</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {executionResult.testResults?.map((test: any, i: number) => (
                          <div key={i} style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            border: `1px solid ${test.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`,
                            borderRadius: '12px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              padding: '0.75rem 1rem', 
                              background: 'rgba(255,255,255,0.02)',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8' }}>Test Case {i + 1}</span>
                              {test.passed ? 
                                <CheckCircle2 size={16} color="#10b981" /> : 
                                <XCircle size={16} color="#ef4444" />
                              }
                            </div>
                            <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <div style={{ color: '#475569', fontSize: '0.7rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Input</div>
                                <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>{test.input}</pre>
                              </div>
                              <div>
                                <div style={{ color: '#475569', fontSize: '0.7rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Output</div>
                                <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: test.passed ? '#10b981' : '#ef4444' }}>{test.actual}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {executionResult.success && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          style={{ 
                            marginTop: '1rem', padding: '2.5rem', 
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.1))',
                            border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 0 40px rgba(139,92,246,0.15)'
                          }}
                        >
                          <Trophy size={48} color="#fbbf24" style={{ margin: '0 auto 1rem', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.5))' }} />
                          <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '0.5rem' }}>Masterpiece!</h4>
                          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>All test cases passed. You've earned 50 coins and leveled up!</p>
                          <button 
                            onClick={() => router.push('/problems')}
                            style={{ background: 'var(--gradient-glow)', border: 'none', padding: '0.8rem 2rem', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            Browse Next Challenge
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Split>
        </Split>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .split-wrapper .gutter {
          background-color: #0a0a1f;
          background-repeat: no-repeat;
          background-position: 50%;
        }
        .split-wrapper .gutter.gutter-horizontal {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjbd5MgAnxQAm50CbgUzSAAAAABJRU5ErkJggg==');
          cursor: col-resize;
          border-left: 1px solid rgba(255,255,255,0.05);
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .split-wrapper .gutter.gutter-vertical {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyCB2iAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFBgIAAHQQLB/Bq7EwAAAABJRU5ErkJggg==');
          cursor: row-resize;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
        }
      `}} />
    </DashboardLayout>
  );
}
