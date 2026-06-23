import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

export const CertificateVault = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  
  // 1. Added Ref for scrolling
  const scrollContainerRef = useRef(null);

  // 2. Added scroll function
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

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
    { id: 'p1', title: 'Software Engineering Job Simulation', issuer: 'JPMorgan Chase & Co.', date: '2026-04', pdf_url: 'https://drive.google.com/file/d/12cLWOpNpl1x4UyqEyKJalXaaq9oTXDOh/view?usp=sharing' },
    { id: 'p2', title: 'Google Cloud Gen AI Academy (Cohort 2)', issuer: 'Google Cloud', date: '2026-05', pdf_url: 'https://hack2skill.com/dashboard' },
    { id: 'p3', title: 'Student Ambassador Program (Shortlisted)', issuer: 'Google', date: '2026-05', pdf_url: 'https://drive.google.com/file/d/1cFLhjQNdAcB0OtP8LsNzLjwwH78i0heJ/view?usp=sharing' },
    { id: 'p4', title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', date: '2024-08', pdf_url: 'https://drive.google.com/file/d/1SE0SUcRWJlF3rNo62zbdBSMNNhp7s1AT/view?usp=drive_link' },
    { id: 'p5', title: 'Generative AI with LLMs', issuer: 'AWS', date: '2024-06', pdf_url: 'https://drive.google.com/file/d/12710ftL_9DYO_5p2vHtQ_ZMYgDXqVz5U/view?usp=drive_link' },
    { id: 'p6', title: 'Prompt Engineering for Developers', issuer: 'DeepLearning.AI', date: '2024-07', pdf_url: 'https://drive.google.com/file/d/12S0PW21md3c6jvuPrRGwIulPxBSMP3jh/view?usp=drive_link' },
    { id: 'p7', title: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI', date: '2024-09', pdf_url: 'https://drive.google.com/file/d/1i3EQPKPM9Cdq1bU1IJo_asDLZ9wNZYFq/view?usp=drive_link' },
    { id: 'p8', title: 'Google Data Analytics', issuer: 'Google', date: '2024-03', pdf_url: 'https://drive.google.com/file/d/12p7KjLyhLFVpBemdKFuX6pAkgdcV0Duh/view?usp=drive_link' },
    { id: 'p9', title: 'AI Fundamentals & Data Science', issuer: 'IBM', date: '2025-12', pdf_url: 'https://drive.google.com/file/d/1i6OKC8ZDbrLFFtlz7kk5W9vAc-TNJSMz/view?usp=drive_link' },
    { id: 'p10', title: 'Python for Data Science', issuer: 'IBM', date: '2023-11', pdf_url: 'https://drive.google.com/file/d/1iNbePy2LbHlokkI6lSvZNtM9H8yffC23/view?usp=drive_link' },
    { id: 'p11', title: 'HR Analytics Specialization', issuer: 'UCI', date: '2025-06', pdf_url: 'https://drive.google.com/file/d/1iT-oLoKQOgL1hfMiDS1EXEXaygydrgM1/view?usp=drive_link' },
    { id: 'p12', title: 'Graphic Design Specialization', issuer: 'Adobe', date: '2024-09', pdf_url: 'https://drive.google.com/file/d/10o3ceaHY22LUlch0RMdy4Hnz19klIjz9/view?usp=drive_link' }
  ];

  const rawCerts = certs.length > 0 ? certs : placeholders;
  const displayCerts = rawCerts.filter(c => !c.title?.toLowerCase().includes('resume'));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDrivePreviewUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. Header and Navigation container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>Credential vault</h2>
        
        {/* Buttons are now inline and guaranteed to be visible */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => scroll('left')} 
            style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '6px 14px' }}
          >
            ←
          </button>
          <button 
            onClick={() => scroll('right')} 
            style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '6px 14px' }}
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1rem' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: '260px', height: '160px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', flexShrink: 0, animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          style={{ display: 'flex', gap: '1.5rem', width: '100%', overflowX: 'auto', paddingBottom: '1.25rem', scrollSnapType: 'x mandatory', scrollbarWidth: 'thin' }}
        >
          <AnimatePresence>
            {displayCerts.map((c, i) => (
              <motion.div key={c.id} className="glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px', width: '260px', flexShrink: 0, scrollSnapAlign: 'start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(124,109,242,0.12)', border: '1px solid rgba(124,109,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="var(--accent-primary, #7c6df2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>{c.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.issuer}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{formatDate(c.date)}</span>
                  {c.pdf_url && c.pdf_url !== '#' ? (
                    <button onClick={() => setSelectedCert(c)} style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent-primary, #7c6df2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', padding: 0 }}>VIEW CERTIFICATE →</button>
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', opacity: 0.4 }}>PENDING</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {certs.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1.5rem', fontFamily: 'var(--font-mono)' }}>// showing placeholder data — connect Supabase to load live certificates</p>
      )}



      <AnimatePresence>
        {selectedCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCert(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(6, 6, 9, 0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.96, y: 15, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 15, opacity: 0 }} transition={{ type: 'spring', duration: 0.4 }} onClick={(e) => e.stopPropagation()} style={{ background: 'rgba(18, 18, 24, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '1.5rem', width: '100%', maxWidth: '900px', height: '82vh', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{selectedCert.title}</h4><p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>{selectedCert.issuer} — {formatDate(selectedCert.date)}</p></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <a href={selectedCert.pdf_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>EXTERNAL LINK ↗</a>
                  <button onClick={() => setSelectedCert(null)} style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                </div>
              </div>
              <div style={{ flex: 1, width: '100%', borderRadius: '14px', overflow: 'hidden', background: '#0d0d11', border: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
                {selectedCert.pdf_url.includes('drive.google.com') ? (
                  <iframe src={getDrivePreviewUrl(selectedCert.pdf_url)} width="100%" height="100%" frameBorder="0" allow="autoplay" style={{ border: 'none' }} title={selectedCert.title} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '2rem', textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>This credential is verified directly on an external platform hub.</p><a href={selectedCert.pdf_url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'var(--accent-primary, #7c6df2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.02em' }}>Open Verification Portal ↗</a></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
