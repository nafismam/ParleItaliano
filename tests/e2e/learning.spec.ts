import { expect, test } from '@playwright/test';
import { grammarCatalog } from '@parle/content';
import AxeBuilder from '@axe-core/playwright';

test('complete a lesson, save notes, and restore learning progress', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const topic = grammarCatalog.find((item) => item.slug === 'articoli-determinativi')!;
  await page.goto('./#lesson/articoli-determinativi');
  await expect(page.getByRole('heading', { name: topic.title, exact: true })).toBeVisible();
  await expect(page.locator('.grammar-notes table').first()).toBeVisible();
  await page.getByRole('button', { name: 'Save lesson', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeVisible();
  await page.locator('.note-disclosure summary').first().click();
  await expect(page.locator('.note-disclosure').first()).toHaveAttribute('open', '');
  const flashcard = page.locator('.note-flashcard').first();
  await flashcard.click();
  await expect(flashcard).toHaveAttribute('aria-expanded', 'true');

  for (const [index, exercise] of topic.exercises.entries()) {
    if (exercise.type === 'multiple_choice') {
      if (index === 0) {
        const wrong = exercise.options.find((option) => option !== exercise.correctAnswer)!;
        await page.getByRole('radio', { name: new RegExp(`^[A-Z] ${wrong}$`) }).click();
        await page.getByRole('button', { name: 'Check answer', exact: true }).click();
        await expect(page.locator('.answer-feedback')).toContainText('A little adjustment.');
        await page.getByRole('button', { name: 'Try again', exact: true }).click();
      }
      await page
        .getByRole('radio')
        .filter({
          has: page.locator('span[lang="it"]', {
            hasText: new RegExp(`^${exercise.correctAnswer}$`),
          }),
        })
        .click();
    } else if (exercise.type === 'sentence_reorder') {
      for (const word of exercise.correctAnswer.split(/\s+/))
        await page
          .locator('.reorder-tokens')
          .getByRole('button', { name: word, exact: true })
          .click();
    } else {
      await page.locator('.written-answer input').fill(exercise.correctAnswer);
    }
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(page.locator('.answer-feedback')).toContainText('Esatto!');
    await page
      .getByRole('button', { name: index === 4 ? 'Finish lesson' : 'Keep going', exact: true })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Bravissimo!' })).toBeVisible();
  await expect(page.locator('.completion-stats')).toContainText('+100 XP');
  await page.reload();
  await expect(page.locator('.lesson-meta')).toContainText('5/5 mastered');
  await page.getByRole('link', { name: 'My notebook', exact: true }).click();
  await expect(page.locator('.saved-card')).toContainText(topic.title);
  await page.getByRole('link', { name: 'Your progress', exact: true }).click();
  await expect(page.locator('.stat-card').nth(1)).toContainText('100');
  await page.getByRole('button', { name: 'Search lessons', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search grammar lessons' }).fill('passato prossimo');
  await expect(page.locator('.search-results>button')).toHaveCount(3);
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('phone navigation and exercises remain usable without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Make Italian/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Navigation', exact: true })
    .getByRole('link', { name: 'Learning path', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: /Little steps/ })).toBeVisible();
  await page.locator('.topic-main').first().click();
  await page.getByRole('button', { name: 'Practice 0/5', exact: false }).click();
  await expect(page.locator('.practice-panel')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
});

test('core screens and navigation meet automated WCAG A/AA checks', async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['overview', 'lesson/articoli-determinativi', 'progress']) {
    await page.goto(`./#${route}`);
    await page.waitForFunction(
      () => getComputedStyle(document.querySelector('.workspace-main > div')!).opacity === '1',
    );
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.getByRole('button', { name: 'Your profile and preferences', exact: true }).click();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
});
