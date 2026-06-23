import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are missing, empty, or placeholder values
export const isMockSupabase = !SUPABASE_URL || !SUPABASE_ANON_KEY || 
                              SUPABASE_URL.includes('placeholder') || 
                              SUPABASE_ANON_KEY.includes('placeholder');

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'Bud AI: Multi-Agent Personal Assistant',
    description: 'Developed an agentic personal assistant using Python and React with a custom "glassmorphism" aesthetic. Features a specialized Teacher Persona system that utilizes context-aware retrieval to provide high-accuracy academic support and interactive student engagement.',
    tags: ['Python', 'React', 'Gemini API', 'Generative AI', 'NLP'],
    live_url: 'https://bud-ai-rho.vercel.app/',
    doc_url: 'https://github.com/jouzia/Portfolio',
    is_featured: true,
  },
  {
    id: 2,
    title: 'Secure MCP Server & AI Chatbot',
    description: 'Engineered a standalone chatbot backend utilizing the Model Context Protocol (MCP). Implemented a standardized MCP server using JSON-RPC/stdio transport layers, allowing the LLM to securely execute local functions, fetch real-time data, and interact with local academic files.',
    tags: ['MCP', 'Python', 'JSON-RPC', 'Node.js', 'API Integration'],
    live_url: 'https://buddy-lab-demo.vercel.app/',
    doc_url: 'https://github.com/jouzia/buddy-lab-demo',
    is_featured: true,
  },
  {
    id: 3,
    title: 'Chat-AI: Intelligent Conversational Interface',
    description: 'Designed and deployed a responsive, context-aware AI chat application powered by Streamlit. Features low-latency message streaming, an intuitive user interface, and seamless large language model integration to process complex user prompts and deliver real-time interactive responses.',
    tags: ['Streamlit', 'Python', 'Generative AI', 'LLM API', 'UI/UX Design'],
    live_url: 'https://chat-ai-arpbmd4cpu6htqrqbujnyy.streamlit.app/',
    doc_url: 'https://github.com/jouzia/Chat-AI',
    is_featured: true,
  },
  {
    id: 4,
    title: 'Gaming Behavior Trends Dashboard',
    description: 'Built a dynamic analytical dashboard in Microsoft Excel to automate the tracking of player engagement metrics. Leveraged advanced pivot tables, power query, and conditional formatting to transform raw datasets into actionable insights, streamlining weekly reporting workflows.',
    tags: ['Data Analytics', 'Excel', 'Data Visualization', 'Pivot Tables'],
    live_url: 'https://docs.google.com/spreadsheets/d/18ycFkbclsBu_jk5userfZX-9eMP8HT8n/edit?usp=sharing',
    doc_url: 'https://docs.google.com/spreadsheets/d/18ycFkbclsBu_jk5userfZX-9eMP8HT8n/edit?usp=sharing',
    is_featured: false,
  },
  {
    id: 5,
    title: 'Full-Stack Personal Portfolio',
    description: 'Designed and deployed a mobile-first, responsive portfolio using Next.js and JavaScript. Focused on high-performance rendering and a modern UI to showcase live sub-projects and integrated AI assistants.',
    tags: ['Next.js', 'JavaScript', 'Tailwind CSS', 'Vercel'],
    live_url: 'https://jouziaportfolio.vercel.app/',
    doc_url: 'https://github.com/jouzia/Portfolio',
    is_featured: false,
  },
];

