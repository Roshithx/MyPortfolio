import { usePortfolioStore } from '../store/usePortfolioStore';
import './SkillsSection.css';

export default function SkillsSection() {
  const skills = usePortfolioStore((s) => s.skills);

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <span className="section-title">Skills & Expertise</span>
        <h2 className="section-heading">
          My <span className="gradient-text">tech stack</span>
        </h2>

        <div className="skills-grid">
          {skills.map((category, idx) => (
            <div key={idx} className="skill-card glass-card">
              <div className="skill-card-header">
                <div className="skill-icon-dot" style={{
                  background: `hsl(${idx * 50 + 180}, 80%, 60%)`
                }} />
                <h3 className="skill-category">{category.category}</h3>
              </div>
              <div className="skill-items">
                {category.items.map((item, i) => (
                  <span key={i} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
