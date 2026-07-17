import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Loader2, CheckCircle, XCircle, AlertCircle, Zap, Copy } from 'lucide-react';
import { atsService } from '../services/atsService';
import { resumeService } from '../services/resumeService';
import type { ATSResult } from '../types';
import { getScoreColor, getScoreLabel } from '../lib/utils';

export default function ATSScannerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tailoring, setTailoring] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume text and job description.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setTailoredResume(null);
    try {
      const data = await atsService.analyze(resumeText, jobDescription);
      setResult(data);
    } catch {
      setError('Analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    setTailoring(true);
    try {
      const tailored = await resumeService.tailor(resumeText, jobDescription);
      setTailoredResume(tailored);
    } catch {
      setError('Tailoring failed. Please try again.');
    } finally {
      setTailoring(false);
    }
  };

  const handleCopy = () => {
    if (tailoredResume) {
      navigator.clipboard.writeText(tailoredResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scoreColor = result ? getScoreColor(result.atsScore) : '#7C3AED';
  const circumference = 2 * Math.PI * 54;
  const strokeDash = result ? circumference - (result.atsScore / 100) * circumference : circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1>ATS Scanner</h1>
        <p>Analyze your resume against a job description and get an ATS compatibility score</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resume Text</label>
          <textarea
            className="input-field"
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={14}
            style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{resumeText.length} characters</p>
        </div>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Description</label>
          <textarea
            className="input-field"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={14}
            style={{ resize: 'vertical', fontSize: '0.8rem' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{jobDescription.length} characters</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#FCA5A5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || !resumeText.trim() || !jobDescription.trim()}
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
      >
        {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><Target size={18} /> Analyze ATS Score</>}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Score Card */}
            <div className="section-card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={circumference} strokeDashoffset={strokeDash}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{ marginTop: '-100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{result.atsScore}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</div>
                </div>
                <div style={{ marginTop: '55px' }}>
                  <div style={{ background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40`, borderRadius: '9999px', padding: '0.25rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    {getScoreLabel(result.atsScore)}
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Section Scores</h3>
                {Object.entries(result.sectionScores || {}).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: getScoreColor(val as number) }}>{val as number}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', background: getScoreColor(val as number), borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Keywords */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="#10B981" /> Keywords Found ({result.keywordsFound?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(result.keywordsFound || []).map(kw => (
                    <span key={kw} className="badge badge-success">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <XCircle size={16} color="#EF4444" /> Missing Keywords ({result.keywordsMissing?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(result.keywordsMissing || []).map(kw => (
                    <span key={kw} className="badge badge-danger">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} color="#F59E0B" /> AI Improvement Suggestions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {result.suggestions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem' }}>
                      <span style={{ color: '#F59E0B', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tailor Button */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleTailor} disabled={tailoring} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {tailoring ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Tailoring...</> : <><Zap size={16} /> AI Tailor My Resume</>}
              </button>
            </div>

            {tailoredResume && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700 }}>AI-Tailored Resume</h3>
                  <button onClick={handleCopy} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem' }}>
                    <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace' }}>{tailoredResume}</pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
