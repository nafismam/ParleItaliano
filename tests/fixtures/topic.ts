import { randomUUID } from 'node:crypto';
import type { Topic } from '@parle/contracts';
// Synthetic validation data, never published as lesson content.
export function topicFixture(): Topic {
  return {
    slug: `test-${randomUUID()}`,
    title: 'Validation fixture',
    cefrLevel: 'A1',
    category: 'Syntax',
    estimatedMinutes: 5,
    theoryMarkdown: 'Synthetic test material for validating the topic contract.',
    keyRules: [
      {
        ruleTitle: 'Test rule',
        explanation: 'Test explanation',
        italianExample: 'Test example',
        englishTranslation: 'Test translation',
      },
    ],
    exercises: Array.from({ length: 5 }, (_, i) => ({
      exerciseId: randomUUID(),
      order: i + 1,
      type: 'fill_in_the_blank' as const,
      prompt: 'Test prompt',
      correctAnswer: 'answer',
      explanation: 'Test explanation',
    })),
  };
}
