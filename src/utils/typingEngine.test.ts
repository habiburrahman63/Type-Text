import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTypingMetrics,
  getRecommendedFinger,
  evaluateLessonResult
} from './typingEngine.ts';
import {
  calculateLevelFromXp,
  calculateXpEarned,
  generateCertificateId
} from './gamification.ts';

test('calculateTypingMetrics computes accurate WPM and accuracy', () => {
  // 300 keystrokes in 60 seconds (1 minute) = 60 words (300/5)
  // 10 uncorrected errors -> Gross WPM = 60, Net WPM = 50
  // 285 correct keystrokes out of 300 = 95% accuracy
  const metrics = calculateTypingMetrics({
    totalKeystrokes: 300,
    correctKeystrokes: 285,
    uncorrectedErrors: 10,
    elapsedSeconds: 60
  });

  assert.equal(metrics.grossWpm, 60);
  assert.equal(metrics.netWpm, 50);
  assert.equal(metrics.accuracy, 95);
  assert.equal(metrics.errorCount, 15);
  assert.equal(metrics.elapsedSeconds, 60);
});

test('calculateTypingMetrics handles zero elapsed time gracefully without division by zero', () => {
  const metrics = calculateTypingMetrics({
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    uncorrectedErrors: 0,
    elapsedSeconds: 0
  });

  assert.equal(metrics.grossWpm, 0);
  assert.equal(metrics.netWpm, 0);
  assert.equal(metrics.accuracy, 100);
});

test('getRecommendedFinger maps characters to accurate hands and fingers', () => {
  // Home row anchor tests
  const f = getRecommendedFinger('F');
  assert.equal(f.finger, 'LI'); // Left Index
  assert.equal(f.hand, 'left');

  const j = getRecommendedFinger('J');
  assert.equal(j.finger, 'RI'); // Right Index
  assert.equal(j.hand, 'right');

  const space = getRecommendedFinger(' ');
  assert.equal(space.hand, 'right'); // Space thumb

  const a = getRecommendedFinger('a');
  assert.equal(a.finger, 'LP'); // Left Pinky
  assert.equal(a.hand, 'left');
});

test('evaluateLessonResult awards proper stars and pass/fail state', () => {
  // Pass with 3 stars (target 40, got 45 wpm with 96% accuracy)
  const result1 = evaluateLessonResult({
    targetWpm: 40,
    actualWpm: 45,
    actualAccuracy: 96,
    minAccuracy: 85
  });
  assert.equal(result1.passed, true);
  assert.equal(result1.stars, 3);

  // Fail due to low accuracy (75% < 85%)
  const result2 = evaluateLessonResult({
    targetWpm: 40,
    actualWpm: 60,
    actualAccuracy: 75,
    minAccuracy: 85
  });
  assert.equal(result2.passed, false);
  assert.equal(result2.stars, 0);
});

test('gamification calculates levels, XP thresholds and certificate IDs', () => {
  const lvl1 = calculateLevelFromXp(50);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.title, 'Keyboard Explorer');

  const lvl2 = calculateLevelFromXp(120);
  assert.equal(lvl2.level, 2);

  const xpEarned = calculateXpEarned({
    wpm: 65,
    accuracy: 96,
    durationSeconds: 60,
    isTest: true
  });
  assert.ok(xpEarned >= 80);

  const certId = generateCertificateId();
  assert.ok(certId.startsWith('TYP-'));
});
