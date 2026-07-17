import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Eye, EyeOff, Loader2, ArrowLeft, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/app/dashboard');
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(data);
      setAuth({ id: res.userId, firstName: res.firstName, lastName: res.lastName, email: res.email, userId: res.userId }, res.token);
      navigate('/app/dashboard');
    } catch (e: unknown) {
      const axiosError = e as { response?: { data?: { error?: string } } };
      setError(axiosError?.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(data);
      setAuth({ id: res.userId, firstName: res.firstName, lastName: res.lastName, email: res.email, userId: res.userId }, res.token);
      navigate('/app/dashboard');
    } catch (e: unknown) {
      const axiosError = e as { response?: { data?: { error?: string } } };
      setError(axiosError?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#F8FAFC',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#94A3B8',
    marginBottom: '0.4rem',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 60% at 30% 40%, rgba(124,58,237,0.15), transparent),
          radial-gradient(ellipse 50% 50% at 70% 60%, rgba(6,182,212,0.12), transparent)
        `,
      }} />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '8px 16px',
          color: '#94A3B8', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.875rem', zIndex: 10,
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={
          {
            width: '100%', maxWidth: '440px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'relative', zIndex: 1,
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }
        }
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            Hire<span style={{ color: '#7C3AED' }}>Dot</span>
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px', padding: '3px',
          marginBottom: '1.75rem',
        }}>
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(null); }}
              style={{
                flex: 1, padding: '0.5rem',
                borderRadius: '8px', border: 'none',
                background: activeTab === tab ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
                color: activeTab === tab ? 'white' : '#94A3B8',
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab ? '0 4px 15px rgba(124,58,237,0.35)' : 'none',
              }}
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '8px', padding: '0.75rem',
              color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '1rem',
            }}
          >{error}</motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={loginForm.handleSubmit(handleLogin)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      {...loginForm.register('email')}
                      type="email"
                      placeholder="john@example.com"
                      style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      style={{ ...inputStyle, paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%', marginTop: '1.5rem',
                  background: isLoading ? 'rgba(124,58,237,0.6)' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  border: 'none', borderRadius: '10px', padding: '0.875rem',
                  color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(124,58,237,0.4)', transition: 'all 0.2s',
                }}
              >
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                Don't have an account?{' '}
                <button type="button" onClick={() => setActiveTab('register')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontWeight: 600 }}>
                  Create one
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={registerForm.handleSubmit(handleRegister)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                      <input {...registerForm.register('firstName')} placeholder="John"
                        style={{ ...inputStyle, paddingLeft: '2rem', fontSize: '0.85rem' }} />
                    </div>
                    {registerForm.formState.errors.firstName && (
                      <p style={{ color: '#F87171', fontSize: '0.7rem', marginTop: '0.2rem' }}>{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                      <input {...registerForm.register('lastName')} placeholder="Doe"
                        style={{ ...inputStyle, paddingLeft: '2rem', fontSize: '0.85rem' }} />
                    </div>
                    {registerForm.formState.errors.lastName && (
                      <p style={{ color: '#F87171', fontSize: '0.7rem', marginTop: '0.2rem' }}>{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input {...registerForm.register('email')} type="email" placeholder="john@example.com"
                      style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input {...registerForm.register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                      style={{ ...inputStyle, paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input {...registerForm.register('confirmPassword')} type="password" placeholder="Repeat password"
                      style={{ ...inputStyle, paddingLeft: '2.25rem' }} />
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p style={{ color: '#F87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {['No credit card required', 'Free forever plan', 'Full AI features included'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                    <CheckCircle size={13} color="#10B981" /> {f}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%', marginTop: '1.25rem',
                  background: isLoading ? 'rgba(124,58,237,0.6)' : 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  border: 'none', borderRadius: '10px', padding: '0.875rem',
                  color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(124,58,237,0.4)',
                }}
              >
                {isLoading ? <><Loader2 size={18} /> Creating account...</> : 'Create Free Account'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => setActiveTab('login')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontWeight: 600 }}>
                  Sign in
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
