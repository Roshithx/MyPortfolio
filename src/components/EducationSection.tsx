import { usePortfolioStore } from '../store/usePortfolioStore';
import './EducationSection.css';

export default function EducationSection() {
  const education = usePortfolioStore((s) => s.education);

  return (
    <section id="education" className="education-section">
      <div className="container">
        <span className="section-title">Education</span>
        <h2 className="section-heading">
          Academic <span className="gradient-text">background</span>
        </h2>

        <div className="education-grid">
          {education.map((edu, idx) => (
            <div key={edu.id} className="education-card glass-card" style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="edu-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3 className="edu-university">{edu.university}</h3>
              <p className="edu-degree">{edu.degree}</p>
              <span className="edu-dates">{edu.dates}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
