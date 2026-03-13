'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck, CheckCircle, XCircle, Trophy, Zap,
  ArrowRight, RotateCcw, Timer, Brain, Star
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { assessmentAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { AssessmentQuestion } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'welcome' | 'quiz' | 'result';

const MOCK_QUESTIONS: AssessmentQuestion[] = [
  { _id: '1', question: 'What is the time complexity of accessing an element by index in an array?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctAnswer: 2, difficulty: 'easy', topic: 'arrays', explanation: 'Array access by index is O(1) as it uses direct memory address calculation.' },
  { _id: '2', question: 'Which data structure uses LIFO (Last In, First Out) principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctAnswer: 1, difficulty: 'easy', topic: 'stacks', explanation: 'A Stack follows the LIFO principle — the last element inserted is the first to be removed.' },
  { _id: '3', question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correctAnswer: 2, difficulty: 'medium', topic: 'sorting', explanation: 'QuickSort degrades to O(n²) when the pivot is always the smallest or largest element.' },
  { _id: '4', question: 'In a Binary Search Tree, for any node N, which is true?', options: ['Left subtree > N', 'Right subtree < N', 'Left subtree < N and right subtree > N', 'No specific order'], correctAnswer: 2, difficulty: 'medium', topic: 'trees', explanation: 'BST property: left subtree contains smaller values, right subtree contains larger values.' },
  { _id: '5', question: 'What algorithm is best for finding shortest path in an unweighted graph?', options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], correctAnswer: 1, difficulty: 'medium', topic: 'graphs', explanation: 'BFS explores nodes level by level, naturally finding the shortest path in unweighted graphs.' },
  { _id: '6', question: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, difficulty: 'medium', topic: 'sorting', explanation: 'Merge sort requires O(n) auxiliary space for the temporary arrays used during merging.' },
  { _id: '7', question: 'Which technique is used in the "Two Sum" problem optimally?', options: ['Two Pointers', 'Binary Search', 'Hash Map', 'Dynamic Programming'], correctAnswer: 2, difficulty: 'easy', topic: 'hashing', explanation: 'Using a HashMap to store complements gives O(n) time and O(n) space solution.' },
  { _id: '8', question: 'What is the recurrence relation for Fibonacci using dynamic programming?', options: ['F(n) = F(n-1) + F(n-2)', 'F(n) = 2*F(n-1)', 'F(n) = F(n/2)', 'F(n) = F(n-1) * F(n-2)'], correctAnswer: 0, difficulty: 'hard', topic: 'dynamic-programming', explanation: 'Fibonacci: each number is the sum of the two preceding ones.' },
  { _id: '9', question: 'Which traversal of a BST gives nodes in sorted order?', options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'], correctAnswer: 2, difficulty: 'medium', topic: 'trees', explanation: 'In-order traversal (left → root → right) visits BST nodes in ascending sorted order.' },
  { _id: '10', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctAnswer: 2, difficulty: 'easy', topic: 'binary-search', explanation: 'Binary search halves the search space each step, resulting in O(log n) complexity.' },
];

function getSkillLevel(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 80) return { level: 'advanced', color: '#f87171', emoji: '🔥' };
  if (pct >= 55) return { level: 'intermediate', color: '#fbbf24', emoji: '⚡' };
  return { level: 'beginner', color: '#34d399', emoji: '🌱' };
}

export default function AssessmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('welcome');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(MOCK_QUESTIONS);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleNext(true);
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, current]);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].correctAnswer) {
      setScore(s => s + 1);
    }
    setAnswers(a => ({ ...a, [questions[current]._id]: idx }));
  };

  const handleNext = (timedOut = false) => {
    if (!answered && !timedOut) return;
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setPhase('result');
    const { level } = getSkillLevel(score, questions.length);
    if (user) {
      const updatedUser = { ...user, assessmentCompleted: true, skillLevel: level as 'beginner' | 'intermediate' | 'advanced', assessmentScore: score };
      setUser(updatedUser);
    }
    toast.success('Assessment complete! Skill level assigned 🎉');
  };

  const q = questions[current];
  const result = getSkillLevel(score, questions.length);
  const timerPct = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? '#34d399' : timeLeft > 7 ? '#fbbf24' : '#f87171';

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem', maxWidth: '680px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
        {/* Welcome Phase */}
        {phase === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ width: '72px', height: '72px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardCheck size={36} color="white" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
              Skill Assessment
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Take this 10-question quiz to assess your current DSA knowledge.
              You'll get a personalized learning path based on your results.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { icon: ClipboardCheck, label: '10 Questions', sub: 'MCQ format', color: '#8b5cf6' },
                { icon: Timer, label: '30 sec/question', sub: 'Timed quiz', color: '#06b6d4' },
                { icon: Brain, label: 'Skill Rating', sub: 'Personalized path', color: '#34d399' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                  <Icon size={22} color={color} style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>{label}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{sub}</div>
                </div>
              ))}
            </div>
            {user?.assessmentCompleted && (
              <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', color: '#fbbf24', fontSize: '0.85rem' }}>
                ⚠️ You&apos;ve already completed the assessment. Retaking will update your skill level.
              </div>
            )}
            <button onClick={() => { setPhase('quiz'); setCurrent(0); setScore(0); setAnswers({}); setSelected(null); setAnswered(false); setTimeLeft(30); }}
              className="btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} /> Start Assessment <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Question {current + 1} of {questions.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: timerColor, fontWeight: 700, fontSize: '0.9rem' }}>
                  <Timer size={15} /> {timeLeft}s
                </div>
              </div>
              <div className="progress-bar" style={{ height: '6px' }}>
                <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
              </div>
              {/* Timer bar */}
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '999px', transition: 'width 1s linear, background 0.3s' }} />
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{q.topic.replace(/-/g, ' ')}</span>
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {q.question}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, i) => {
                  let bg = 'rgba(255,255,255,0.03)';
                  let borderColor = 'rgba(255,255,255,0.06)';
                  let textColor = '#94a3b8';
                  if (answered) {
                    if (i === q.correctAnswer) { bg = 'rgba(52,211,153,0.08)'; borderColor = 'rgba(52,211,153,0.3)'; textColor = '#34d399'; }
                    else if (i === selected && i !== q.correctAnswer) { bg = 'rgba(239,68,68,0.08)'; borderColor = 'rgba(239,68,68,0.3)'; textColor = '#f87171'; }
                  } else if (selected === i) {
                    bg = 'rgba(139,92,246,0.1)'; borderColor = 'rgba(139,92,246,0.4)'; textColor = '#a78bfa';
                  }

                  return (
                    <button key={i} onClick={() => handleSelect(i)} style={{
                      padding: '0.875rem 1rem', background: bg,
                      border: `1px solid ${borderColor}`, borderRadius: '10px',
                      color: textColor, cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left', fontSize: '0.9rem', fontWeight: 500,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                      onMouseEnter={e => { if (!answered) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.05)'; } }}
                      onMouseLeave={e => { if (!answered) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; } }}
                    >
                      <span style={{ width: '24px', height: '24px', flexShrink: 0, background: 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt}
                      {answered && i === q.correctAnswer && <CheckCircle size={16} color="#34d399" style={{ marginLeft: 'auto' }} />}
                      {answered && i === selected && i !== q.correctAnswer && <XCircle size={16} color="#f87171" style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>EXPLANATION: </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{q.explanation}</span>
                </div>
              )}
            </div>

            <button onClick={() => handleNext()} disabled={!answered}
              className="btn-primary" style={{
                width: '100%', padding: '0.875rem', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: answered ? 1 : 0.5, cursor: answered ? 'pointer' : 'not-allowed',
              }}>
              {current === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: `linear-gradient(135deg, ${result.color}30, ${result.color}10)`, border: `2px solid ${result.color}40`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
              {result.emoji}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>
              Assessment Complete!
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              You scored <strong style={{ color: '#f1f5f9' }}>{score}/{questions.length}</strong> questions correctly.
            </p>

            <div style={{ display: 'inline-block', padding: '1.25rem 3rem', background: `${result.color}10`, border: `2px solid ${result.color}30`, borderRadius: '16px', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Skill Level</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: result.color, textTransform: 'capitalize' }}>{result.level}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                {Math.round((score / questions.length) * 100)}% accuracy
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/roadmap" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem' }}>
                <Star size={16} /> View Your Roadmap <ArrowRight size={16} />
              </Link>
              <button onClick={() => { setPhase('welcome'); }} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem' }}>
                <RotateCcw size={16} /> Retake
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
