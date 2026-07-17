import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Loader2, CheckCircle, AlertCircle, User, Briefcase, GraduationCap, Code, FolderGit2 } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuthStore } from '../store/authStore';
import type { MasterProfile, Education, Experience } from '../types';

const emptyProfile: MasterProfile = {
  fullName: '', email: '', phone: '', location: '',
  linkedinUrl: '', githubUrl: '', portfolioUrl: '', summary: '',
  education: [], experience: [], technicalSkills: [],
  softSkills: [], languages: [], certifications: [], projects: [],
};

const TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<MasterProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [skillType, setSkillType] = useState<'technicalSkills' | 'softSkills' | 'languages' | 'certifications'>('technicalSkills');

  useEffect(() => {
    profileService.getProfile().then(data => {
      if (data) setProfile(data);
      else if (user) setProfile(prev => ({ ...prev, fullName: `${user.firstName} ${user.lastName}`, email: user.email }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await profileService.saveProfile(profile);
      setProfile(saved);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof MasterProfile, value: unknown) =>
    setProfile(prev => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !(profile[skillType] as string[]).includes(trimmed)) {
      update(skillType, [...(profile[skillType] as string[]), trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (type: typeof skillType, skill: string) =>
    update(type, (profile[type] as string[]).filter(s => s !== skill));

  const addEducation = () => update('education', [...profile.education, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' } as Education]);
  const removeEducation = (i: number) => update('education', profile.education.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof Education, value: string) => {
    const updated = [...profile.education];
    updated[i] = { ...updated[i], [field]: value };
    update('education', updated);
  };

  const addExperience = () => update('experience', [...profile.experience, { company: '', role: '', startDate: '', endDate: '', current: false, description: '', achievements: [] } as Experience]);
  const removeExperience = (i: number) => update('experience', profile.experience.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof Experience, value: unknown) => {
    const updated = [...profile.experience];
    updated[i] = { ...updated[i], [field]: value };
    update('experience', updated);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#7C3AED' }} />
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#F8FAFC', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' };

  const fieldGroup = (label: string, field: keyof MasterProfile, type = 'text', placeholder = '') => (
    <div key={String(field)}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={profile[field] as string || ''} onChange={e => update(field, e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1>Master Profile</h1>
          <p>Your complete professional story — used to tailor resumes and match jobs</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><CheckCircle size={16} /> Save Profile</>}
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#6EE7B7', fontSize: '0.875rem' }}>
          <CheckCircle size={16} /> Profile saved successfully!
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </motion.div>
      )}

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: '0.375rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
            }}
          >
            <tab.icon size={14} />{tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="section-card">
        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {fieldGroup('Full Name', 'fullName', 'text', 'John Doe')}
              {fieldGroup('Email', 'email', 'email', 'john@example.com')}
              {fieldGroup('Phone', 'phone', 'tel', '+91 9876543210')}
              {fieldGroup('Location', 'location', 'text', 'Bangalore, India')}
              {fieldGroup('LinkedIn URL', 'linkedinUrl', 'url', 'https://linkedin.com/in/johndoe')}
              {fieldGroup('GitHub URL', 'githubUrl', 'url', 'https://github.com/johndoe')}
              {fieldGroup('Portfolio URL', 'portfolioUrl', 'url', 'https://johndoe.dev')}
            </div>
            <div>
              <label style={labelStyle}>Professional Summary</label>
              <textarea value={profile.summary || ''} onChange={e => update('summary', e.target.value)} placeholder="Write a compelling 3-4 line professional summary..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.education.map((edu, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <button onClick={() => removeEducation(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><X size={14} /></button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {(['institution', 'degree', 'field', 'startYear', 'endYear', 'grade'] as (keyof Education)[]).map(f => (
                    <div key={f as string}>
                      <label style={labelStyle}>{(f as string).charAt(0).toUpperCase() + (f as string).slice(1).replace(/([A-Z])/g, ' $1')}</label>
                      <input value={(edu[f] as string) || ''} onChange={e => updateEducation(i, f, e.target.value)} style={inputStyle} placeholder={f === 'startYear' ? '2020' : f === 'endYear' ? '2024' : ''} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}><Plus size={15} /> Add Education</button>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.experience.map((exp, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <button onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><X size={14} /></button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {(['company', 'role', 'startDate', 'endDate'] as (keyof Experience)[]).map(f => (
                    <div key={f as string}>
                      <label style={labelStyle}>{(f as string).charAt(0).toUpperCase() + (f as string).slice(1).replace(/([A-Z])/g, ' $1')}</label>
                      <input value={(exp[f] as string) || ''} onChange={e => updateExperience(i, f, e.target.value)} style={inputStyle} placeholder={f === 'endDate' ? 'Present' : ''} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                  <input type="checkbox" id={`current-${i}`} checked={exp.current} onChange={e => updateExperience(i, 'current', e.target.checked)} />
                  <label htmlFor={`current-${i}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Currently working here</label>
                </div>
                <div>
                  <label style={labelStyle}>Description / Responsibilities</label>
                  <textarea value={exp.description || ''} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="Describe your key responsibilities and achievements..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}><Plus size={15} /> Add Experience</button>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['technicalSkills', 'softSkills', 'languages', 'certifications'] as const).map(type => (
                <button key={type} onClick={() => setSkillType(type)}
                  style={{
                    padding: '0.375rem 1rem', borderRadius: '9999px', border: '1px solid', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    background: skillType === type ? 'rgba(124,58,237,0.2)' : 'transparent',
                    borderColor: skillType === type ? '#7C3AED' : 'rgba(255,255,255,0.15)',
                    color: skillType === type ? '#A78BFA' : 'var(--text-secondary)',
                  }}>{type.replace(/([A-Z])/g, ' $1').trim()}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="input-field" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder={`Add ${skillType.replace(/([A-Z])/g, ' $1').toLowerCase()}...`} style={{ flex: 1 }} />
              <button onClick={addSkill} className="btn-primary" style={{ padding: '0.5rem 1rem', flexShrink: 0 }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '60px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.875rem' }}>
              {(profile[skillType] as string[]).length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No {skillType.replace(/([A-Z])/g, ' $1').toLowerCase()} added yet...</span>}
              {(profile[skillType] as string[]).map(skill => (
                <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '9999px', padding: '0.25rem 0.625rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#A78BFA' }}>{skill}</span>
                  <button onClick={() => removeSkill(skillType, skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A78BFA', display: 'flex', padding: 0 }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.projects.map((proj, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                <button onClick={() => update('projects', profile.projects.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#EF4444', display: 'flex' }}><X size={14} /></button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.875rem' }}>
                  {['name', 'url', 'githubUrl'].map(f => (
                    <div key={f}>
                      <label style={labelStyle}>{f === 'githubUrl' ? 'GitHub URL' : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                      <input
                        value={((proj as unknown) as Record<string, string>)[f] || ''}
                        onChange={e => { const updated = [...profile.projects]; ((updated[i] as unknown) as Record<string, string>)[f] = e.target.value; update('projects', updated); }}
                        style={inputStyle} placeholder={f === 'url' ? 'https://...' : ''} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea value={proj.description || ''}
                    onChange={e => { const updated = [...profile.projects]; updated[i] = { ...updated[i], description: e.target.value }; update('projects', updated); }}
                    placeholder="Describe the project and your role..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            ))}
            <button onClick={() => update('projects', [...profile.projects, { name: '', description: '', technologies: [], url: '', githubUrl: '' }])} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}><Plus size={15} /> Add Project</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
