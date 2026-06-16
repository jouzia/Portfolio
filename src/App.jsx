import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CertificateVault } from './components/CertificateVault';
import { supabase } from './supabaseClient';
import { ProjectExecutionModal } from './components/ProjectExecutionModal';

/* ─── Fade-in variant ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

/* ─── Static fallback projects ────────────────────────────── */
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Bud AI: Multi-Agent Personal Assistant',
    description: 'Developed an agentic personal assistant using Python and React with a custom "glassmorphism" aesthetic. Features a specialized Teacher Persona system that utilizes context-aware retrieval to provide high-accuracy academic support and interactive student engagement.',
    tags: ['Python', 'React', 'Gemini API', 'Generative AI', 'NLP'],
    live_url: 'https://zia0309-budai.hf.space',
    doc_url: 'https://github.com/Jouzia',
    is_featured: true,
  },
  {
    id: 2,
    title: 'Secure MCP Server & AI Chatbot',
    description: 'Engineered a standalone chatbot backend utilizing the Model Context Protocol (MCP). Implemented a standardized MCP server using JSON-RPC/stdio transport layers, allowing the LLM to securely execute local functions, fetch real-time data, and interact with local academic files.',
    tags: ['MCP', 'Python', 'JSON-RPC', 'Node.js', 'API Integration'],
    live_url: 'https://github.com/Jouzia', 
    doc_url: 'https://github.com/Jouzia',
    is_featured: true,
  },
  {
    id: 3,
    title: 'Gaming Behavior Trends Dashboard',
    description: 'Built a dynamic analytical dashboard in Microsoft Excel to automate the tracking of player engagement metrics. Leveraged advanced pivot tables, power query, and conditional formatting to transform raw datasets into actionable insights, streamlining weekly reporting workflows.',
    tags: ['Data Analytics', 'Excel', 'Data Visualization', 'Pivot Tables'],
    live_url: '#',
    doc_url: '#',
    is_featured: false,
  },
  {
    id: 4,
    title: 'Full-Stack Personal Portfolio',
    description: 'Designed and deployed a mobile-first, responsive portfolio using Next.js and JavaScript. Focused on high-performance rendering and a modern UI to showcase live sub-projects and integrated AI assistants.',
    tags: ['Next.js', 'JavaScript', 'Tailwind CSS', 'Vercel'],
    live_url: 'https://jouziaportfolio.vercel.app/',
    doc_url: 'https://github.com/Jouzia',
    is_featured: false,
  },
];

