import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ExternalLink, Building2, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import type { Application, ApplicationStatus } from '../types';
import { getStatusColor, formatRelativeTime } from '../lib/utils';

const COLUMNS: { id: ApplicationStatus; label: string; emoji: string }[] = [
  { id: 'BOOKMARKED', label: 'Bookmarked', emoji: '🔖' },
  { id: 'APPLIED', label: 'Applied', emoji: '📤' },
  { id: 'SCREENING', label: 'Screening', emoji: '🔍' },
  { id: 'INTERVIEW', label: 'Interview', emoji: '🎤' },
  { id: 'OFFER', label: 'Offer', emoji: '🎉' },
  { id: 'REJECTED', label: 'Rejected', emoji: '❌' },
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: '', jobTitle: '', jobUrl: '', location: '',
    salaryRange: '', status: 'APPLIED' as ApplicationStatus, notes: '',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch { } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.companyName || !form.jobTitle) return;
    setSubmitting(true);
    try {
      const newApp = await applicationService.create(form);
      setApplications(prev => [newApp, ...prev]);
      setShowModal(false);
      setForm({ companyName: '', jobTitle: '', jobUrl: '', location: '', salaryRange: '', status: 'APPLIED', notes: '' });
    } catch { } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const updated = await applicationService.updateStatus(id, newStatus);
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
    } catch { }
  };

  const handleDelete = async (id: string) => {
    try {
      await applicationService.delete(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch { }
  };

  const getColumnApps = (status: ApplicationStatus) =>
    applications.filter(a => a.status === status);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#7C3AED' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Application Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{applications.length} applications tracked across {COLUMNS.length} stages</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary glow-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', padding: '0.75rem 1.5rem', fontSize: '1rem', flexShrink: 0, zIndex: 10 }}>
          <Plus size={18} /> Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(180px, 1fr))`,
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        width: '100%',
      }}>
        {COLUMNS.map((col) => {
          const colApps = getColumnApps(col.id);
          const color = getStatusColor(col.id);
          return (
            <div key={col.id} style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid rgba(255,255,255,0.05)`,
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '400px',
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{col.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{col.label}</span>
                </div>
                <div style={{
                  background: `${color}20`,
                  color: color,
                  borderRadius: '9999px',
                  padding: '1px 8px',
                  fontSize: '0.75rem', fontWeight: 700,
                }}>{colApps.length}</div>
              </div>

              <div style={{ width: '100%', height: '2px', background: color, borderRadius: '2px', opacity: 0.6 }} />

              <AnimatePresence>
                {colApps.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px', padding: '0.875rem',
                      cursor: 'default',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.jobTitle}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          <Building2 size={12} /> {app.companyName}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(app.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '2px', borderRadius: '4px',
                        flexShrink: 0,
                      }}>
                        <X size={13} />
                      </button>
                    </div>

                    {app.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        <MapPin size={11} /> {app.location}
                      </div>
                    )}
                    {app.salaryRange && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        <DollarSign size={11} /> {app.salaryRange}
                      </div>
                    )}

                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {COLUMNS.filter(c => c.id !== col.id).map(c => (
                        <button key={c.id} onClick={() => handleStatusChange(app.id, c.id)} style={{
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px', padding: '3px 8px', cursor: 'pointer',
                          fontSize: '0.7rem', color: 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}>→ {c.label}</button>
                      ))}
                    </div>

                    <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatRelativeTime(app.appliedAt)}</span>
                      {app.jobUrl && (
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED' }}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {colApps.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No applications here
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#0D1526',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px', padding: '2rem',
                width: '100%', maxWidth: '480px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Add Application</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'companyName', label: 'Company Name *', placeholder: 'Google, Amazon...' },
                  { key: 'jobTitle', label: 'Job Title *', placeholder: 'Software Engineer...' },
                  { key: 'jobUrl', label: 'Job URL', placeholder: 'https://...' },
                  { key: 'location', label: 'Location', placeholder: 'Remote, Bangalore...' },
                  { key: 'salaryRange', label: 'Salary Range', placeholder: '₹15-20 LPA' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>{field.label}</label>
                    <input
                      className="input-field"
                      value={form[field.key as keyof typeof form] as string}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Status</label>
                  <select
                    className="input-field"
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as ApplicationStatus }))}
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Notes</label>
                  <textarea
                    className="input-field"
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleAdd} disabled={submitting || !form.companyName || !form.jobTitle} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {submitting ? <Loader2 size={15} /> : <Plus size={15} />} Add Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
