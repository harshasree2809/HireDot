import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, FileText, CheckCircle } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ResumeData {
  basics: { name: string; email: string; phone: string; role: string; linkedin: string };
  summary: string;
  experience: Array<{ title: string; company: string; dates: string; description: string }>;
  education: Array<{ degree: string; school: string; dates: string }>;
  skills: string;
}

interface Props {
  onGenerated: (file: File) => Promise<void>;
  onCancel: () => void;
}

export default function ResumeBuilderForm({ onGenerated, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<ResumeData>({
    basics: { name: '', email: '', phone: '', role: '', linkedin: '' },
    summary: '',
    experience: [{ title: '', company: '', dates: '', description: '' }],
    education: [{ degree: '', school: '', dates: '' }],
    skills: ''
  });

  const handleGenerate = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = pdfRef.current;
      // Make it temporarily visible for html2pdf to process
      element.style.display = 'block';
      
      const opt = {
        margin: 10,
        filename: `${data.basics.name || 'Resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      const file = new File([pdfBlob], `${data.basics.name || 'Resume'}.pdf`, { type: 'application/pdf' });
      
      element.style.display = 'none';
      await onGenerated(file);
    } catch (e) {
      console.error('Failed to generate PDF', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#F8FAFC',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '1rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#94A3B8',
    marginBottom: '0.4rem',
  };

  return (
    <div className="section-card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700 }}>Build Resume with AI</h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Step {step} of 5</span>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} value={data.basics.name} onChange={e => setData({...data, basics: {...data.basics, name: e.target.value}})} placeholder="John Doe" />
          <label style={labelStyle}>Target Role</label>
          <input style={inputStyle} value={data.basics.role} onChange={e => setData({...data, basics: {...data.basics, role: e.target.value}})} placeholder="Software Engineer" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={data.basics.email} onChange={e => setData({...data, basics: {...data.basics, email: e.target.value}})} placeholder="john@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} value={data.basics.phone} onChange={e => setData({...data, basics: {...data.basics, phone: e.target.value}})} placeholder="(555) 123-4567" />
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label style={labelStyle}>Professional Summary</label>
          <textarea style={{...inputStyle, minHeight: '120px'}} value={data.summary} onChange={e => setData({...data, summary: e.target.value})} placeholder="A brief summary of your professional background and goals..." />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label style={labelStyle}>Work Experience</label>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
              {data.experience.length > 1 && (
                <button onClick={() => setData({...data, experience: data.experience.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input style={inputStyle} value={exp.title} onChange={e => { const newExp = [...data.experience]; newExp[i].title = e.target.value; setData({...data, experience: newExp}); }} placeholder="Job Title" />
                <input style={inputStyle} value={exp.company} onChange={e => { const newExp = [...data.experience]; newExp[i].company = e.target.value; setData({...data, experience: newExp}); }} placeholder="Company" />
              </div>
              <input style={inputStyle} value={exp.dates} onChange={e => { const newExp = [...data.experience]; newExp[i].dates = e.target.value; setData({...data, experience: newExp}); }} placeholder="e.g. Jan 2020 - Present" />
              <textarea style={{...inputStyle, minHeight: '80px', marginBottom: 0}} value={exp.description} onChange={e => { const newExp = [...data.experience]; newExp[i].description = e.target.value; setData({...data, experience: newExp}); }} placeholder="Key responsibilities and achievements..." />
            </div>
          ))}
          <button onClick={() => setData({...data, experience: [...data.experience, { title: '', company: '', dates: '', description: '' }]})} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}><Plus size={16} /> Add Experience</button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label style={labelStyle}>Education</label>
          {data.education.map((edu, i) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
              {data.education.length > 1 && (
                <button onClick={() => setData({...data, education: data.education.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
              )}
              <input style={inputStyle} value={edu.degree} onChange={e => { const newEdu = [...data.education]; newEdu[i].degree = e.target.value; setData({...data, education: newEdu}); }} placeholder="Degree (e.g. BS Computer Science)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input style={inputStyle} value={edu.school} onChange={e => { const newEdu = [...data.education]; newEdu[i].school = e.target.value; setData({...data, education: newEdu}); }} placeholder="School/University" />
                <input style={inputStyle} value={edu.dates} onChange={e => { const newEdu = [...data.education]; newEdu[i].dates = e.target.value; setData({...data, education: newEdu}); }} placeholder="e.g. 2018 - 2022" />
              </div>
            </div>
          ))}
          <button onClick={() => setData({...data, education: [...data.education, { degree: '', school: '', dates: '' }]})} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}><Plus size={16} /> Add Education</button>
        </motion.div>
      )}

      {step === 5 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label style={labelStyle}>Skills (comma separated)</label>
          <textarea style={{...inputStyle, minHeight: '100px'}} value={data.skills} onChange={e => setData({...data, skills: e.target.value})} placeholder="JavaScript, React, Node.js, Python, Project Management..." />
          
          <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', color: '#6EE7B7', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Ready to generate!</strong>
              Your resume is ready. Click the button below to generate the PDF and add it to your profile.
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ChevronLeft size={16} /> Back</button>
          )}
        </div>
        <div>
          {step < 5 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>Next <ChevronRight size={16} /></button>
          ) : (
            <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
              {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating PDF...</> : <><FileText size={16} /> Generate & Upload</>}
            </button>
          )}
        </div>
      </div>

      {/* Hidden PDF Template */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} style={{ padding: '40px', background: 'white', color: 'black', fontFamily: 'Arial, sans-serif', width: '800px' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#111' }}>{data.basics.name || 'Your Name'}</h1>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#444' }}>{data.basics.role}</p>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{data.basics.email} | {data.basics.phone}</p>
          </div>
          
          {data.summary && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px', color: '#222' }}>Professional Summary</h2>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>{data.summary}</p>
            </div>
          )}

          {data.experience.some(e => e.title || e.company) && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px', color: '#222' }}>Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{exp.title}</h3>
                    <span style={{ fontSize: '14px', color: '#666' }}>{exp.dates}</span>
                  </div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{exp.company}</p>
                  <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.5', color: '#333', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {data.education.some(e => e.degree || e.school) && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px', color: '#222' }}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{edu.school}</h3>
                    <span style={{ fontSize: '14px', color: '#666' }}>{edu.dates}</span>
                  </div>
                  <p style={{ margin: '0', fontSize: '14px' }}>{edu.degree}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills && (
            <div>
              <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px', color: '#222' }}>Skills</h2>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>{data.skills}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
