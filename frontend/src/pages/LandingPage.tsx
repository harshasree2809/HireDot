import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Target, TrendingUp, MessageSquare, KanbanSquare,
  FileText, ArrowRight, CheckCircle, Star, Brain, Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'ATS Score Analyzer',
    description: 'Get instant ATS compatibility scores. Know exactly which keywords you need to land that interview.',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.3)',
  },
  {
    icon: Brain,
    title: 'AI Resume Tailoring',
    description: 'Our Gemini AI rewrites your resume for each job, matching tone, keywords, and requirements perfectly.',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Analysis',
    description: 'See exactly what skills you\'re missing for your dream role and get personalized learning paths.',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coach',
    description: 'AI-generated interview questions with expert sample answers and coaching tips for any role.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    icon: KanbanSquare,
    title: 'Application Tracker',
    description: 'Visual Kanban board to track every application from bookmarked to offer received.',
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.3)',
  },
  {
    icon: FileText,
    title: 'Master Profile',
    description: 'One profile. Infinite possibilities. Your complete professional story, always ready to deploy.',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
  },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer @ Google', text: 'HireDot\'s ATS scanner helped me land interviews at 4 FAANG companies in one month!', rating: 5 },
  { name: 'Arjun Mehta', role: 'Product Manager @ Flipkart', text: 'The AI resume tailoring is mind-blowing. Each resume felt genuinely customized.', rating: 5 },
  { name: 'Sneha Patel', role: 'Data Scientist @ Microsoft', text: 'Interview Prep feature alone is worth it. Got exactly the questions asked in my actual interview.', rating: 5 },
];

const stats = [
  { value: '94%', label: 'Interview Rate Increase' },
  { value: '3x', label: 'Faster Job Search' },
  { value: '50K+', label: 'Users Hired' },
  { value: '4.9★', label: 'User Rating' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', overflowX: 'hidden' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(124,58,237,0.15), transparent),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6,182,212,0.12), transparent),
          radial-gradient(ellipse 40% 40% at 50% 50%, rgba(124,58,237,0.05), transparent)
        `,
      }} />

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10, 15, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
            Hire<span style={{ color: '#7C3AED' }}>Dot</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', padding: '8px 20px',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >Sign In</button>
          <button
            onClick={() => navigate('/auth?tab=register')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              border: 'none', borderRadius: '8px', padding: '8px 20px',
              color: 'white', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
              transition: 'all 0.2s',
            }}
          >Get Started Free</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '7rem 2rem 4rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ maxWidth: '900px', width: '100%' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '9999px', padding: '0.375rem 1rem',
              fontSize: '0.8rem', fontWeight: 600, color: '#A78BFA',
              marginBottom: '2rem',
            }}
          >
            <Sparkles size={13} />
            Powered by Google Gemini AI
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            Land Your Dream Job{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9F67FF, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>10x Faster</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            HireDot's AI automates resume tailoring, ATS optimization, skill gap analysis,
            and interview prep — all from one powerful dashboard.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth?tab=register')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                border: 'none', borderRadius: '12px',
                padding: '1rem 2rem', color: 'white',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              }}
            >
              Start For Free <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate('/auth')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '1rem 2rem',
                color: 'var(--text-primary)',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
            justifyContent: 'center', marginTop: '5rem',
            position: 'relative', zIndex: 1,
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '1.25rem 2rem',
            }}>
              <div style={{
                fontSize: '2rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #9F67FF, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', fontFamily: 'Space Grotesk, sans-serif',
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Everything You Need to
              <span style={{
                background: 'linear-gradient(135deg, #9F67FF, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}> Get Hired</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              From applying to offer — HireDot powers every step of your job search journey.
            </p>
          </motion.div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '1.75rem',
                  cursor: 'default', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${feature.color}20`,
                  border: `1px solid ${feature.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: `0 0 20px ${feature.glow}`,
                }}>
                  <feature.icon size={22} color={feature.color} />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.625rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '3rem' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Loved by Job Seekers
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Real stories from real HireDot users</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={16} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '24px', padding: '4rem 2rem',
          }}
        >
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Zap size={28} color="white" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Get Hired?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Join thousands of professionals who've transformed their job search with HireDot's AI.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['ATS Optimization', 'AI Resume Tailoring', 'Interview Coach', 'Job Tracker'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <CheckCircle size={14} color="#10B981" /> {f}
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth?tab=register')}
            style={{
              marginTop: '2rem',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              border: 'none', borderRadius: '12px',
              padding: '1rem 2.5rem', color: 'white',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
            }}
          >
            Start Free Today <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={11} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            HireDot
          </span>
        </div>
        <p>© 2025 HireDot by SpaceBits. Built with ❤️ and Gemini AI.</p>
      </footer>
    </div>
  );
}
