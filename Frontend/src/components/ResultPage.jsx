import React, { useState } from 'react';
import {
  ScanSearch, Info, RotateCcw, Sparkles, Target, Trophy,
  Zap, CheckCircle2, XCircle, Lightbulb, ArrowRight,
  BookOpen, Code, Video, Check, X, FileText, Bot
} from 'lucide-react';
import '../styles/ResultPage.css';

const ResultPage = ({ onReset, data }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);

  if (!data) return null;

  const matchScore = Number(data.matchScore) || 0;
  const matchedKeywords = data.matchedKeywords || [];
  const missingKeywords = data.missingKeywords || [];
  const improvements = data.improvements || [];
  const roadmapSteps = data.roadmapSteps || [];

  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const stepIcons = [BookOpen, Code, Video];

  const optimizations = Array.isArray(data.bulletOptimizations) && data.bulletOptimizations.length > 0
    ? data.bulletOptimizations
    : [
        {
          original: data.originalBullet || 'No original bullet found.',
          optimized: data.optimizedBullet || 'No optimization generated.',
        },
      ];

  const currentOpt = optimizations[currentBulletIndex] || optimizations[0];

  const handleNextBullet = () => {
    setCurrentBulletIndex((prev) => (prev + 1) % optimizations.length);
  };

  // Circumference of the SVG circle arc used for the score ring
  const CIRCUMFERENCE = 201;
  const strokeDash = `${(matchScore / 100) * CIRCUMFERENCE}, ${CIRCUMFERENCE}`;

  return (
    <div className="result-page-wrapper">
      <header className="global-header">
        <div className="header-content">
          <div className="logo-group">
            <div className="logo-icon-wrapper">
              <ScanSearch className="logo-icon" />
            </div>
            <span className="logo-text">GapAnalyze</span>
          </div>
          <div className="header-actions">
            <button className="btn-ghost" onClick={() => setShowHowItWorks(true)}>
              <Info className="icon-small" />
              How it Works
            </button>
            <button className="btn-outline-small" onClick={onReset}>
              <RotateCcw className="icon-small" />
              New Analysis
            </button>
          </div>
        </div>
      </header>

      <main className="result-main fade-in">
        <section className="page-header">
          <div className="header-text-area">
            <div className="status-badge">
              <Sparkles className="icon-tiny" />
              ANALYSIS COMPLETE
            </div>
            <h1 className="page-title">Your Analysis is Ready!</h1>
            <p className="page-subtitle">We've identified key opportunities to boost your match for this role.</p>
          </div>
          <button className="btn-outline" onClick={onReset}>
            <RotateCcw className="icon-small" />
            New Analysis
          </button>
        </section>

        <hr className="divider" />

        <section className="grid-2-col top-row">
          <div className="card score-card">
            <div className="card-header-small">
              <Target className="icon-muted" />
              <h3>ATS MATCH SCORE</h3>
            </div>
            <div className="score-circle-container">
              <svg viewBox="0 0 100 100" className="circular-chart">
                <path className="circle-bg" d="M18 50 a 32 32 0 1 1 64 0 a 32 32 0 1 1 -64 0" />
                <path
                  className="circle"
                  strokeDasharray={strokeDash}
                  d="M18 50 a 32 32 0 1 1 64 0 a 32 32 0 1 1 -64 0"
                />
              </svg>
              <div className="score-text">
                <span className="score-number">
                  {matchScore}<span className="percent">%</span>
                </span>
                <span className="score-label">MATCH</span>
              </div>
            </div>
            <p className="score-footer">{data.scoreFooter || ''}</p>
          </div>

          <div className="card summary-card">
            <div className="card-header-small">
              <Trophy className="icon-muted" />
              <h3>AI MATCH SUMMARY</h3>
            </div>
            <div className="summary-quote-box">
              <p className="summary-quote">"{data.summaryQuote || 'No summary available.'}"</p>
            </div>
            <div className="summary-tags">
              {data.highRelevanceTag && (
                <span className="tag-green">High Relevance: {data.highRelevanceTag}</span>
              )}
              {data.opportunityTag && (
                <span className="tag-purple">Opportunity: {data.opportunityTag}</span>
              )}
            </div>
          </div>
        </section>

        <section className="card keywords-card">
          <div className="keywords-header">
            <div className="title-group">
              <div className="icon-box-purple"><Zap className="icon-white" /></div>
              <div>
                <h2>Keyword Gaps</h2>
                <p>Comparing your resume skills against the JD requirements.</p>
              </div>
            </div>
            <div className="total-badge">{totalKeywords} Keywords Total</div>
          </div>

          <div className="keywords-grid">
            <div className="keyword-column">
              <div className="column-title text-green">
                <CheckCircle2 className="icon-small" /> MATCHED KEYWORDS
              </div>
              <div className="badge-container">
                {matchedKeywords.length > 0
                  ? matchedKeywords.map((kw, i) => <span key={i} className="badge-match">{kw}</span>)
                  : <span className="no-keywords">None found</span>}
              </div>
            </div>
            <div className="keyword-column border-left">
              <div className="column-title text-red">
                <XCircle className="icon-small" /> MISSING KEYWORDS
              </div>
              <div className="badge-container">
                {missingKeywords.length > 0
                  ? missingKeywords.map((kw, i) => <span key={i} className="badge-miss">{kw}</span>)
                  : <span className="no-keywords">None — great match!</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="grid-2-col bottom-row">
          <div className="card optimizer-card">
            <div className="card-header-small">
              <Lightbulb className="icon-muted" />
              <h3>
                BULLET POINT OPTIMIZER
                {optimizations.length > 1 && (
                  <span className="bullet-counter"> ({currentBulletIndex + 1}/{optimizations.length})</span>
                )}
              </h3>
            </div>

            <div className="optimizer-section">
              <p className="label">ORIGINAL BULLET POINT</p>
              <div className="box-original">"{currentOpt.original}"</div>
            </div>

            <div className="arrow-divider">
              <button
                className="arrow-circle"
                onClick={handleNextBullet}
                disabled={optimizations.length <= 1}
                title={optimizations.length > 1 ? `Next bullet (${currentBulletIndex + 1}/${optimizations.length})` : 'Only one optimization available'}
                aria-label="View next bullet point optimization"
              >
                <ArrowRight className="icon-purple-small" />
                {optimizations.length > 1 && <span className="next-label">next</span>}
              </button>
            </div>

            <div className="optimizer-section">
              <div className="label-row">
                <p className="label text-purple">AI-OPTIMIZED FOR THIS JD</p>
                <span className="badge-high-match">HIGH MATCH</span>
              </div>
              <div className="box-optimized">"{currentOpt.optimized}"</div>
            </div>
          </div>

          <div className="card improvements-card">
            <div className="card-header-small">
              <Zap className="icon-muted" />
              <h3>QUICK IMPROVEMENTS</h3>
            </div>
            <div className="improvements-list">
              {improvements.map((imp, index) => {
                const colors = ['green', 'purple', 'orange'];
                const icons = [Check, Target, RotateCcw];
                const IconComponent = icons[index % icons.length];
                const color = colors[index % colors.length];

                return (
                  <div key={index} className="improvement-item">
                    <div className={`icon-circle-${color}`}>
                      <IconComponent className={`icon-${color}`} />
                    </div>
                    <div className="item-text">
                      <h4>{imp.title}</h4>
                      <p>{imp.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="card roadmap-card">
          <div className="roadmap-header">
            <div>
              <h2 className="roadmap-title">Bridge the Gap</h2>
              <p className="roadmap-subtitle">
                Your 3-Step Roadmap for{' '}
                <span className="text-purple">{data.roadmapTarget || 'This Role'}</span>
              </p>
            </div>
            <button className="btn-solid-purple" onClick={() => window.print()}>
              Save Report
            </button>
          </div>
          <div className="roadmap-timeline">
            {roadmapSteps.map((step, index) => {
              const StepIcon = stepIcons[index % stepIcons.length];
              return (
                <div
                  key={index}
                  className={`timeline-item${index === roadmapSteps.length - 1 ? ' last-item' : ''}`}
                >
                  <div className="timeline-icon-wrapper">
                    <StepIcon className="icon-purple" />
                  </div>
                  <div className="timeline-content">
                    <h4 className="step-title">
                      <span className="step-label">STEP {step.step}</span> {step.title}
                    </h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bottom-cta">
          <h2>Want to refine your results?</h2>
          <p>Modify your resume and run the analysis again for better accuracy.</p>
          <button className="btn-solid-purple-large" onClick={onReset}>
            Update Inputs &amp; Re-Analyze
          </button>
        </section>

        <footer className="global-footer">
          <div className="footer-content">
            <div className="logo-group footer-logo">
              <div className="logo-icon-wrapper-small"><ScanSearch className="logo-icon-small" /></div>
              <span className="logo-text-small">GapAnalyze</span>
            </div>
            <p className="footer-copyright">© 2026 GapAnalyze. Private &amp; Secure. No data is stored on our servers.</p>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {showHowItWorks && (
        <div
          className="modal-overlay"
          onClick={() => setShowHowItWorks(false)}
          role="dialog"
          aria-modal="true"
          aria-label="How GapAnalyze Works"
        >
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="icon-box-purple-small"><Sparkles className="icon-white" /></div>
                <h3>How GapAnalyze Works</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowHowItWorks(false)}
                aria-label="Close modal"
              >
                <X className="icon-small" />
              </button>
            </div>

            <div className="modal-body">
              <div className="flow-step">
                <div className="flow-icon-circle"><FileText className="icon-purple" /></div>
                <div className="flow-text">
                  <h4>1. Data Extraction</h4>
                  <p>Raw text from your resume and the target job description is normalized, cleaning out formatting noise for pure data processing.</p>
                </div>
              </div>
              <div className="flow-line"></div>

              <div className="flow-step">
                <div className="flow-icon-circle"><Bot className="icon-purple" /></div>
                <div className="flow-text">
                  <h4>2. Semantic AI Matching</h4>
                  <p>Our LLM engine doesn't just look for exact keywords. It analyzes the context and intent of your experience against the role's requirements.</p>
                </div>
              </div>
              <div className="flow-line"></div>

              <div className="flow-step">
                <div className="flow-icon-circle"><Target className="icon-purple" /></div>
                <div className="flow-text">
                  <h4>3. Gap Scoring &amp; Optimization</h4>
                  <p>The system calculates an ATS compatibility score and generates actionable bullet point rewrites to bridge your exact missing requirements.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-solid-purple w-full" onClick={() => setShowHowItWorks(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
