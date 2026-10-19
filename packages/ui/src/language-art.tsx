import { ArrowUpRight, Sparkles } from 'lucide-react';

export function LanguageArt() {
  return (
    <div className="language-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="art-glow" />
      <span className="art-caption">
        <span /> LANGUAGE, IN MOTION
      </span>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-letter">
        Aa<span>à</span>
      </div>
      <div className="floating-rule rule-one">
        <span className="rule-dot" /> lo studente <ArrowUpRight size={13} />
      </div>
      <div className="floating-rule rule-two">
        <span className="tiny-star">
          <Sparkles size={14} />
        </span>{' '}
        gli studenti <span className="rule-check">✓</span>
      </div>
      <div className="art-italia">
        <i />
        <i />
        <i />
      </div>
      <span className="art-coordinate">41°53′ N · 12°29′ E</span>
      <span className="art-plus plus-one">+</span>
      <span className="art-plus plus-two">+</span>
    </div>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="25" height="27" viewBox="0 0 25 27" fill="none">
        <path
          d="M5 22V5.5h7.2a5.9 5.9 0 1 1 0 11.8H9"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="20.5" cy="22" r="2" fill="currentColor" />
      </svg>
    </span>
  );
}
