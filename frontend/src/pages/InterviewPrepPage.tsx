import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2, AlertCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { interviewService } from '../services/interviewService';
import type { InterviewQuestion } from '../types';

const difficultyColors: Record<string, string> = { EASY: '#10B981', MEDIUM: '#F59E0B', HARD: '#EF4444' };
const categoryColors: Record<string, string> = { TECHNICAL: '#7C3AED', BEHAVIORAL: '#06B6D4', SITUATIONAL: '#F59E0B', CULTURE_FIT: '#10B981' };

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const handleGenerate = async () => {
    if (!jobTitle.trim()) { setError('Please enter a job title.'); return; }
    setLoading(true);
    setError(null);
    setQuestions([]);
    setExpandedId(null);
    try {
      const data = await interviewService.generate({ jobTitle, jobDescription, difficulty, questionCount });
      setQuestions(data);
    } catch {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(questions.map(q => q.category)))];
  const filtered = categoryFilter === 'ALL' ? questions : questions.filter(q => q.category === categoryFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1>Interview Prep</h1>
        <p>AI-generated interview questions with expert sample answers and coaching tips</p>
      </div>

      <div className="section-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Job Title *</label>
            <input className="input-field" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Difficulty</label>
            <select className="input-field" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Number of Questions</label>
            <select className="input-field" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}>
              {[3, 5, 8, 10, 15].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Job Description (optional, improves relevance)</label>
          <textarea className="input-field" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description for more targeted questions..." rows={4} style={{ resize: 'vertical' }} />
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.75rem', color: '#FCA5A5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}><AlertCircle size={16} /> {error}</div>}
        <button onClick={handleGenerate} disabled={loading || !jobTitle.trim()} className="btn-primary" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
          {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><MessageSquare size={18} /> Generate Questions</>}
        </button>
      </div>

      {questions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontWeight: 700 }}>{questions.length} Questions Generated</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                  padding: '0.3rem 0.875rem', borderRadius: '9999px', border: '1px solid',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  background: categoryFilter === cat ? (categoryColors[cat] || '#7C3AED') : 'transparent',
                  borderColor: categoryFilter === cat ? (categoryColors[cat] || '#7C3AED') : 'rgba(255,255,255,0.15)',
                  color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <AnimatePresence>
              {filtered.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '1.125rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem', textAlign: 'left' }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(124,58,237,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: '0.75rem', fontWeight: 800, color: '#A78BFA',
                    }}>Q{q.id}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, fontSize: '0.9rem' }}>{q.question}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ background: `${categoryColors[q.category] || '#7C3AED'}20`, color: categoryColors[q.category] || '#7C3AED', border: `1px solid ${categoryColors[q.category] || '#7C3AED'}30`, borderRadius: '9999px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{q.category}</span>
                        <span style={{ background: `${difficultyColors[q.difficulty]}20`, color: difficultyColors[q.difficulty], border: `1px solid ${difficultyColors[q.difficulty]}30`, borderRadius: '9999px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{q.difficulty}</span>
                      </div>
                    </div>
                    {expandedId === q.id ? <ChevronUp size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '4px' }} /> : <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '4px' }} />}
                  </button>

                  <AnimatePresence>
                    {expandedId === q.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        style={{ borderTop: '1px solid var(--border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#10B981', marginBottom: '0.5rem' }}>✓ SAMPLE ANSWER</div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q.sampleAnswer}</p>
                        </div>
                        {q.tips && q.tips.length > 0 && (
                          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '1rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#F59E0B', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Lightbulb size={13} /> TIPS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                              {q.tips.map((tip, ti) => (
                                <div key={ti} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                                  <span style={{ color: '#F59E0B', fontWeight: 700, flexShrink: 0 }}>•</span>{tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
