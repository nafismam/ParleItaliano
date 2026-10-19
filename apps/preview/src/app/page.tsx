import { LearningApp } from '@parle/ui';
import { grammarCatalog } from '@parle/content';
import { toPublicExercise } from '@parle/contracts';
export default function Page() {
  const catalog = grammarCatalog.map(({ exercises, ...topic }) => ({
    ...topic,
    exercises: exercises.map(toPublicExercise),
  }));
  // The static edition grades locally. These educational answers are intentionally public.
  const answerKey = Object.fromEntries(
    grammarCatalog.flatMap((topic) =>
      topic.exercises.map((exercise) => [
        exercise.exerciseId,
        { correctAnswer: exercise.correctAnswer, explanation: exercise.explanation },
      ]),
    ),
  );
  return <LearningApp catalog={catalog} mode="preview" answerKey={answerKey} />;
}
