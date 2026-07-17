import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, Briefcase, TrendingUp, MessageSquare, ArrowRight, Zap, Trophy, Clock } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useAuthStore } from '../store/authStore';
import type { DashboardStats } from '../types';

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0 });

  useEffect(() => {
    applicationService.getStats().then(setStats).catch(() => {});
  }, []);

  const pipelineData = [
    { name: 'Applied', value: stats.applied, color: '#7C3AED' },
    { name: 'Screening', value: stats.screening, color: '#06B6D4' },
    { name: 'Interview', value: stats.interview, color: '#F59E0B' },
    { name: 'Offer', value: stats.offer, color: '#10B981' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' },
  ];

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  const quickActions = [
    { label: 'Scan Resume', desc: 'Check ATS score', icon: Target, color: '#7C3AED', path: '/app/ats' },
    { label: 'Match Job', desc: 'Analyze JD fit', icon: Briefcase, color: '#06B6D4', path: '/app/job-match' },
    { label: 'Skill Gap', desc: 'Find missing skills', icon: TrendingUp, color: '#10B981', path: '/app/skill-gap' },
    { label: 'Interview Prep', desc: 'Practice Q&A', icon: MessageSquare, color: '#F59E0B', path: '/app/interview' },
  ];

  const tips = [
    { icon: '💡', text: 'Tailor your resume for each application to improve ATS score by up to 60%' },
    { icon: '🎯', text: 'Apply to jobs within 24-48 hours of posting for 3x better response rates' },
    { icon: '📊', text: 'Use metrics and quantified achievements to stand out from 80% of applicants' },
    { icon: '🤝', text: 'Personalize your cover letter — 45% of recruiters reject generic applications' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {greeting}, {user?.firstName} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Your job search command center — let's land that offer!
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '12px', padding: '0.75rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Trophy size={18} color="#F59E0B" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {total} Applications Tracked
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}
      >
        {pipelineData.map((item) => (
          <div key={item.name} className="stat-card card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/tracker')}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `${item.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.875rem',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>{item.name}</div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-card"
        >
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Application Pipeline</h3>
          {total === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>No applications yet. Start tracking!</p>
              <button onClick={() => navigate('/app/tracker')} className="btn-primary" style={{ marginTop: '1rem' }}>Add Application</button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="section-card"
        >
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Status Breakdown</h3>
          {total === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.875rem' }}>Add applications to see breakdown</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pipelineData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
                    {pipelineData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pipelineData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, marginLeft: 'auto' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>QUICK ACTIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => navigate(action.path)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.25rem',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${action.color}20`,
                border: `1px solid ${action.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <action.icon size={18} color={action.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{action.label}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{action.desc}</div>
              </div>
              <ArrowRight size={14} color="var(--text-muted)" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={13} color="white" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>AI Career Tips</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
            {tips.map((tip, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1rem',
                display: 'flex', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{tip.icon}</span>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
