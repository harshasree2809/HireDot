import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader2, CheckCircle, ExternalLink, Clock, AlertCircle, Edit3 } from 'lucide-react';
import { resumeService } from '../services/resumeService';
import type { ResumeVersion } from '../types';
import { formatRelativeTime } from '../lib/utils';
import ResumeBuilderForm from '../components/ResumeBuilderForm';
import { getErrorMessage } from '../lib/errorHandler';

export default function ResumePage() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [versionName, setVersionName] = useState('');
  const [mode, setMode] = useState<'upload' | 'build'>('upload');

  useEffect(() => {
    resumeService.getVersions().then(setVersions).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are supported.'); return; }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const newVersion = await resumeService.upload(file, versionName || file.name);
      setVersions(prev => [newVersion, ...prev]);
      setSuccess('Resume uploaded and parsed successfully!');
      setVersionName('');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }, [versionName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: uploading,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <h1>Resume Builder</h1>
        <p>Upload, parse, and manage your resume versions with AI-powered analysis</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <button 
          onClick={() => setMode('upload')}
          className={mode === 'upload' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem' }}
        >
          <Upload size={18} /> Upload Existing PDF
        </button>
        <button 
          onClick={() => setMode('build')}
          className={mode === 'build' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem' }}
        >
          <Edit3 size={18} /> Build from Scratch
        </button>
      </div>

      {mode === 'build' ? (
        <ResumeBuilderForm 
          onCancel={() => setMode('upload')}
          onGenerated={async (file) => {
            setUploading(true);
            try {
              const newVersion = await resumeService.upload(file, `Built Resume - ${new Date().toLocaleDateString()}`);
              setVersions(prev => [newVersion, ...prev]);
              setSuccess('Resume successfully built, generated, and uploaded!');
              setMode('upload');
              setTimeout(() => setSuccess(null), 4000);
            } catch (err: any) {
              setError(getErrorMessage(err));
            } finally {
              setUploading(false);
            }
          }}
        />
      ) : (
        <div className="section-card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upload New Resume</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Version Name (optional)</label>
          <input className="input-field" value={versionName} onChange={e => setVersionName(e.target.value)} placeholder="e.g. Google SWE Resume v3, Product Manager Resume..." style={{ maxWidth: '480px' }} />
        </div>

        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#7C3AED' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '14px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: isDragActive ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Loader2 size={40} color="#7C3AED" style={{ animation: 'spin 1s linear infinite' }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Uploading & Parsing Resume...</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Extracting text with Apache PDFBox</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: isDragActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
                <Upload size={24} color={isDragActive ? '#A78BFA' : 'var(--text-muted)'} />
              </div>
              <div>
                <p style={{ fontWeight: 700, marginBottom: '0.375rem' }}>{isDragActive ? 'Drop your PDF here!' : 'Drag & drop your resume PDF'}</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>or <span style={{ color: '#A78BFA', fontWeight: 600 }}>click to browse</span> • PDF only • Max 10MB</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#FCA5A5', fontSize: '0.875rem', marginTop: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#6EE7B7', fontSize: '0.875rem', marginTop: '1rem' }}>
            <CheckCircle size={16} /> {success}
          </motion.div>
        )}
      </div>
      )}

      {/* Versions List */}
      <div className="section-card">
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resume Versions ({versions.length})</h3>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#7C3AED' }} /></div>
        ) : versions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontWeight: 600, marginBottom: '0.375rem' }}>No resumes uploaded yet</p>
            <p style={{ fontSize: '0.875rem' }}>Upload your first PDF to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <AnimatePresence>
              {versions.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color="#A78BFA" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.versionName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Clock size={11} /> {formatRelativeTime(v.uploadedAt)}
                      </span>
                      {v.parsedText && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.parsedText.length} chars parsed</span>}
                      {v.isTailored && <span className="badge badge-accent">AI Tailored</span>}
                      {v.atsScore > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>ATS: {v.atsScore}%</span>}
                    </div>
                  </div>
                  <a href={v.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', padding: '0.4rem 0.875rem', textDecoration: 'none' }}>
                    <ExternalLink size={13} /> View PDF
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
