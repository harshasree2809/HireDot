import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Trash2, Bot, User, Zap } from 'lucide-react';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { getErrorMessage } from '../lib/errorHandler';

const suggestions = [
  'How do I tailor my resume for a FAANG company?',
  'What are the most in-demand skills for 2025?',
  'How should I negotiate my salary?',
  'Tips for writing a strong LinkedIn headline?',
  'How to prepare for a system design interview?',
  'What should I do after getting rejected?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.getHistory()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: '',
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const aiMsg = await chatService.send(msg);
      setMessages(prev => [...prev.slice(0, -1), userMsg, aiMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: Date.now().toString() + '_err',
        userId: '',
        role: 'assistant',
        content: getErrorMessage(err),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px - 4rem)', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="white" />
            </div>
            AI Career Coach
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Powered by Gemini AI — Your personal career advisor, 24/7</p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#FCA5A5', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem', paddingBottom: '0.5rem' }}>
        {historyLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#7C3AED' }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '2rem', paddingTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Bot size={32} color="white" />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hi! I'm your AI Career Coach</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '380px' }}>Ask me anything about resumes, interviews, job search strategies, salary negotiation, and career growth.</p>
            </div>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Questions</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.625rem' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.825rem', color: 'var(--text-secondary)', transition: 'all 0.15s', lineHeight: 1.5 }}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', gap: '0.875rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <Bot size={16} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '70%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '0.875rem 1.125rem',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(124,58,237,0.35)' : 'none',
                }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-wrap', color: msg.role === 'user' ? 'white' : 'var(--text-primary)' }}>{msg.content}</p>
                  <div style={{ fontSize: '0.7rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: '0.375rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{formatRelativeTime(msg.timestamp)}</div>
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                    <User size={16} color="var(--text-secondary)" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {loading && (
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={16} color="white" /></div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 4px', padding: '1rem 1.25rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7C3AED' }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Career Coach anything..."
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '0.875rem 1.125rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{
              width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
              background: input.trim() && !loading ? 'linear-gradient(135deg, #7C3AED, #06B6D4)' : 'rgba(255,255,255,0.08)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 4px 15px rgba(124,58,237,0.4)' : 'none',
            }}
          >
            <Send size={18} color={input.trim() && !loading ? 'white' : 'var(--text-muted)'} />
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  );
}