/* ─── Reusable Slider Wrapper Component ──────────────────── */
const SliderContainer = ({ label, title, children, loading }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollBounds = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  // FIXED: Re-runs calculation dynamically when items finish loading
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollBounds);
      const timer = setTimeout(checkScrollBounds, 150);
      return () => {
        el.removeEventListener('scroll', checkScrollBounds);
        clearTimeout(timer);
      };
    }
  }, [children, loading]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const amount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          {label && <p className="section-label" style={{ marginBottom: '0.5rem' }}>{label}</p>}
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', margin: 0 }}>{title}</h2>
        </div>
        
        {/* Navigation arrows */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            style={{
              width: '40px', height: '40px', borderRadius: '8px',
              border: canScrollLeft ? '1px solid var(--glass-border)' : '1px solid rgba(255,255,255,0.02)',
              background: canScrollLeft ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: canScrollLeft ? '#00ffcc' : 'rgba(255,255,255,0.15)',
              fontFamily: 'var(--font-mono)', fontSize: '1rem', cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            &lt;
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            style={{
              width: '40px', height: '40px', borderRadius: '8px',
              border: canScrollRight ? '1px solid var(--glass-border)' : '1px solid rgba(255,255,255,0.02)',
              background: canScrollRight ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: canScrollRight ? '#00ffcc' : 'rgba(255,255,255,0.15)',
              fontFamily: 'var(--font-mono)', fontSize: '1rem', cursor: canScrollRight ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{
          display: 'flex', gap: '1.5rem', overflowX: 'auto',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          paddingBottom: '1rem', cursor: isDragging ? 'grabbing' : 'grab',
          scrollSnapType: isDragging ? 'none' : 'x mandatory'
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ─── Nav ─────────────────────────────────────────────────── */
const Nav = ({ resumeUrl }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 2rem',
      height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
        jouzia.dev
      </span>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {['about', 'projects', 'certifications', 'resume', 'contact'].map(s => (
          <a key={s} 
            href={s === 'resume' ? resumeUrl : `#${s}`}
            target={s === 'resume' && resumeUrl !== '#resume' ? '_blank' : undefined}
            rel={s === 'resume' && resumeUrl !== '#resume' ? 'noreferrer' : undefined}
            style={{
              fontSize: '0.82rem', color: 'var(--text-secondary)',
              textDecoration: 'none', transition: 'color 0.15s',
              textTransform: 'capitalize', letterSpacing: '0.02em'
            }}
            onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
            onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
          >
            {s}
          </a>
        ))}
        <a href="/admin" style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          border: '1px solid var(--glass-border)',
          padding: '4px 12px', borderRadius: '999px',
          transition: 'all 0.15s'
        }}
          onMouseOver={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'rgba(124,109,242,0.4)'; }}
          onMouseOut={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--glass-border)'; }}
        >
          admin ↗
        </a>
      </div>
    </nav>
  );
};

/* ─── Hero ────────────────────────────────────────────────── */
const Hero = () => (
  <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
      <p className="section-label"> BCA · Data Science & Generative AI · St. Joseph's College</p>
    </motion.div>

    <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
      style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '700', lineHeight: '1.1', margin: '1rem 0' }}>
      Shaik Jouzia Afreen H
    </motion.h1>

    <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={2}
      className="gradient-text"
      style={{ fontSize: 'clamp(1.1rem, 3vw, 1.8rem)', fontWeight: '400', marginBottom: '1.5rem' }}>
      Building intelligent systems at the intersection of data and language
    </motion.h2>

    <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3}
      style={{ maxWidth: '560px', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.75', marginBottom: '2.5rem' }}>
      Specializing in LLM-powered applications, data pipelines, and full-stack AI systems.
      Turning messy real-world data into reliable, deployable intelligence.
    </motion.p>

    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
      style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <a href="#projects" className="btn-accent">View Projects</a>
      <a href="#contact" style={{
        padding: '0.6rem 1.4rem', borderRadius: '10px',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-secondary)', fontSize: '0.85rem',
        textDecoration: 'none', fontWeight: '500',
        transition: 'all 0.15s'
      }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(124,109,242,0.4)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        Contact Me
      </a>
    </motion.div>

    {/* Scroll cue */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)' }}>
      <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, var(--glass-border))' }} />
    </motion.div>
  </section>
);

