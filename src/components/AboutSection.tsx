import { usePortfolioStore } from '../store/usePortfolioStore';
import './AboutSection.css';

export default function AboutSection() {
  const profile = usePortfolioStore((s) => s.profile);

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-label">
            <span className="section-title">About Me</span>
          </div>
          <div className="about-content">
            <h2 className="section-heading">
              {profile.aboutHeading || "Crafting digital experiences with code & data"}
            </h2>
            <p className="about-text">{profile.summary}</p>
            <div className="about-stats">
              {profile.stats?.map((stat, idx) => (
                <div key={idx} className="stat-item glass-card">
                  <span className="stat-number">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
