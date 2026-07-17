import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Loader2, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { jobService } from '../services/jobService';
import type { JobMatchResult } from '../types';
import { getScoreColor, getScoreLabel } from '../lib/utils';
import { getErrorMessage } from '../lib/errorHandler';

export default function JobMatchPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [analyzedJD, setAnalyzedJD] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzingJD, setAnalyzingJD] = useState(false);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both your profile/resume and the job description.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await jobService.match(resumeText, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) { setError('Please enter a job description first.'); return; }
    setAnalyzingJD(true);
    try {
      const data = await jobService.analyze(jobDescription);
      setAnalyzedJD(data as Record<string, unknown>);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setAnalyzingJD(false);
    }
  };

  const fitColors: Record<string, string> = { EXCELLENT: '#10B981', GOOD: '#06B6D4', FAIR: '#F59E0B', POOR: '#EF4444' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1>Job Match Analyzer</h1>
        <p>See how well your profile matches a job and get actionable insights</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Resume / Profile</label>
          <textarea className="input-field" value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume or profile summary here..." rows={14} style={{ resize: 'vertical', fontSize: '0.8rem' }} />
        </div>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Description</label>
          <textarea className="input-field" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={14} style={{ resize: 'vertical', fontSize: '0.8rem' }} />
          <button onClick={handleAnalyzeJD} disabled={analyzingJD || !jobDescription.trim()} className="btn-secondary" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            {analyzingJD ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <TrendingUp size={14} />} Analyze JD
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#FCA5A5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <AnimatePresence>
        {analyzedJD && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="#06B6D4" /> Job Description Analysis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              {Object.entries(analyzedJD).filter(([, v]) => v && v !== 'null').map(([key, value]) => (
                <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {Array.isArray(value) ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {(value as string[]).slice(0, 6).map((v, i) => <span key={i} className="tag">{v}</span>)}
                        {(value as string[]).length > 6 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{(value as string[]).length - 6} more</span>}
                      </div>
                    ) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={handleMatch} disabled={loading || !resumeText.trim() || !jobDescription.trim()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
        {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Matching (may take 30s)...</> : <><Briefcase size={18} /> Analyze Job Match</>}
      </button>

      <AnimatePresence>
        {result && result.matchScore != null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Match Score */}
            <div className="section-card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: getScoreColor(result.matchScore), lineHeight: 1 }}>{result.matchScore}%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Match Score</div>
                <div style={{
                  display: 'inline-block', marginTop: '0.625rem',
                  background: `${fitColors[result.fitLevel] || '#64748B'}20`,
                  color: fitColors[result.fitLevel] || '#64748B',
                  border: `1px solid ${fitColors[result.fitLevel] || '#64748B'}40`,
                  borderRadius: '9999px', padding: '0.25rem 1rem',
                  fontSize: '0.875rem', fontWeight: 700,
                }}>{result.fitLevel}</div>
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                  {result.recommendation}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="#10B981" /> Requirements Met</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(result.matchedRequirements || []).map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />{r}
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><XCircle size={16} color="#EF4444" /> Requirements Missing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(result.unmatchedRequirements || []).map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <XCircle size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />{r}
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', color: '#10B981' }}>Your Strengths</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(result.strengths || []).map((s, i) => <span key={i} className="badge badge-success">{s}</span>)}
                </div>
              </div>
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', color: '#F59E0B' }}>Areas to Improve</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(result.improvements || []).map((imp, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#F59E0B', fontWeight: 700, flexShrink: 0 }}>→</span>{imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
