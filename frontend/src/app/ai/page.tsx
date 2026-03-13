'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Send, Loader2, User, Trash2, Code, Sparkles, BookOpen, Copy, Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { aiAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { ChatMessage } from '@/types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED = [
  'Explain binary search with a simple example',
  'What is the difference between BFS and DFS?',
  'How does dynamic programming work?',
  'Give me a problem on sliding window technique',
  'Explain quick sort with time complexity',
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect code blocks: render them with monospace styling
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const content = part.slice(3, -3).replace(/^\w+\n/, '');
        return (
          <pre key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: '#94a3b8', overflow: 'auto', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {content}
          </pre>
        );
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}
    >
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', flexShrink: 0,
        borderRadius: '50%',
        background: isUser ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'linear-gradient(135deg, #06b6d4, #22d3ee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser ? <User size={16} color="white" /> : <Brain size={16} color="white" />}
      </div>

      {/* Message */}
      <div 
        className="premium-chat-bubble"
        style={{
          maxWidth: '80%',
          padding: '1.25rem 1.5rem',
          borderRadius: isUser ? '24px 4px 24px 24px' : '4px 24px 24px 24px',
          position: 'relative',
          background: isUser ? 'rgba(139,92,246,0.08)' : 'rgba(15,15,40,0.75)',
          border: isUser ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(255,255,255,0.08)',
        }}>
        {/* Subtle inner glow for AI messages */}
        {!isUser && (
          <div style={{
            position: 'absolute', inset: 0, 
            background: 'radial-gradient(circle at top left, rgba(6,182,212,0.05) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />
        )}
        <div style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.65 }}>
          {renderContent(message.content)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
            {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
          <button onClick={copyContent} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: '2px' }}

            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
          >
            {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AIPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI DSA tutor 🤖\n\nI can help you with:\n- **Algorithm explanations** with step-by-step walkthroughs\n- **Code reviews** and optimizations\n- **Problem-solving hints** without giving away the answer\n- **Time & space complexity** analysis\n\nWhat would you like to learn today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); }
  }, [isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userInput = text || input.trim();
    if (!userInput) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(userInput);
      const reply = res.data?.reply || res.data?.response || res.data?.message;
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply || "I'm here to help! Could you please rephrase your question?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Fallback response when API not available
      const fallback: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm currently running in **offline/demo mode**. To get real AI responses, you need to add your free Gemini API key to the backend.\n\n1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and generate a free API key.\n2. Open your backend \`.env\` file.\n3. Add the key: \`GOOGLE_API_KEY=your_key_here\`\n4. Restart the backend server.\n\nOnce configured, I'll be able to help you debug code, analyze complexity, and explain algorithms!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Chat cleared! What DSA concept would you like to explore?",
      timestamp: new Date(),
    }]);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 0px)', maxWidth: '820px', padding: '1.5rem 2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
               <div style={{ position: 'absolute', inset: -4, background: 'rgba(167,139,250,0.2)', filter: 'blur(8px)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
               <Sparkles size={28} color="#a78bfa" style={{ position: 'relative' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI DSA Tutor
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Active & Ready to help</span>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.6rem 1rem', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '12px', color: '#64748b', cursor: 'pointer', 
              fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' 
            }}
          >
            <Trash2 size={15} /> Clear Conversation
          </motion.button>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ flexShrink: 0, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Questions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  padding: '0.4rem 0.875rem',
                  background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)',
                  borderRadius: '999px', color: '#94a3b8', cursor: 'pointer',
                  fontSize: '0.8rem', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.12)'; (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.06)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.25rem', marginBottom: '1rem' }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          </AnimatePresence>
          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={16} color="white" />
              </div>
              <div style={{ display: 'flex', gap: '4px', padding: '0.875rem 1.125rem', background: 'rgba(15,15,40,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#8b5cf6',
                    animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, position: 'relative' }} className="neon-border">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your logical blocker or paste your code snippet here..."
            rows={3}
            className="input-field"
            style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
              paddingRight: '5rem',
              borderRadius: '18px',
              minHeight: '100px',
              border: '1px solid rgba(139,92,246,0.15)',
              background: 'rgba(10,10,31,0.85)',
              backdropFilter: 'blur(20px)',
              lineHeight: 1.7
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              position: 'absolute', right: '0.75rem', bottom: '0.75rem',
              width: '38px', height: '38px',
              background: input.trim() && !loading ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={17} color="#64748b" style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={17} color={input.trim() ? 'white' : '#475569'} />}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
