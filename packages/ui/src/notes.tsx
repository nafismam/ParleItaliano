'use client';

import { useId, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, RotateCw, ChevronDown, Sparkles } from 'lucide-react';

export function SpeakButton({
  phrase,
  label,
  compact = false,
}: {
  phrase: string;
  label?: string;
  compact?: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(
    () => () => {
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    },
    [],
  );
  function speak() {
    if (typeof speechSynthesis === 'undefined') {
      setUnavailable(true);
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'it-IT';
    utterance.rate = 0.85;
    const italian = speechSynthesis.getVoices().find((voice) => voice.lang.startsWith('it'));
    if (italian) utterance.voice = italian;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (event) => {
      setSpeaking(false);
      if (!['interrupted', 'canceled'].includes(event.error)) setUnavailable(true);
    };
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  }
  return (
    <span className="speech-wrap">
      <button
        type="button"
        onClick={speak}
        className={compact ? 'icon-button' : 'listen-button'}
        aria-label={label || `Listen to ${phrase}`}
        aria-pressed={speaking}
      >
        <Volume2 size={compact ? 18 : 15} className={speaking ? 'speaking' : ''} />
        {!compact && (label || phrase)}
      </button>
      {unavailable && (
        <span role="status" className="speech-unavailable">
          Italian audio isn’t available in this browser.
        </span>
      )}
    </span>
  );
}

function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      className={`note-flashcard ${flipped ? 'is-flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      aria-expanded={flipped}
    >
      <span className="eyebrow">
        <Sparkles size={13} /> A LITTLE ACTIVE RECALL <RotateCw size={14} />
      </span>
      <strong lang="it">{flipped ? back : front}</strong>
      <span>
        {flipped ? 'Click to see the question' : 'Think of your answer, then click to reveal'}
      </span>
    </button>
  );
}

function ChecklistInput({ checked }: { checked?: boolean | undefined }) {
  const [value, setValue] = useState(Boolean(checked));
  return <input type="checkbox" checked={value} onChange={() => setValue(!value)} />;
}

function Markdown({ text }: { text: string }) {
  const clean = text.replace(/^> \[!(?:NOTE|TIP|IMPORTANT)\]\s*/gm, '> ');
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        table: ({ children }) => (
          <div
            className="note-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Grammar reference table"
          >
            <table>{children}</table>
          </div>
        ),
        a: ({ href, children }) => (
          <a
            href={
              href?.startsWith('../../docs/')
                ? `https://github.com/nafismam/ParleItaliano/blob/main/docs/${href.split('/').pop()}`
                : href
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        input: ({ checked }) => <ChecklistInput checked={checked} />,
        li: ({ children, className }) => (
          <li className={className}>
            {className?.includes('task-list-item') ? <label>{children}</label> : children}
          </li>
        ),
      }}
    >
      {clean}
    </ReactMarkdown>
  );
}

/** Declared components are parsed as data. No database MDX is compiled or evaluated. */
export function Notes({ markdown }: { markdown: string }) {
  const id = useId();
  const parts = markdown.split(
    /(<details>[\s\S]*?<\/details>|<AudioButton\s[^>]*\/>|<Flashcard\s[^>]*\/>)/g,
  );
  function attribute(text: string, name: string) {
    return text.match(new RegExp(`${name}="([^"]*)"`))?.[1] || '';
  }
  return (
    <div className="grammar-notes" lang="it">
      {parts.map((part, index) => {
        const key = `${id}-${index}`;
        if (part.startsWith('<details>')) {
          const summary = part.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || 'Approfondimento';
          const body = part
            .replace(/<\/?details>/g, '')
            .replace(/<summary>[\s\S]*?<\/summary>/, '');
          return (
            <details key={key} className="note-disclosure">
              <summary>
                <ChevronDown size={15} />
                {summary}
              </summary>
              <div>
                <Markdown text={body} />
              </div>
            </details>
          );
        }
        if (part.startsWith('<AudioButton'))
          return (
            <SpeakButton
              key={key}
              phrase={attribute(part, 'phrase')}
              label={attribute(part, 'label')}
            />
          );
        if (part.startsWith('<Flashcard'))
          return (
            <Flashcard key={key} front={attribute(part, 'front')} back={attribute(part, 'back')} />
          );
        return <Markdown key={key} text={part} />;
      })}
    </div>
  );
}
