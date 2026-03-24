import { usePortfolioStore } from '../store/usePortfolioStore';
import './ExperienceSection.css';

export default function ExperienceSection() {
  const experience = usePortfolioStore((s) => s.experience);

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <span className="section-title">Work History</span>
        <h2 className="section-heading">
          Professional <span className="gradient-text">experience</span>
        </h2>

        <div className="timeline">
          {experience.map((exp, idx) => (
            <div key={exp.id} className="timeline-item" style={{ animationDelay: `${idx * 0.2}s` }}>
              <div className="timeline-line">
                <div className="timeline-dot" />
              </div>
              <div className="timeline-content glass-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company">{exp.company}</p>
                  </div>
                  <div className="timeline-meta">
                    <span className="timeline-date">{exp.startDate} — {exp.endDate}</span>
                    <span className="timeline-location">{exp.location}</span>
                  </div>
                </div>
                <ul className="timeline-description">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {exp.keyProjects.length > 0 && (
                  <div className="timeline-projects">
                    <h4 className="projects-label">Key Projects</h4>
                    <ul className="project-list">
                      {exp.keyProjects.map((proj, i) => (
                        <li key={i}>{proj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