const INITIAL_CERTS = [
  { 
    id: 'p1', 
    title: 'Software Engineering Job Simulation', 
    issuer: 'JPMorgan Chase & Co.', 
    date: '2026-04', 
    pdf_url: 'https://drive.google.com/file/d/12cLWOpNpl1x4UyqEyKJalXaaq9oTXDOh/view?usp=drive_link' 
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
    pdf_url: 'https://drive.google.com/file/d/1wmO19fBSfKB7NZ5hxsYe-4fxHWowp0sB/view?usp=drive_link' 
  },
  { 
    id: 'p4', 
    title: 'Machine Learning Specialization', 
    issuer: 'DeepLearning.AI', 
    date: '2024-08', 
    pdf_url: 'https://drive.google.com/file/d/1cFLhjQNdAcB0OtP8LsNzLjwwH78i0heJ/view?usp=sharing' 
  },
  { 
    id: 'p5', 
    title: 'Generative AI with LLMs', 
    issuer: 'AWS', 
    date: '2024-06', 
    pdf_url: 'https://drive.google.com/file/d/1SE0SUcRWJlF3rNo62zbdBSMNNhp7s1AT/view?usp=drive_link' 
  },
  { 
    id: 'p6', 
    title: 'Prompt Engineering for Developers', 
    issuer: 'DeepLearning.AI', 
    date: '2024-07', 
    pdf_url: 'https://drive.google.com/file/d/12710ftL_9DYO_5p2vHtQ_ZMYgDXqVz5U/view?usp=drive_link' 
  },
  { 
    id: 'p7', 
    title: 'Neural Networks and Deep Learning', 
    issuer: 'DeepLearning.AI', 
    date: '2024-09', 
    pdf_url: 'https://drive.google.com/file/d/12S0PW21md3c6jvuPrRGwIulPxBSMP3jh/view?usp=drive_link' 
  },
  { 
    id: 'p8', 
    title: 'Google Data Analytics', 
    issuer: 'Google', 
    date: '2024-03', 
    pdf_url: 'https://drive.google.com/file/d/1i3EQPKPM9Cdq1bU1IJo_asDLZ9wNZYFq/view?usp=drive_link' 
  },
  { 
    id: 'p9', 
    title: 'AI Fundamentals & Data Science', 
    issuer: 'IBM', 
    date: '2025-12', 
    pdf_url: 'https://drive.google.com/file/d/12p7KjLyhLFVpBemdKFuX6pAkgdcV0Duh/view?usp=drive_link' 
  },
  { 
    id: 'p10', 
    title: 'Python for Data Science', 
    issuer: 'IBM', 
    date: '2023-11', 
    pdf_url: 'https://drive.google.com/file/d/1i6OKC8ZDbrLFFtlz7kk5W9vAc-TNJSMz/view?usp=drive_link' 
  },
  { 
    id: 'p11', 
    title: 'HR Analytics Specialization', 
    issuer: 'UCI', 
    date: '2025-06', 
    pdf_url: 'https://drive.google.com/file/d/1iNbePy2LbHlokkI6lSvZNtM9H8yffC23/view?usp=drive_link' 
  },
  { 
    id: 'p12', 
    title: 'Graphic Design Specialization', 
    issuer: 'Adobe', 
    date: '2024-09', 
    pdf_url: 'https://drive.google.com/file/d/1iT-oLoKQOgL1hfMiDS1EXEXaygydrgM1/view?usp=drive_link' 
  }
];