/* ─── About ───────────────────────────────────────────────── */
const About = () => (
  <section id="about" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <p className="section-label">01 — About</p>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '3rem' }}>
        Engineering intelligence, not just code
      </h2>
    </motion.div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {[
        {
          icon: '⬡',
          title: 'Data Science & ML',
          body: 'Trained on the full supervised-learning stack — from feature engineering and EDA to deploying gradient-boosted ensembles and SHAP explainability layers. My work prioritizes reproducibility and audit-ready model cards.'
        },
        {
          icon: '◈',
          title: 'Generative AI Systems',
          body: 'Fluent in the modern LLM toolchain: prompt engineering, RAG architectures, fine-tuning with QLoRA, and function-calling agents. I build Gen AI features that ship to production, not just Colab demos.'
        },
        {
          icon: '◎',
          title: 'Full-Stack Engineering',
          body: 'React, FastAPI, Supabase, and containerized microservices. I close the loop between data science notebooks and user-facing products — this very portfolio is a live example.'
        },
        {
          icon: '◇',
          title: 'Academic Foundation',
          body: 'II BCA student at St. Joseph\'s College, pursuing a rigorous curriculum in Computer Applications with a self-directed specialization track in Data Science and Generative AI through DeepLearning.AI, Google, and AWS programs.'
        }
      ].map((item, i) => (
        <motion.div key={i} className="glass" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
          style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{item.icon}</div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>{item.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.7' }}>{item.body}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─── Projects ────────────────────────────────────────────── */
const Projects = ({ projects, loading }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="projects" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {loading ? (
        <>
          <p className="section-label">02 — Projects</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '3rem' }}>Systems I've built</h2>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'hidden' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: '360px', height: '220px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', flexShrink: 0 }} />
            ))}
          </div>
        </>
      ) : (
        <SliderContainer label="02 — Projects" title="Systems I've built" loading={loading}>
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="glass"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              style={{
                width: '360px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
                scrollSnapAlign: 'start',
                flexShrink: 0
              }}
            >
              {p.is_featured && (
                <span style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '600',
                  background: 'rgba(124,109,242,0.15)', color: 'var(--accent-primary)',
                  border: '1px solid rgba(124,109,242,0.25)', padding: '2px 8px', borderRadius: '999px'
                }}>FEATURED</span>
              )}
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', paddingRight: p.is_featured ? '80px' : '0', lineHeight: '1.4' }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: '1.65', flex: 1 }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {p.live_url && p.live_url !== '#' && (
                    <a href={p.live_url} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                      LIVE →
                    </a>
                  )}
                  {p.doc_url && p.doc_url !== '#' && (
                    <a href={p.doc_url} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
                      DOCS →
                    </a>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setIsModalOpen(true);
                  }}
                  style={{
                    background: 'transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: '#00ffcc',
                    cursor: 'pointer',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 255, 204, 0.25)',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={e => { 
                    e.currentTarget.style.background = '#00ffcc';
                    e.currentTarget.style.borderColor = '#00ffcc';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseOut={e => { 
                    e.currentTarget.style.color = '#00ffcc'; 
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.25)';
                  }}
                >
                  EXPLORE PROCESS
                </button>
              </div>
            </motion.div>
          ))}
        </SliderContainer>
      )}

      <ProjectExecutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </section>
  );
};

/* ─── Certifications ──────────────────────────────────────── */
// FIXED: Completely removed the extra wrapping container div.
const Certifications = () => {
  const [certLoading, setCertLoading] = useState(true);

  return (
    <section id="certifications" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <SliderContainer 
        label="03 — Certifications" 
        title="Credential vault"
        loading={certLoading}
      >
        <CertificateVault onLoaded={() => setCertLoading(false)} />
      </SliderContainer>
    </section>
  );
};

