import { useState, useRef } from 'react';
import { usePortfolioStore, type Profile, type SkillCategory, type Experience, type Project, type Education, type Contact } from '../store/usePortfolioStore';
import './AdminPage.css';

const ADMIN_PASSWORD = 'admin123';
const AUTH_KEY = 'portfolio_admin_auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');

  const store = usePortfolioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="login-icon">🔐</div>
          <h1>Admin Portal</h1>
          <p>Enter password to manage portfolio content</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'About / Profile', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'messages', label: 'Messages', icon: '📩' },
    { id: 'data', label: 'Data', icon: '💾' },
  ];

  return (
    <div className="admin-page">
      {/* Mobile Top Header */}
      <header className="admin-mobile-header">
        <a href="/" className="back-link">← Site</a>
        <span className="admin-logo">Admin Portal</span>
        <button className="logout-btn-mini" onClick={handleLogout}>Logout</button>
      </header>

      {/* Sidebar (Desktop) / Tab Bar (Mobile) */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <a href="/" className="back-link">← Back to Site</a>
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {successMsg && <div className="success-toast">{successMsg}</div>}

        {activeTab === 'profile' && <ProfileEditor profile={store.profile} onSave={(p) => { store.updateProfile(p); showSuccess('Profile updated!'); }} />}
        {activeTab === 'skills' && <SkillsEditor skills={store.skills} onSave={(s) => { store.updateSkills(s); showSuccess('Skills updated!'); }} />}
        {activeTab === 'experience' && <ExperienceEditor experience={store.experience} onAdd={store.addExperience} onDelete={store.deleteExperience} onSave={(e) => { store.updateExperience(e); showSuccess('Experience updated!'); }} />}
        {activeTab === 'projects' && <ProjectsEditor projects={store.projects} onAdd={store.addProject} onDelete={store.deleteProject} onSave={(p) => { store.updateProjects(p); showSuccess('Projects updated!'); }} />}
        {activeTab === 'education' && <EducationEditor education={store.education} onAdd={store.addEducation} onDelete={store.deleteEducation} onSave={(e) => { store.updateEducation(e); showSuccess('Education updated!'); }} />}
        {activeTab === 'contact' && <ContactEditor contact={store.contact} onSave={(c) => { store.updateContact(c); showSuccess('Contact updated!'); }} />}
        {activeTab === 'messages' && <MessagesViewer />}
        {activeTab === 'data' && (
          <DataManager
            onExport={() => {
              const data = store.exportData();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'portfolio-data.json';
              a.click();
              URL.revokeObjectURL(url);
              showSuccess('Data exported!');
            }}
            onImport={(jsonStr) => {
              try {
                store.importData(jsonStr);
                showSuccess('Data imported successfully!');
              } catch {
                alert('Invalid JSON file');
              }
            }}
            onReset={() => {
              if (confirm('Reset all data to defaults? This cannot be undone.')) {
                store.resetToDefaults();
                showSuccess('Data reset to defaults!');
              }
            }}
            fileInputRef={fileInputRef}
          />
        )}
      </main>
    </div>
  );
}

