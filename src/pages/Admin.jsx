import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/* ─── Toast helper ────────────────────────────────────────── */
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`toast toast-${type}`}>
      <span style={{ fontSize: '14px' }}>{type === 'success' ? '✓' : '✗'}</span>
      {msg}
    </div>
  );
};

/* ─── Spinner ─────────────────────────────────────────────── */
const Spinner = () => <span className="spinner" />;

/* ─── Login Screen ────────────────────────────────────────── */
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    else onLogin();
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-0)'
    }}>
      <div className="glass" style={{ width: '380px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'rgba(124,109,242,0.12)', border: '1px solid rgba(124,109,242,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)'
        }}>⌘</div>

        <h1 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.4rem' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
          jouzia.dev / restricted
        </p>

        {error && (
          <div style={{
            background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.25)',
            borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem',
            fontSize: '0.8rem', color: '#fc8181'
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label" style={{ textAlign: 'left' }}>Email</label>
            <input className="form-input" type="email" placeholder="jouzia@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: 'left' }}>Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>

        <button className="btn-accent" onClick={handleLogin} disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <><Spinner /> Signing in…</> : 'Sign in'}
        </button>
      </div>
    </div>
  );
};

/* ─── Certificate Upload Form ─────────────────────────────── */
const CertUploadForm = ({ onToast }) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !issuer || !file) {
      onToast('Fill in all fields and select a PDF.', 'error');
      return;
    }
    setLoading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}_${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('certificates')
        .upload(fileName, file, { contentType: 'application/pdf', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(fileName);

      const { error: dbErr } = await supabase.from('certificates').insert([{
        title, issuer, date: date || null, pdf_url: publicUrl
      }]);

      if (dbErr) throw dbErr;

      onToast('Certificate uploaded successfully!', 'success');
      setTitle(''); setIssuer(''); setDate(''); setFile(null);
      document.getElementById('cert-file-input').value = '';
    } catch (err) {
      onToast(err.message || 'Upload failed.', 'error');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Upload Certificate</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label className="form-label">Certificate Title</label>
          <input className="form-input" placeholder="Machine Learning Specialization"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Issuer</label>
          <input className="form-input" placeholder="DeepLearning.AI · Coursera"
            value={issuer} onChange={e => setIssuer(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label className="form-label">Date Issued</label>
          <input className="form-input" type="month"
            value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">PDF File</label>
          <input id="cert-file-input" type="file" accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
              borderRadius: '10px', padding: '0.55rem 1rem',
              color: 'var(--text-secondary)', fontSize: '0.8rem', width: '100%', cursor: 'pointer'
            }} />
        </div>
      </div>

      {file && (
        <div style={{
          background: 'rgba(79,209,197,0.06)', border: '1px solid rgba(79,209,197,0.2)',
          borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem',
          fontSize: '0.78rem', color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)'
        }}>
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}

      <button className="btn-accent" onClick={handleUpload} disabled={loading}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {loading ? <><Spinner /> Uploading…</> : 'Upload Certificate'}
      </button>
    </div>
  );
};

/* ─── Project Manager ─────────────────────────────────────── */
const ProjectManager = ({ onToast }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: '', live_url: '', doc_url: '', is_featured: false });

  const loadProjects = useCallback(async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleAdd = async () => {
    if (!form.title || !form.description) {
      onToast('Title and description are required.', 'error');
      return;
    }
    setSaving(true);
    const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('projects').insert([{ ...form, tags: tagsArr }]);
    if (error) onToast(error.message, 'error');
    else {
      onToast('Project added!', 'success');
      setForm({ title: '', description: '', tags: '', live_url: '', doc_url: '', is_featured: false });
      loadProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) onToast(error.message, 'error');
    else {
      onToast('Project deleted.', 'success');
      loadProjects();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Manage Projects</h2>

      {/* Add form */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Add new project</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="RAG Pipeline"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input" placeholder="LangChain, FAISS, Python"
              value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label className="form-label">Description</label>
          <textarea className="form-input" placeholder="Describe the system architecture, key technical decisions, and impact…"
            rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Live URL</label>
            <input className="form-input" placeholder="https://..."
              value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Docs URL</label>
            <input className="form-input" placeholder="https://..."
              value={form.doc_url} onChange={e => setForm(f => ({ ...f, doc_url: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <input type="checkbox" id="featured" checked={form.is_featured}
            onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
            style={{ accentColor: 'var(--accent-primary)', width: '14px', height: '14px' }} />
          <label htmlFor="featured" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Mark as featured
          </label>
        </div>
        <button className="btn-accent" onClick={handleAdd} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <><Spinner /> Saving…</> : 'Add Project'}
        </button>
      </div>

      {/* Projects list */}
      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Existing projects ({projects.length})
      </h3>
      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</div>
      ) : projects.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
          // No projects in database yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map(p => (
            <div key={p.id} className="glass" style={{
              padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{p.title}</span>
                  {p.is_featured && (
                    <span style={{
                      fontSize: '0.6rem', padding: '2px 6px', borderRadius: '999px',
                      background: 'rgba(124,109,242,0.15)', color: 'var(--accent-primary)',
                      border: '1px solid rgba(124,109,242,0.25)', fontFamily: 'var(--font-mono)'
                    }}>FEATURED</span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {p.description?.slice(0, 120)}{p.description?.length > 120 ? '…' : ''}
                </p>
                {p.tags && p.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </div>
              <button onClick={() => handleDelete(p.id)}
                style={{
                  background: 'rgba(245,101,101,0.08)', border: '1px solid rgba(245,101,101,0.2)',
                  color: '#fc8181', borderRadius: '8px', padding: '6px 12px',
                  fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  fontFamily: 'var(--font-mono)'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(245,101,101,0.18)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(245,101,101,0.08)'}
              >
                delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Admin App ───────────────────────────────────────────── */
export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('certificates');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg, type) => setToast({ msg, type });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-0)' }}>
      <Spinner />
    </div>
  );

  if (!session) return <LoginScreen onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />;

  const tabs = [
    { id: 'certificates', label: 'Certificates', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '◎' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-0)' }}>
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: '500', marginBottom: '0.2rem' }}>
            jouzia.dev
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>admin console</p>
        </div>

        {tabs.map(tab => (
          <button key={tab.id}
            className={`admin-nav-item${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div style={{
            padding: '0.75rem', background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)', borderRadius: '10px',
            marginBottom: '0.75rem'
          }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Signed in as</p>
            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              {session.user.email}
            </p>
          </div>
          <button className="admin-nav-item" onClick={handleLogout} style={{ color: '#fc8181' }}>
            <span style={{ fontSize: '0.9rem' }}>↩</span>
            Sign Out
          </button>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button className="admin-nav-item" style={{ marginTop: '4px', width: '100%' }}>
              <span style={{ fontSize: '0.9rem' }}>◁</span>
              Back to Portfolio
            </button>
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.3rem' }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {activeTab === 'certificates' ? 'Upload PDFs and manage your credential vault.' : 'Add and remove projects from your portfolio.'}
            </p>
          </div>

          <div className="fade-in" key={activeTab}>
            {activeTab === 'certificates' && <CertUploadForm onToast={showToast} />}
            {activeTab === 'projects' && <ProjectManager onToast={showToast} />}
          </div>
        </div>
      </main>

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