const createMockSupabase = () => {
  console.warn(
    '[Supabase Mock] Running in local mock mode. Data is persisted in localStorage.'
  );

  if (!localStorage.getItem('sb_projects')) {
    localStorage.setItem('sb_projects', JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem('sb_certificates')) {
    localStorage.setItem('sb_certificates', JSON.stringify(INITIAL_CERTS));
  }
  if (!localStorage.getItem('sb_storage')) {
    localStorage.setItem('sb_storage', JSON.stringify({}));
  }

  const authChangeListeners = new Set();

  return {
    auth: {
      async getSession() {
        const sessionStr = localStorage.getItem('sb_session');
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange(callback) {
        authChangeListeners.add(callback);
        const sessionStr = localStorage.getItem('sb_session');
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        setTimeout(() => callback('INITIAL_SESSION', session), 0);
        return {
          data: {
            subscription: {
              unsubscribe() {
                authChangeListeners.delete(callback);
              }
            }
          }
        };
      },
      async signInWithPassword({ email, password }) {
        if (!email || !password) {
          return { data: { session: null }, error: new Error('Email and password are required.') };
        }
        if (email === 'admin@portfolio.dev' && password === 'admin123') {
          const session = {
            access_token: 'mock-jwt-access-token-1234',
            user: {
              id: 'mock-uuid-admin-user',
              email,
              role: 'authenticated'
            }
          };
          localStorage.setItem('sb_session', JSON.stringify(session));
          authChangeListeners.forEach(cb => cb('SIGNED_IN', session));
          return { data: { session }, error: null };
        } else {
          return { data: { session: null }, error: new Error('Invalid login credentials. Use admin@portfolio.dev / admin123.') };
        }
      },
      async signOut() {
        localStorage.removeItem('sb_session');
        authChangeListeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      }
    },
    from(table) {
      return {
        select(fields = '*') {
          const getData = () => {
            const dataStr = localStorage.getItem(`sb_${table}`) || '[]';
            return JSON.parse(dataStr);
          };

          const runQuery = (items) => {
            return { data: items, error: null };
          };

          const queryBuilder = {
            order(column, { ascending = true } = {}) {
              const runOrderedQuery = () => {
                const items = getData();
                items.sort((a, b) => {
                  const valA = a[column];
                  const valB = b[column];
                  if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                    return ascending ? (valA === valB ? 0 : valA ? 1 : -1) : (valA === valB ? 0 : valA ? -1 : 1);
                  }
                  if (valA < valB) return ascending ? -1 : 1;
                  if (valA > valB) return ascending ? 1 : -1;
                  return 0;
                });
                return { data: items, error: null };
              };

              return {
                then(resolve) {
                  resolve(runOrderedQuery());
                }
              };
            },
            then(resolve) {
              resolve(runQuery(getData()));
            }
          };

          return queryBuilder;
        },
        insert(rows) {
          const runInsert = () => {
            const dataStr = localStorage.getItem(`sb_${table}`) || '[]';
            const currentItems = JSON.parse(dataStr);
            const insertedRows = rows.map(row => ({
              id: Date.now() + Math.floor(Math.random() * 1000),
              created_at: new Date().toISOString(),
              ...row
            }));
            localStorage.setItem(`sb_${table}`, JSON.stringify([...insertedRows, ...currentItems]));
            return { data: insertedRows, error: null };
          };

          return {
            then(resolve) {
              resolve(runInsert());
            }
          };
        },
        delete() {
          return {
            eq(column, value) {
              const runDelete = () => {
                const dataStr = localStorage.getItem(`sb_${table}`) || '[]';
                const currentItems = JSON.parse(dataStr);
                const filtered = currentItems.filter(item => String(item[column]) !== String(value));
                localStorage.setItem(`sb_${table}`, JSON.stringify(filtered));
                return { error: null };
              };

              return {
                then(resolve) {
                  resolve(runDelete());
                }
              };
            }
          };
        }
      };
    },
    storage: {
      from(bucket) {
        return {
          async upload(fileName, file, options) {
            try {
              const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to parse uploaded PDF file.'));
                reader.readAsDataURL(file);
              });

              const storageObj = JSON.parse(localStorage.getItem('sb_storage') || '{}');
              storageObj[`${bucket}/${fileName}`] = dataUrl;
              localStorage.setItem('sb_storage', JSON.stringify(storageObj));

              return { data: { path: fileName }, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },
          getPublicUrl(fileName) {
            const storageObj = JSON.parse(localStorage.getItem('sb_storage') || '{}');
            const publicUrl = storageObj[`${bucket}/${fileName}`] || '#';
            return { data: { publicUrl } };
          }
        };
      }
    }
  };
};

export const supabase = isMockSupabase 
  ? createMockSupabase() 
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