/* ===== Profile Editor ===== */
function ProfileEditor({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  const [form, setForm] = useState<Profile>({ ...profile });
  const [rawTitles, setRawTitles] = useState(profile.titles?.join(', ') || '');

  const handleChange = (field: keyof Profile, value: string | any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitlesChange = (value: string) => {
    setRawTitles(value);
    const titles = value.split(',').map(s => s.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, titles }));
  };

  const updateStat = (idx: number, field: 'label' | 'value', value: string) => {
    const updatedStats = [...(form.stats || [])];
    updatedStats[idx] = { ...updatedStats[idx], [field]: value };
    setForm(prev => ({ ...prev, stats: updatedStats }));
  };

  const addStat = () => {
    setForm(prev => ({ ...prev, stats: [...(form.stats || []), { label: 'New Stat', value: '0' }] }));
  };

  const removeStat = (idx: number) => {
    setForm(prev => ({ ...prev, stats: (form.stats || []).filter((_, i) => i !== idx) }));
  };

  return (
    <div className="editor-section">
      <h2>Edit About / Profile</h2>
      <div className="editor-form">
        <div className="form-row">
          <div className="form-field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Hero Titles (comma separated)</label>
            <input value={rawTitles} onChange={(e) => handleTitlesChange(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Hero Intro Text</label>
          <textarea rows={3} value={form.heroIntro} onChange={(e) => handleChange('heroIntro', e.target.value)} />
        </div>
        <div className="form-field">
          <label>About Section Heading</label>
          <input value={form.aboutHeading} onChange={(e) => handleChange('aboutHeading', e.target.value)} />
        </div>
        <div className="form-field">
          <label>About Summary / Bio</label>
          <textarea rows={5} value={form.summary} onChange={(e) => handleChange('summary', e.target.value)} />
        </div>

        <div className="stats-editor">
          <label className="section-label">About Stats</label>
          {form.stats.map((stat, idx) => (
            <div key={idx} className="form-row stat-row">
              <input value={stat.label} onChange={(e) => updateStat(idx, 'label', e.target.value)} placeholder="Label" />
              <input value={stat.value} onChange={(e) => updateStat(idx, 'value', e.target.value)} placeholder="Value" />
              <button className="delete-btn" onClick={() => removeStat(idx)}>✕</button>
            </div>
          ))}
          <button className="add-btn" onClick={addStat} style={{ marginTop: '8px' }}>+ Add Stat</button>
        </div>

        <div className="form-row" style={{ marginTop: '20px' }}>
          <div className="form-field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>GitHub URL</label>
            <input value={form.github} onChange={(e) => handleChange('github', e.target.value)} />
          </div>
          <div className="form-field">
            <label>LinkedIn URL</label>
            <input value={form.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
        </div>
        <button className="save-btn" onClick={() => onSave(form)}>Save Profile</button>
      </div>
    </div>
  );
}

/* ===== Skills Editor ===== */
function SkillsEditor({ skills, onSave }: { skills: SkillCategory[]; onSave: (s: SkillCategory[]) => void }) {
  const [form, setForm] = useState<SkillCategory[]>(skills.map(s => ({ ...s, items: [...s.items] })));
  
  // Track raw strings locally to preserve trailing commas while typing
  const [rawItems, setRawItems] = useState<{ [key: number]: string }>(
    skills.reduce((acc, cat, idx) => ({ ...acc, [idx]: cat.items.join(', ') }), {})
  );

  const updateCategory = (idx: number, value: string) => {
    const updated = [...form];
    updated[idx] = { ...updated[idx], category: value };
    setForm(updated);
  };

  const updateItems = (idx: number, value: string) => {
    setRawItems(prev => ({ ...prev, [idx]: value }));
    const updated = [...form];
    updated[idx] = { ...updated[idx], items: value.split(',').map(s => s.trim()).filter(Boolean) };
    setForm(updated);
  };

  const addCategory = () => {
    setForm([...form, { category: 'New Category', items: [] }]);
  };

  const removeCategory = (idx: number) => {
    setForm(form.filter((_, i) => i !== idx));
  };

  return (
    <div className="editor-section">
      <h2>Edit Skills</h2>
      <div className="editor-form">
        {form.map((cat, idx) => (
          <div key={idx} className="list-item-card">
            <div className="form-row">
              <div className="form-field" style={{ flex: 1 }}>
                <label>Category</label>
                <input value={cat.category} onChange={(e) => updateCategory(idx, e.target.value)} />
              </div>
              <button className="delete-btn" onClick={() => removeCategory(idx)}>✕</button>
            </div>
            <div className="form-field">
              <label>Items (comma separated)</label>
              <input value={rawItems[idx] ?? cat.items.join(', ')} onChange={(e) => updateItems(idx, e.target.value)} />
            </div>
          </div>
        ))}
        <div className="editor-actions">
          <button className="add-btn" onClick={addCategory}>+ Add Category</button>
          <button className="save-btn" onClick={() => onSave(form)}>Save Skills</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Experience Editor ===== */
function ExperienceEditor({ experience, onSave, onAdd, onDelete }: {
  experience: Experience[];
  onSave: (e: Experience[]) => void;
  onAdd: (e: Experience) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Experience[]>(experience.map(e => ({
    ...e, description: [...e.description], keyProjects: [...e.keyProjects]
  })));

  const updateField = (idx: number, field: keyof Experience, value: string | string[]) => {
    const updated = [...form];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm(updated);
  };

  const addNew = () => {
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: [],
      keyProjects: [],
    };
    setForm([...form, newExp]);
    onAdd(newExp);
  };

  const remove = (id: string) => {
    if (confirm('Delete this experience?')) {
      setForm(form.filter(e => e.id !== id));
      onDelete(id);
    }
  };

  return (
    <div className="editor-section">
      <h2>Edit Experience</h2>
      <div className="editor-form">
        {form.map((exp, idx) => (
          <div key={exp.id} className="list-item-card">
            <div className="card-header">
              <h3>{exp.company || 'New Experience'}</h3>
              <button className="delete-btn" onClick={() => remove(exp.id)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Company</label><input value={exp.company} onChange={(e) => updateField(idx, 'company', e.target.value)} /></div>
              <div className="form-field"><label>Role</label><input value={exp.role} onChange={(e) => updateField(idx, 'role', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Location</label><input value={exp.location} onChange={(e) => updateField(idx, 'location', e.target.value)} /></div>
              <div className="form-field"><label>Start Date</label><input value={exp.startDate} onChange={(e) => updateField(idx, 'startDate', e.target.value)} /></div>
              <div className="form-field"><label>End Date</label><input value={exp.endDate} onChange={(e) => updateField(idx, 'endDate', e.target.value)} /></div>
            </div>
            <div className="form-field">
              <label>Description (one per line)</label>
              <textarea rows={4} value={exp.description.join('\n')} onChange={(e) => updateField(idx, 'description', e.target.value.split('\n').filter(Boolean))} />
            </div>
            <div className="form-field">
              <label>Key Projects (one per line)</label>
              <textarea rows={3} value={exp.keyProjects.join('\n')} onChange={(e) => updateField(idx, 'keyProjects', e.target.value.split('\n').filter(Boolean))} />
            </div>
          </div>
        ))}
        <div className="editor-actions">
          <button className="add-btn" onClick={addNew}>+ Add Experience</button>
          <button className="save-btn" onClick={() => onSave(form)}>Save Experience</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Projects Editor ===== */
function ProjectsEditor({ projects, onSave, onAdd, onDelete }: {
  projects: Project[];
  onSave: (p: Project[]) => void;
  onAdd: (p: Project) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Project[]>(projects.map(p => ({
    ...p, tech: [...p.tech], highlights: [...p.highlights]
  })));
  
  // Track raw strings to preserve trailing commas/newlines while typing
  const [rawText, setRawText] = useState<{ [key: string]: { tech: string, highlights: string } }>(
    projects.reduce((acc, p) => ({ 
      ...acc, 
      [p.id]: { tech: p.tech.join(', '), highlights: p.highlights.join('\n') } 
    }), {})
  );

  const updateField = (idx: number, field: keyof Project, value: string) => {
    const updated = [...form];
    if (field === 'highlights') {
      const id = updated[idx].id;
      setRawText(prev => ({ ...prev, [id]: { ...prev[id], highlights: value } }));
      updated[idx] = { ...updated[idx], highlights: value.split('\n').filter(s => s.trim()) };
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }
    setForm(updated);
  };

  const updateTech = (idx: number, value: string) => {
    const updated = [...form];
    const id = updated[idx].id;
    setRawText(prev => ({ ...prev, [id]: { ...prev[id], tech: value } }));
    updated[idx] = { ...updated[idx], tech: value.split(',').map(s => s.trim()).filter(Boolean) };
    setForm(updated);
  };

  const addNew = () => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: '',
      type: 'Personal',
      status: 'Ongoing',
      description: '',
      tech: [],
      highlights: [],
    };
    setForm([...form, newProj]);
    setRawText(prev => ({ ...prev, [newProj.id]: { tech: '', highlights: '' } }));
    onAdd(newProj);
  };

  const remove = (id: string) => {
    if (confirm('Delete this project?')) {
      setForm(form.filter(p => p.id !== id));
      onDelete(id);
    }
  };

  return (
    <div className="editor-section">
      <h2>Edit Projects</h2>
      <div className="editor-form">
        {form.map((proj, idx) => (
          <div key={proj.id} className="list-item-card">
            <div className="card-header">
              <h3>{proj.name || 'New Project'}</h3>
              <button className="delete-btn" onClick={() => remove(proj.id)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Name</label><input value={proj.name} onChange={(e) => updateField(idx, 'name', e.target.value)} /></div>
              <div className="form-field"><label>Type</label><input value={proj.type} onChange={(e) => updateField(idx, 'type', e.target.value)} /></div>
              <div className="form-field"><label>Status</label>
                <select value={proj.status} onChange={(e) => updateField(idx, 'status', e.target.value)} style={{ padding: '10px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea rows={3} value={proj.description} onChange={(e) => updateField(idx, 'description', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-field"><label>Cover Image URL</label><input value={proj.image || ''} onChange={(e) => updateField(idx, 'image', e.target.value)} placeholder="https://example.com/image.jpg" /></div>
              <div className="form-field"><label>Live Demo URL</label><input value={proj.liveUrl || ''} onChange={(e) => updateField(idx, 'liveUrl', e.target.value)} placeholder="https://your-project.com" /></div>
            </div>
            <div className="form-field">
              <label>Tech Stack (comma separated)</label>
              <input value={rawText[proj.id]?.tech ?? proj.tech.join(', ')} onChange={(e) => updateTech(idx, e.target.value)} />
            </div>
            <div className="form-field">
              <label>Highlights (one per line)</label>
              <textarea rows={3} value={rawText[proj.id]?.highlights ?? proj.highlights.join('\n')} onChange={(e) => updateField(idx, 'highlights', e.target.value)} />
            </div>
          </div>
        ))}
        <div className="editor-actions">
          <button className="add-btn" onClick={addNew}>+ Add Project</button>
          <button className="save-btn" onClick={() => onSave(form)}>Save Projects</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Messages Viewer ===== */
import { getContactMessages, saveContactMessages, type ContactMessage } from '../components/ContactSection';

function MessagesViewer() {
  const [messages, setMessages] = useState<ContactMessage[]>(getContactMessages());

  const deleteMessage = (id: string) => {
    if (confirm('Delete this message?')) {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      saveContactMessages(updated);
    }
  };

  const markAsRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setMessages(updated);
    saveContactMessages(updated);
  };

  if (messages.length === 0) {
    return (
      <div className="editor-section">
        <h2>Messages</h2>
        <div className="no-messages">No messages received yet.</div>
      </div>
    );
  }

  return (
    <div className="editor-section">
      <h2>Messages</h2>
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-card ${!msg.read ? 'unread' : ''}`} onClick={() => markAsRead(msg.id)}>
            <div className="message-header">
              <div className="sender-info">
                <strong>{msg.name}</strong>
                <span>{msg.email}</span>
              </div>
              <div className="message-meta">
                <span className="message-date">{new Date(msg.date).toLocaleString()}</span>
                <button className="msg-delete-btn" onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}>✕</button>
              </div>
            </div>
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Education Editor ===== */
function EducationEditor({ education, onSave, onAdd, onDelete }: {
  education: Education[];
  onSave: (e: Education[]) => void;
  onAdd: (e: Education) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Education[]>(education.map(e => ({ ...e })));

  const updateField = (idx: number, field: keyof Education, value: string) => {
    const updated = [...form];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm(updated);
  };

  const addNew = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      university: '',
      degree: '',
      dates: '',
    };
    setForm([...form, newEdu]);
    onAdd(newEdu);
  };

  const remove = (id: string) => {
    if (confirm('Delete this education?')) {
      setForm(form.filter(e => e.id !== id));
      onDelete(id);
    }
  };

  return (
    <div className="editor-section">
      <h2>Edit Education</h2>
      <div className="editor-form">
        {form.map((edu, idx) => (
          <div key={edu.id} className="list-item-card">
            <div className="card-header">
              <h3>{edu.university || 'New Education'}</h3>
              <button className="delete-btn" onClick={() => remove(edu.id)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-field"><label>University</label><input value={edu.university} onChange={(e) => updateField(idx, 'university', e.target.value)} /></div>
              <div className="form-field"><label>Degree</label><input value={edu.degree} onChange={(e) => updateField(idx, 'degree', e.target.value)} /></div>
              <div className="form-field"><label>Dates</label><input value={edu.dates} onChange={(e) => updateField(idx, 'dates', e.target.value)} /></div>
            </div>
          </div>
        ))}
        <div className="editor-actions">
          <button className="add-btn" onClick={addNew}>+ Add Education</button>
          <button className="save-btn" onClick={() => onSave(form)}>Save Education</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Contact Editor ===== */
function ContactEditor({ contact, onSave }: { contact: Contact; onSave: (c: Contact) => void }) {
  const [form, setForm] = useState<Contact>({ ...contact });

  const handleChange = (field: keyof Contact, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="editor-section">
      <h2>Edit Contact</h2>
      <div className="editor-form">
        <div className="form-row">
          <div className="form-field"><label>Phone</label><input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} /></div>
          <div className="form-field"><label>Email</label><input value={form.email} onChange={(e) => handleChange('email', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label>GitHub</label><input value={form.github} onChange={(e) => handleChange('github', e.target.value)} /></div>
          <div className="form-field"><label>LinkedIn</label><input value={form.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} /></div>
        </div>
        <div className="form-field"><label>Location</label><input value={form.location} onChange={(e) => handleChange('location', e.target.value)} /></div>
        <button className="save-btn" onClick={() => onSave(form)}>Save Contact</button>
      </div>
    </div>
  );
}

/* ===== Data Manager ===== */
function DataManager({ onExport, onImport, onReset, fileInputRef }: {
  onExport: () => void;
  onImport: (json: string) => void;
  onReset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImport(ev.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="editor-section">
      <h2>Data Management</h2>
      <div className="editor-form">
        <div className="data-actions">
          <div className="data-card">
            <h3>📥 Export Data</h3>
            <p>Download all portfolio data as a JSON file for backup.</p>
            <button className="save-btn" onClick={onExport}>Export JSON</button>
          </div>
          <div className="data-card">
            <h3>📤 Import Data</h3>
            <p>Upload a JSON file to replace all portfolio data.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button className="save-btn" onClick={() => fileInputRef.current?.click()}>Import JSON</button>
          </div>
          <div className="data-card danger">
            <h3>⚠️ Reset to Defaults</h3>
            <p>Clear all customizations and restore original data from the JSON file.</p>
            <button className="delete-btn-large" onClick={onReset}>Reset All Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
