import React, { useState, useRef } from 'react';
import {
  ScanSearch, Zap, ShieldCheck, CheckCircle2,
  Briefcase, FileText, Sparkles, ArrowRight, Loader2, Grip, Upload, X
} from 'lucide-react';
import '../styles/LandingPage.css';
import ResultPage from './ResultPage';

// Dynamic API URL: defaults to localhost for development, uses Vercel env variable in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LandingPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const canAnalyze = jobDescription.trim() && (resume.trim() || selectedFileObj);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);

    if (selectedFileObj) {
      formData.append('resumeFile', selectedFileObj);
    } else {
      formData.append('resumeText', resume);
    }

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze. Make sure the backend server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setJobDescription('');
    setResume('');
    setResumeFile(null);
    setSelectedFileObj(null);
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowed.includes(file.type)) {
      setError('Only PDF, DOC, and DOCX files are supported.');
      return;
    }

    setError('');
    setResumeFile(file.name);
    setSelectedFileObj(file);
    setResume('');
  };

  const handleClearFile = () => {
    setResumeFile(null);
    setSelectedFileObj(null);
    setResume('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResumeTextChange = (e) => {
    setResume(e.target.value);
    if (selectedFileObj) {
      setResumeFile(null);
      setSelectedFileObj(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canAnalyze && !isAnalyzing) {
      handleAnalyze();
    }
  };

  if (analysisData) {
    return <ResultPage onReset={handleReset} data={analysisData} />;
  }

  return (
    <div className="landing-page-wrapper">
      <header className="global-header">
        <div className="header-content">
          <div className="logo-group">
            <div className="logo-icon-wrapper">
              <ScanSearch className="logo-icon" />
            </div>
            <span className="logo-text">GapAnalyze</span>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary-small"
              onClick={() => document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Analyze Now
            </button>
          </div>
        </div>
      </header>

      <main className="view-section fade-in">
        <section className="hero-section">
          <h1 className="hero-title">
            The 'Job Description' Reality Check.
          </h1>
          <p className="hero-subtitle">
            Instantly see how well your resume matches any job description. No account needed, just raw data and AI precision.
          </p>
          <div className="feature-pills">
            <div className="pill"><Zap className="pill-icon" /><span>Instant AI Analysis</span></div>
            <div className="pill"><ShieldCheck className="pill-icon" /><span>No Sign-up Required</span></div>
            <div className="pill"><CheckCircle2 className="pill-icon" /><span>ATS Optimization</span></div>
          </div>
        </section>

        <section className="input-section" onKeyDown={handleKeyDown}>
          <div className="section-icon-decorator">
            <Grip className="grip-icon" />
          </div>

          <div className="input-grid">
            <div className="input-card">
              <div className="card-header">
                <div className="header-left">
                  <div className="icon-box"><Briefcase className="icon primary-icon" /></div>
                  <h2><span className="step-num">1.</span>Paste Job Description</h2>
                </div>
                <span className="badge-required">Required</span>
              </div>
              <textarea
                className="sleek-textarea"
                placeholder="Paste the complete text from the job posting, including responsibilities and requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                aria-label="Job description"
              />
            </div>

            <div className="input-card">
              <div className="card-header">
                <div className="header-left">
                  <div className="icon-box"><FileText className="icon primary-icon" /></div>
                  <h2><span className="step-num">2.</span>Provide Your Resume</h2>
                </div>
                <span className="badge-required">Required</span>
              </div>

              <div className="upload-row">
                <label className="upload-label">
                  <Upload size={15} />
                  Upload PDF / DOC
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    aria-label="Upload resume file"
                  />
                </label>
                {resumeFile && (
                  <span className="file-attached">
                    <CheckCircle2 size={13} />
                    {resumeFile}
                    <button
                      className="btn-clear-file"
                      onClick={handleClearFile}
                      title="Remove file"
                      aria-label="Remove uploaded file"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              <div className="or-divider">OR PASTE TEXT</div>

              <textarea
                className={`sleek-textarea${selectedFileObj ? ' textarea-dimmed' : ''}`}
                placeholder="Paste your current resume content, LinkedIn profile text, or project bullet points..."
                value={selectedFileObj ? '' : resume}
                onChange={handleResumeTextChange}
                disabled={!!selectedFileObj}
                aria-label="Resume text"
              />
            </div>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <X size={15} />
              {error}
            </div>
          )}

          <div className="action-container">
            <button
              className="analyze-mega-button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !canAnalyze}
              aria-busy={isAnalyzing}
            >
              {isAnalyzing ? (
                <><Loader2 className="icon spin" /> Analyzing Gaps...</>
              ) : (
                <><Sparkles className="icon" /> Analyze &amp; Match My Resume <ArrowRight className="icon" /></>
              )}
            </button>
            <p className="action-hint">
              {canAnalyze
                ? 'Press Ctrl + Enter or click the button to run analysis.'
                : 'Please provide both job description and resume to begin analysis.'}
            </p>
          </div>

          <hr className="divider" />

          <div className="steps-section">
            <div className="step-item">
              <div className="step-circle">1</div>
              <h3>Identify Keyword Gaps</h3>
              <p>Our AI scans the JD for essential skills and traits that are currently missing from your resume text.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">2</div>
              <h3>Optimize Bullet Points</h3>
              <p>Get suggestions on how to rewrite your experiences to echo the specific language of the hiring manager.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">3</div>
              <h3>Skill Growth Roadmap</h3>
              <p>Receive a personalized 3-step plan to bridge technical or soft skill gaps for this specific role.</p>
            </div>
          </div>
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
    </div>
  );
};

export default LandingPage;