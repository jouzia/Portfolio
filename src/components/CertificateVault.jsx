import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

export const CertificateVault = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setCerts(data || []);
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const placeholders = [
    { 
      id: 'p1', 
      title: 'Software Engineering Job Simulation', 
      issuer: 'JPMorgan Chase & Co.', 
      date: '2026-04', 
      pdf_url: 'https://drive.google.com/file/d/12cLWOpNpl1x4UyqEyKJalXaaq9oTXDOh/view?usp=sharing' 
    },
    { 
      id: 'p2', 
      title: 'Google Cloud Gen AI Academy (Cohort 2)', 
      issuer: 'Google Cloud', 
      date: '2026-05', 
      pdf_url: 'https://hack2skill.com/dashboard' 
    },
    { 
      id: 'p3', 
      title: 'Student Ambassador Program (Shortlisted)', 
      issuer: 'Google', 
      date: '2026-05', 
      pdf_url: '#' 
    },
    { 
      id: 'p4', 
      title: 'Machine Learning Specialization', 
      issuer: 'DeepLearning.AI', 
      date: '2024-08', 
      pdf_url: '#' 
    },
    { 
      id: 'p5', 
      title: 'Generative AI with LLMs', 
      issuer: 'AWS', 
      date: '2024-06', 
      pdf_url: '#' 
    },
    { 
      id: 'p6', 
      title: 'Prompt Engineering for Developers', 
      issuer: 'DeepLearning.AI', 
      date: '2024-07', 
      pdf_url: '#' 
    },
    { 
      id: 'p7', 
      title: 'Neural Networks and Deep Learning', 
      issuer: 'DeepLearning.AI', 
      date: '2024-09', 
      pdf_url: '#' 
    },
    { 
      id: 'p8', 
      title: 'Google Data Analytics', 
      issuer: 'Google', 
      date: '2024-03', 
      pdf_url: '#' 
    },
    { 
      id: 'p9', 
      title: 'AI Fundamentals & Data Science', 
      issuer: 'IBM', 
      date: '2025-12', 
      pdf_url: '#' 
    },
    { 
      id: 'p10', 
      title: 'Python for Data Science', 
      issuer: 'IBM', 
      date: '2023-11', 
      pdf_url: '#' 
    },
    { 
      id: 'p11', 
      title: 'HR Analytics Specialization', 
      issuer: 'UCI', 
      date: '2025-06', 
      pdf_url: '#' 
    },
    { 
      id: 'p12', 
      title: 'Graphic Design Specialization', 
      issuer: 'Adobe', 
      date: '2024-09', 
      pdf_url: '#' 
    }
  ];

  // 1. Determine active raw dataset
  const rawCerts = certs.length > 0 ? certs : placeholders;

  // 2. Filter out the resume item so it doesn't render as an explicit award card badge
  const displayCerts = rawCerts.filter(c => !c.title?.toLowerCase().includes('resume'));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ width: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1rem' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '260px', height: '160px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              flexShrink: 0,
              animation: 'pulse 1.5s ease infinite',
              animationDelay: `${i * 0.15}s`
            }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          width: '100%'
        }}>
          <AnimatePresence>
            {displayCerts.map((c, i) => (
              <motion.div
                key={c.id}
                className="glass"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px',
                  width: '260px',
                  flexShrink: 0,
                  scrollSnapAlign: 'start'
                }}
              >
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(124,109,242,0.12)',
                  border: '1px solid rgba(124,109,242,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.issuer}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {formatDate(c.date)}
                  </span>
                  {c.pdf_url && c.pdf_url !== '#' ? (
                    <a
                      href={c.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      VIEW PDF →
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', opacity: 0.4 }}>
                      PENDING
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {certs.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          // showing placeholder data — connect Supabase to load live certificates
        </p>
      )}
    </div>
  );
};