import { useState, useMemo, useEffect } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import './ProjectsSection.css';

const ITEMS_PER_PAGE = 4;

export default function ProjectsSection() {
  const projects = usePortfolioStore((s) => s.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.tech.some(t => t.toLowerCase().includes(q)) ||
      p.type.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <span className="section-title">Featured Work</span>
        <h2 className="section-heading">
          Selected <span className="gradient-text">projects</span>
        </h2>

        <div className="projects-controls">
          <input 
            type="text" 
            className="projects-search glass-card" 
            placeholder="Search projects by name, tech, or type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="no-projects-msg glass-card">No projects found matching your search term.</div>
        ) : (
          <>
            <div className="projects-grid">
              {paginatedProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="project-card glass-card"
                  style={{ 
                    animationDelay: `${idx * 0.15}s`,
                    backgroundImage: project.image ? `url(${project.image})` : 'none'
                  }}
                >
                  <div className="project-bg-overlay"></div>
                  <div className="project-card-header">
                    <div className="project-number">0{((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}</div>
                    <div className="project-badges">
                      <span className="project-type">{project.type}</span>
                      <span className={`project-status status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-highlights">
                    {project.highlights.map((h, i) => (
                      <p key={i} className="highlight-item">→ {h}</p>
                    ))}
                  </div>
                  <div className="project-tech">
                    {project.tech.map((t, i) => (
                      <span key={i} className="tech-tag">{t}</span>
                    ))}
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-live-link">
                      Live Demo
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  className="page-btn glass-card" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  &larr; Prev
                </button>
                <div className="page-indicators">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    />
                  ))}
                </div>
                <button 
                  className="page-btn glass-card" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
