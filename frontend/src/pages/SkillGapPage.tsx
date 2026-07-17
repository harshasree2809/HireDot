import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, AlertCircle, Plus, X, ExternalLink, Clock, BookOpen } from 'lucide-react';
import { skillService } from '../services/skillService';
import type { SkillGapResult } from '../types';
import { getImportanceColor } from '../lib/utils';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function SkillGapPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !userSkills.includes(trimmed)) {
      setUserSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setUserSkills(prev => prev.filter(s => s !== skill));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || userSkills.length === 0) {
      setError('Please provide both a job description and at least one skill.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await skillService.analyzeGap(jobDescription, userSkills);
      setResult(data);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const radarData = result ? [
    { subject: 'Present Skills', value: result.presentSkills?.length || 0, fullMark: (result.presentSkills?.length || 0) + (result.missingCriticalSkills?.length || 0) },
    { subject: 'Missing', value: result.missingCriticalSkills?.length || 0, fullMark: (result.presentSkills?.length || 0) + (result.missingCriticalSkills?.length || 0) },
    { subject: 'Gap Score', value: result.overallGapScore || 0, fullMark: 100 },
    { subject: 'Readiness', value: 100 - (result.overallGapScore || 0), fullMark: 100 },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1>Skill Gap Analysis</h1>
        <p>Discover exactly what skills you're missing and get personalized learning resources</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Description</label>
          <textarea className="input-field" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={10} style={{ resize: 'vertical', fontSize: '0.8rem' }} />
        </div>
        <div className="section-card">
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Current Skills</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              className="input-field"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press Enter..."
              style={{ flex: 1 }}
            />
            <button onClick={addSkill} className="btn-primary" style={{ padding: '0.5rem 1rem', flexShrink: 0 }}><Plus size={16} /></button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '80px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem' }}>
            {userSkills.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Your skills will appear here...</span>}
            {userSkills.map(skill => (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '9999px', padding: '0.25rem 0.625rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#A78BFA' }}>{skill}</span>
                <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A78BFA', display: 'flex', padding: 0 }}><X size={12} /></button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{userSkills.length} skills added</p>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#FCA5A5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16} /> {error}</div>}

      <button onClick={handleAnalyze} disabled={loading || !jobDescription.trim() || userSkills.length === 0} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
        {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><TrendingUp size={18} /> Analyze Skill Gap</>}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: 700 }}>Gap Overview</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: result.overallGapScore > 50 ? '#EF4444' : '#10B981' }}>{result.overallGapScore}%</div>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.overallGapScore}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: result.overallGapScore > 50 ? '#EF4444' : '#10B981', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, textAlign: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{result.presentSkills?.length || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skills Present</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444' }}>{result.missingCriticalSkills?.length || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skills Missing</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}><Clock size={13} color="#F59E0B" /><span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time to Ready</span></div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{result.estimatedTimeToReady}</p>
                </div>
              </div>

              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.875rem' }}>Skill Radar</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Radar name="Skills" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Present Skills */}
            <div className="section-card">
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', color: '#10B981' }}>✓ Skills You Have</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(result.presentSkills || []).map((s, i) => <span key={i} className="badge badge-success">{s}</span>)}
              </div>
            </div>

            {/* Missing Skills with Resources */}
            <div className="section-card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} color="#06B6D4" /> Critical Skills to Learn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(result.missingCriticalSkills || []).map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.skill}</span>
                      <span style={{ background: `${getImportanceColor(item.importance)}20`, color: getImportanceColor(item.importance), border: `1px solid ${getImportanceColor(item.importance)}40`, borderRadius: '9999px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{item.importance}</span>
                    </div>
                    {item.learningResources && item.learningResources.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {item.learningResources.map((res, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{res.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{res.duration}</div>
                            </div>
                            {res.url && res.url !== 'null' && (
                              <a href={res.url.startsWith('http') ? res.url : `https://www.google.com/search?q=${encodeURIComponent(res.name)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED' }}>
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {result.careerPath && (
              <div className="section-card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Recommended Career Path</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.careerPath}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
