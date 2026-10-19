'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CircleCheck,
  RefreshCw,
  Sparkles,
  Trophy,
  X,
  Lightbulb,
  Send,
} from 'lucide-react';
import type { GradeResult, LearningTopic } from '@parle/contracts';

export type GradeHandler = (
  topic: LearningTopic,
  exerciseId: string,
  answer: string,
  attemptId: string,
) => Promise<GradeResult>;

export function ExercisePlayer({
  topic,
  correctIds,
  grade,
  onDone,
}: {
  topic: LearningTopic;
  correctIds: string[];
  grade: GradeHandler;
  onDone: () => void;
}) {
  const first = topic.exercises.findIndex((exercise) => !correctIds.includes(exercise.exerciseId));
  const [index, setIndex] = useState(first === -1 ? 0 : first);
  const [answer, setAnswer] = useState('');
  const [tokens, setTokens] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<GradeResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const attempt = useRef<string | null>(null);
  const reduce = useReducedMotion();
  const exercise = topic.exercises[index];
  const complete = index >= topic.exercises.length;
  const value =
    exercise?.type === 'sentence_reorder'
      ? tokens.map((token) => exercise.options[token]).join(' ')
      : answer;

  async function submit() {
    if (!exercise || !value.trim() || busy || feedback) return;
    setBusy(true);
    setError('');
    attempt.current ??= crypto.randomUUID();
    try {
      const result = await grade(topic, exercise.exerciseId, value, attempt.current);
      setFeedback(result);
      setSessionXp((xp) => xp + (result.xpAwarded || 0));
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : 'Could not check your answer. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  function next() {
    if (feedback?.isCorrect) setIndex(index + 1);
    setFeedback(null);
    setAnswer('');
    setTokens([]);
    setError('');
    attempt.current = null;
  }
  if (complete)
    return (
      <motion.div
        className="exercise-completion"
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="celebration-orbit">
          <Trophy size={37} />
          <span className="celebration-spark s1">✦</span>
          <span className="celebration-spark s2">✦</span>
          <span className="celebration-spark s3">✧</span>
        </div>
        <p className="eyebrow">UN ALTRO PASSO AVANTI</p>
        <h2>
          Bravissimo<span>!</span>
        </h2>
        <p>
          Five little wins.
          <br />A little more Italian.
        </p>
        <div className="completion-stats">
          <span>
            <CircleCheck size={17} /> 5 / 5 mastered
          </span>
          <span>
            <Sparkles size={17} /> +{sessionXp} XP
          </span>
        </div>
        <button className="primary-button" onClick={onDone}>
          Back to your path <ArrowRight size={16} />
        </button>
        <button
          className="text-button"
          onClick={() => {
            setIndex(0);
            setSessionXp(0);
            setFeedback(null);
            setAnswer('');
            setTokens([]);
            attempt.current = null;
          }}
        >
          Practice once more <RefreshCw size={13} />
        </button>
      </motion.div>
    );
  if (!exercise) return null;
  return (
    <div className="exercise-player">
      <div className="exercise-topline">
        <span className="eyebrow">
          <span className="live-dot" /> A LITTLE PRACTICE
        </span>
        <span className="mono">
          {String(index + 1).padStart(2, '0')} <i>/ 05</i>
        </span>
      </div>
      <div
        className="exercise-progress"
        role="progressbar"
        aria-label="Exercise progress"
        aria-valuenow={index + (feedback?.isCorrect ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <motion.span
          initial={{ width: `${index * 20}%` }}
          animate={{ width: `${((index + (feedback?.isCorrect ? 1 : 0)) / 5) * 100}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.exerciseId}
          initial={{ opacity: 0, x: reduce ? 0 : 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduce ? 0 : -15 }}
          className="exercise-question"
        >
          <span className="question-type">
            {exercise.type === 'multiple_choice'
              ? 'Choose the right answer'
              : exercise.type === 'sentence_reorder'
                ? 'Build the sentence'
                : exercise.type === 'error_correction'
                  ? 'Make it right'
                  : 'Fill in the blank'}
          </span>
          <h3 lang="it">{exercise.prompt}</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (feedback) next();
              else void submit();
            }}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                (event.target as HTMLElement).getAttribute('role') === 'radio' &&
                value.trim()
              ) {
                event.preventDefault();
                void submit();
              }
            }}
          >
            {exercise.type === 'multiple_choice' && (
              <motion.div
                className="answer-options"
                animate={
                  feedback && !feedback.isCorrect && !reduce
                    ? { x: [0, -5, 5, -3, 3, 0] }
                    : { x: 0 }
                }
                role="radiogroup"
                aria-label="Answer choices"
              >
                {exercise.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={answer === option}
                    tabIndex={answer === option || (!answer && optionIndex === 0) ? 0 : -1}
                    disabled={busy || Boolean(feedback)}
                    onKeyDown={(event) => {
                      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
                        event.preventDefault();
                        const offset =
                          event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
                        const nextOption =
                          (optionIndex + offset + exercise.options.length) %
                          exercise.options.length;
                        setAnswer(exercise.options[nextOption]!);
                        attempt.current = null;
                        event.currentTarget.parentElement
                          ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                          [nextOption]?.focus();
                      }
                    }}
                    onClick={() => {
                      setAnswer(option);
                      attempt.current = null;
                    }}
                    className={`answer-option ${answer === option ? 'is-selected' : ''} ${feedback?.isCorrect && answer === option ? 'is-correct' : ''} ${feedback && !feedback.isCorrect && answer === option ? 'is-incorrect' : ''}`}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span lang="it">{option}</span>
                    <span className="option-indicator">
                      {answer === option ? (
                        feedback?.isCorrect ? (
                          <Check size={15} />
                        ) : feedback ? (
                          <X size={15} />
                        ) : (
                          <span />
                        )
                      ) : null}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
            {(exercise.type === 'fill_in_the_blank' || exercise.type === 'error_correction') && (
              <div className="written-answer">
                <label htmlFor={`answer-${exercise.exerciseId}`}>
                  Your answer <span lang="it">in italiano</span>
                </label>
                <input
                  id={`answer-${exercise.exerciseId}`}
                  autoComplete="off"
                  spellCheck={false}
                  lang="it"
                  value={answer}
                  maxLength={1000}
                  disabled={busy || Boolean(feedback)}
                  placeholder={
                    exercise.type === 'error_correction'
                      ? 'Write the corrected sentence…'
                      : 'Type the missing word…'
                  }
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    attempt.current = null;
                  }}
                  className={feedback ? (feedback.isCorrect ? 'is-correct' : 'is-incorrect') : ''}
                />
                <span className="answer-tip">Accents matter. You can skip the final period.</span>
              </div>
            )}
            {exercise.type === 'sentence_reorder' && (
              <div className="reorder-area">
                <div className="reorder-answer" aria-label="Your sentence">
                  {tokens.length === 0 && <span>Tap the words in order</span>}
                  {tokens.map((token, selectedIndex) => (
                    <button
                      type="button"
                      key={token}
                      disabled={Boolean(feedback) || busy}
                      onClick={() => setTokens(tokens.filter((_, i) => i !== selectedIndex))}
                    >
                      {exercise.options[token]} <X size={10} />
                    </button>
                  ))}
                </div>
                <div className="reorder-tokens">
                  {exercise.options
                    .map((_, i) => exercise.options.length - 1 - i)
                    .map((token) => (
                      <button
                        key={token}
                        type="button"
                        disabled={tokens.includes(token) || Boolean(feedback) || busy}
                        onClick={() => setTokens([...tokens, token])}
                      >
                        {exercise.options[token]}
                      </button>
                    ))}
                </div>
              </div>
            )}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`answer-feedback ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
                  role="status"
                  aria-live="polite"
                >
                  <div>
                    <span className="feedback-icon">
                      {feedback.isCorrect ? <Check size={17} /> : <Lightbulb size={17} />}
                    </span>
                    <strong>
                      {feedback.isCorrect ? 'Esatto! You’ve got it.' : 'A little adjustment.'}
                    </strong>
                    {feedback.isCorrect && Boolean(feedback.xpAwarded) && (
                      <span className="earned-xp">+{feedback.xpAwarded} XP</span>
                    )}
                  </div>
                  {!feedback.isCorrect && (
                    <p className="correct-answer" lang="it">
                      {feedback.correctAnswer}
                    </p>
                  )}
                  <p lang="it">{feedback.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {error && (
              <p className="exercise-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className={`primary-button check-answer ${feedback?.isCorrect ? 'success-button' : ''}`}
              disabled={busy || (!feedback && !value.trim())}
            >
              {busy
                ? 'Checking…'
                : feedback
                  ? feedback.isCorrect
                    ? index === 4
                      ? 'Finish lesson'
                      : 'Keep going'
                    : 'Try again'
                  : 'Check answer'}
              {busy ? (
                <RefreshCw size={16} className="spin" />
              ) : feedback?.isCorrect ? (
                <ArrowRight size={17} />
              ) : feedback ? (
                <RefreshCw size={15} />
              ) : (
                <Send size={15} />
              )}
            </button>
            <div className="exercise-bottom-note">
              {feedback ? (
                'Every try is a step forward.'
              ) : (
                <>
                  <span>↵</span> Press Enter to check
                </>
              )}
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
