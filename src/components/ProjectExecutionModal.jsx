import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to generate realistic tech logs & file tree if not present
const generateFallbackDetails = (project) => {
  const title = project.title || 'Untitled System';
  const tags = project.tags || [];
  const status = project.is_featured ? 'OPERATIONAL' : 'ACTIVE';
  
  const bootLogs = [
    `LOADING SYSTEM CORE FOR: ${title.toUpperCase()}...`,
    'ESTABLISHING MATRIX SECURE PROTOCOL...',
    'PINGING CLOUD ROUTER ENDPOINTS...',
    ...tags.map(tag => `INSPECTING DEPENDENCY LAYER: ${tag.toUpperCase()}... VERIFIED`),
    'MOUNTING PERSISTENT VOLUMES...',
    `CONTAINER INITIATED SUCCESSFUL ON SYSTEM PORT...`,
    `STATUS: ${status}`
  ];

  const fileTree = [
    '📁 root/',
    '  ├─ 📁 src/',
    ...tags.slice(0, 3).map(tag => {
      const ext = tag.toLowerCase() === 'python' ? 'py' : tag.toLowerCase() === 'excel' ? 'xlsx' : 'jsx';
      const name = tag.toLowerCase().replace(/[\s-]/g, '_');
      return `  │   ├─ 📄 ${name}_handler.${ext}`;
    }),
    '  │   └─ 📄 index.css',
    '  ├─ 📄 package.json',
    '  └─ 📄 README.md'
  ];

  return { status, bootLogs, fileTree };
};

export const ProjectExecutionModal = ({ isOpen, onClose, project }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const logContainerRef = useRef(null);

  const fallback = project ? generateFallbackDetails(project) : {};
  const status = project?.status || fallback.status || 'OPERATIONAL';
  const bootLogs = project?.bootLogs || fallback.bootLogs || [];
  const fileTree = project?.fileTree || fallback.fileTree || [];
  const techStack = project?.tags || project?.techStack || [];

  // Terminal simulated log scroll effect
  useEffect(() => {
    if (!isOpen || !project) return;
    
    setVisibleLogs([]);
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setVisibleLogs(prev => [...prev, bootLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, project, bootLogs.length]);

  // Scroll to bottom of terminal when logs print
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '2rem',
          }}
        >
          {/* Main Overlay panel */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            style={{
              width: '100%',
              maxWidth: '1100px',
              height: '80vh',
              background: 'rgba(10, 10, 15, 0.95)',
              border: '1px solid rgba(0, 255, 204, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(0, 255, 204, 0.08), inset 0 0 20px rgba(0, 255, 204, 0.02)',
            }}
          >
            {/* Top HUD bar */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(0, 255, 204, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 255, 204, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: '#00ffcc',
                    letterSpacing: '0.2em',
                    fontWeight: 'bold',
                  }}
                >
                  SYSTEMS_EXECUTION_VISUALIZER // v2026.1
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  color: '#00ffcc',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 255, 204, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 204, 0.12)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 204, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                [ X TERMINATE_PROCESS ]
              </button>
            </div>

            {/* Split Screen Layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Terminal Diagnostics Panel (40% width) */}
              <div
                style={{
                  width: '40%',
                  borderRight: '1px solid rgba(0, 255, 204, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Panel Header */}
                <div
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid rgba(0, 255, 204, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Terminal Diagnostics
                  </span>
                  
                  {/* Glowing status badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'rgba(0, 255, 204, 0.05)',
                      border: '1px solid rgba(0, 255, 204, 0.2)',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#00ffcc',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#00ffcc',
                        boxShadow: '0 0 8px #00ffcc',
                      }}
                      className="animate-pulse"
                    />
                    {status}
                  </div>
                </div>

                {/* Simulated Log Output */}
                <div
                  ref={logContainerRef}
                  style={{
                    flex: 1,
                    padding: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'rgba(0, 255, 204, 0.85)',
                    overflowY: 'auto',
                    lineHeight: '1.7',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    background: '#040406',
                  }}
                >
                  {visibleLogs.map((log, index) => {
                    const isSuccess = log.includes('SUCCESS') || log.includes('OPERATIONAL') || log.includes('VERIFIED');
                    const isError = log.includes('FAIL') || log.includes('ERROR');
                    
                    let textColor = 'rgba(0, 255, 204, 0.8)';
                    if (isSuccess) textColor = '#00ffcc';
                    if (isError) textColor = '#ff6b6b';

                    return (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'rgba(0, 255, 204, 0.35)', userSelect: 'none' }}>&gt;</span>
                        <span style={{ color: textColor }}>{log}</span>
                      </div>
                    );
                  })}
                  
                  {visibleLogs.length < bootLogs.length && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(0, 255, 204, 0.35)' }}>&gt;</span>
                      <span
                        style={{
                          width: '6px',
                          height: '12px',
                          background: '#00ffcc',
                          display: 'inline-block',
                          animation: 'pulse 0.8s infinite',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Architecture Blueprint Panel (60% width) */}
              <div
                style={{
                  width: '60%',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  overflowY: 'auto',
                }}
              >
                {/* Header */}
                <div>
                  <h2
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      lineHeight: '1.25',
                      marginBottom: '0.75rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {project.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {project.description}
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {project.live_url && project.live_url !== '#' && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#00ffcc',
                          border: '1px solid rgba(0, 255, 204, 0.3)',
                          padding: '6px 16px',
                          borderRadius: '8px',
                          background: 'rgba(0, 255, 204, 0.03)',
                          transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#00ffcc';
                          e.currentTarget.style.background = 'rgba(0, 255, 204, 0.08)';
                          e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.3)';
                          e.currentTarget.style.background = 'rgba(0, 255, 204, 0.03)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        LAUNCH CORE INSTANCE ↗
                      </a>
                    )}
                    {project.doc_url && project.doc_url !== '#' && (
                      <a
                        href={project.doc_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--glass-border)',
                          padding: '6px 16px',
                          borderRadius: '8px',
                          background: 'transparent',
                          transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(124, 109, 242, 0.4)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        REPOSITORY SOURCE ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Directory tree framework */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Directory Architecture Tree
                  </h3>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'rgba(0, 255, 204, 0.78)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 255, 204, 0.15)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      overflowX: 'auto',
                      whiteSpace: 'pre',
                      lineHeight: '1.6',
                    }}
                  >
                    {fileTree.join('\n')}
                  </pre>
                </div>

                {/* Tech Stack Array */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Technical Infrastructure Nodes
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {techStack.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-secondary)',
                          cursor: 'default',
                          transition: 'all 0.20s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = '#00ffcc';
                          e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.35)';
                          e.currentTarget.style.background = 'rgba(0, 255, 204, 0.06)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
