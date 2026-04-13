import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CertificateVault } from './components/CertificateVault';
import { supabase } from './supabaseClient';

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
    title: 'Retrieval-Augmented Generation Pipeline',
    description: 'Engineered a production-grade RAG system using LangChain and FAISS vector indexing. Ingests unstructured PDF corpora, chunks with semantic overlap, embeds via OpenAI Ada-002, and serves zero-hallucination Q&A through a FastAPI layer. Reduced LLM token cost by 40% vs. naive full-context injection.',
    tags: ['LangChain', 'FAISS', 'FastAPI', 'OpenAI', 'Python'],
    live_url: '#',
    doc_url: '#',
    is_featured: true,
  },
  {
    id: 2,
    title: 'Multimodal Sentiment Analyzer',
    description: 'Built a dual-encoder classifier combining BERT-based text embeddings with CNN-extracted visual features from social media posts. Achieves 91.4% macro-F1 on the MulSen-21 benchmark. Deployed as a containerized microservice on GCP Cloud Run with real-time Pub/Sub streaming.',
    tags: ['PyTorch', 'BERT', 'Docker', 'GCP', 'Transformers'],
    live_url: '#',
    doc_url: '#',
    is_featured: true,
  },
  {
    id: 3,
    title: 'Predictive Hospital Readmission Model',
    description: 'Developed an XGBoost ensemble trained on 50K+ de-identified patient records from the MIMIC-III dataset. Implemented SHAP explainability to satisfy clinical audit requirements. Integrated with a Streamlit decision-support dashboard used in a pilot study with St. Joseph\'s Medical faculty.',
    tags: ['XGBoost', 'SHAP', 'Streamlit', 'Pandas', 'scikit-learn'],
    live_url: '#',
    doc_url: '#',
    is_featured: false,
  },
  {
    id: 4,
    title: 'Autonomous SQL Query Generator',
    description: 'Fine-tuned a CodeLlama-7B model on a domain-specific text-to-SQL corpus using QLoRA (4-bit quantization). Achieves 78.3% execution accuracy on Spider benchmark. Features an iterative self-correction loop where failed queries are re-prompted with the database schema and error trace.',
    tags: ['LLM', 'CodeLlama', 'QLoRA', 'SQL', 'HuggingFace'],
    live_url: '#',
    doc_url: '#',
    is_featured: false,
  },
];

/* ─── Nav ─────────────────────────────────────────────────── */
const Nav = () => {
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
        {['about', 'projects', 'certifications', 'contact'].map(s => (
          <a key={s} href={`#${s}`} style={{
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
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('is_featured', { ascending: false });
      setProjects(!error && data?.length ? data : FALLBACK_PROJECTS);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <section id="projects" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <p className="section-label">02 — Projects</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '3rem' }}>
          Systems I've built
        </h2>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ height: '220px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {projects.map((p, i) => (
            <motion.div key={p.id} className="glass" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
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
              <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
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
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

/* ─── Certifications ──────────────────────────────────────── */
const Certifications = () => (
  <section id="certifications" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <p className="section-label">03 — Certifications</p>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '3rem' }}>
        Credential vault
      </h2>
    </motion.div>
    <CertificateVault />
  </section>
);

/* ─── Contact ─────────────────────────────────────────────── */
const Contact = () => (
  <section id="contact" style={{ padding: '6rem 2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <p className="section-label">04 — Contact</p>
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
        { label: 'Resume', href: '#' },
      ].map(link => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)',
            textDecoration: 'none', letterSpacing: '0.05em',
            transition: 'color 0.15s'
          }}
          onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
        >
          {link.label} ↗
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
  return (
    <>
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