/* ─── Resume ──────────────────────────────────────────────── */
const Resume = () => {
  const skills = [
    { category: 'Languages', items: ['Python (Advanced)', 'Java', 'PHP', 'C++', 'JavaScript', 'HTML/CSS', 'SQL'] },
    { category: 'AI & ML', items: ['Model Context Protocol (MCP)', 'Gemini API', 'LangChain', 'NLP', 'Generative AI'] },
    { category: 'Web Dev', items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'] },
    { category: 'Data Science', items: ['Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Azure', 'Databricks', 'VS Code', 'Google Colab'] },
  ];

  const education = [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: "St. Joseph's College, Cuddalore",
      detail: 'CGPA: 8.5',
      duration: 'Expected Graduation: May 2027 | Final-Year Student'
    },
    {
      degree: 'Higher Secondary (HSC)',
      institution: "St. Mary's Mat. Hr. Sec. School",
      detail: '94%',
      duration: 'Graduated: 2024'
    },
    {
      degree: 'Secondary School (SSLC)',
      institution: "St. Mary's Mat. Hr. Sec. School",
      detail: '92%',
      duration: 'Graduated: 2022'
    }
  ];

  const achievements = [
    'Google Skills Lab: Selected Participant (May 2026)',
    'Student Ambassador Program 2026: Officially shortlisted candidate',
    'IBM: AI Fundamentals, Data Science & Analytics, Project Management certs',
    'Top 10 Finalist: AI-driven SaaS startup pitch, St. Joseph’s College Business Plan Competition'
  ];

  return (
    <section id="resume" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <p className="section-label">04 — Resume & Skills</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '3rem' }}>
          Professional profile
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Side: Summary & Education */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary Card */}
          <motion.div className="glass" style={{ padding: '2rem' }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              Summary
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.75' }}>
              Aspiring Full-Stack Developer and AI Engineer specializing in Generative AI and Model Context Protocol (MCP). Experienced in building agentic systems that bridge LLMs with local data environments. Shortlisted for the Student Ambassador Program 2026 and selected for the Google Skills Lab. Targeting Winter 2026 Student Researcher tracks; fully available for full-time on-site project engagement during university winter breaks.
            </p>
          </motion.div>

          {/* Education Timeline */}
          <motion.div className="glass" style={{ padding: '2rem' }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.25rem', marginLeft: '0.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Timeline Dot */}
                  <span style={{
                    position: 'absolute', left: '-1.58rem', top: '4px',
                    width: '9px', height: '9px', borderRadius: '50%',
                    background: 'var(--accent-primary)', border: '2.5px solid var(--surface-0)'
                  }} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px' }}>{edu.degree}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{edu.institution}</p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                      {edu.detail}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {edu.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Technical Skills & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Skills Card */}
          <motion.div className="glass" style={{ padding: '2rem' }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
              Technical Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {skills.map((grp, idx) => (
                <div key={idx}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {grp.category}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {grp.items.map(skill => (
                      <span key={skill} className="tag" style={{ background: 'rgba(79, 209, 197, 0.06)', color: 'var(--accent-secondary)', borderColor: 'rgba(79, 209, 197, 0.15)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div className="glass" style={{ padding: '2rem' }} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem', color: 'var(--accent-primary)' }}>
              Achievements & Certifications
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              {achievements.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '2px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── Contact ─────────────────────────────────────────────── */
const Contact = ({ resumeUrl }) => (
  <section id="contact" style={{ padding: '6rem 2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <p className="section-label">05 — Contact</p>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1rem' }}>
        Let's build something
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.75' }}>
        Open to research collaborations, internship opportunities, and technically interesting problems.
        If you're working on something at the edge of data and language — reach out.
      </p>
      <a href="mailto:jouzia@example.com" className="btn-accent" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '0.9rem' }}>
        jouzia@example.com
      </a>
    </motion.div>

    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
      style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
      {[
        { label: 'GitHub', href: 'https://github.com/' },
        { label: 'LinkedIn', href: 'https://linkedin.com/' },
        { label: 'Resume', href: resumeUrl },
      ].map(link => (
        <a key={link.label} 
          href={link.href} 
          target={link.label !== 'Resume' || resumeUrl !== '#resume' ? '_blank' : undefined} 
          rel={link.label !== 'Resume' || resumeUrl !== '#resume' ? 'noreferrer' : undefined}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)',
            textDecoration: 'none', letterSpacing: '0.05em',
            transition: 'color 0.15s'
          }}
          onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
        >
          {link.label} {link.label !== 'Resume' || resumeUrl !== '#resume' ? '↗' : ''}
        </a>
      ))}
    </motion.div>

    <p style={{ marginTop: '4rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
      © 2026 Shaik Jouzia Afreen H · Built with React + Supabase · Deployed on Vercel
    </p>
  </section>
);

/* ─── App ─────────────────────────────────────────────────── */
export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState('#resume');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch projects
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .order('is_featured', { ascending: false });
          
        if (projectError) throw projectError;
        setProjects(projectData?.length ? projectData : FALLBACK_PROJECTS);

        // 2. Scan certificates table for temporary resume PDF
        const { data: certData } = await supabase
          .from('certificates')
          .select('*');

        console.log("Supabase certificates array output:", certData);

        if (certData) {
          const foundResume = certData.find(c => c.title?.toLowerCase().includes('resume'));
          if (foundResume) {
            const urlSource = foundResume.pdf_url || foundResume.url || foundResume.link;
            if (urlSource) {
              setResumeUrl(urlSource);
            }
          }
        }
      } catch (err) {
        console.error('Data loading sequence halted:', err);
        setProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Nav resumeUrl={resumeUrl} />
      <Hero />
      <About />
      <Projects projects={projects} loading={loading} />
      <Certifications />
      <Resume />
      <Contact resumeUrl={resumeUrl} />
    </>
  );
}