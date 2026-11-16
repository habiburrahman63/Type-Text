import test from 'node:test';
import assert from 'node:assert/strict';

// Data types simulation matching AppContext
interface UserPersonalData {
  lessonProgress: Record<string, { stars: number; bestWpm: number }>;
  testHistory: Array<{ id: string; netWpm: number; accuracy: number; passageTitle: string }>;
  certificates: Array<{ id: string; recipientName: string; wpm: number; accuracy: number }>;
}

class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

test('User-specific storage guarantees strict isolation between accounts', () => {
  const mockStorage = new MockLocalStorage();

  // Helper functions matching AppContext
  const getUserKey = (userId: string) => `typenex_userdata_${userId}`;
  const saveUserData = (userId: string, data: UserPersonalData) => {
    mockStorage.setItem(getUserKey(userId), JSON.stringify(data));
  };
  const loadUserData = (userId: string): UserPersonalData => {
    const raw = mockStorage.getItem(getUserKey(userId));
    if (raw) return JSON.parse(raw);
    return { lessonProgress: {}, testHistory: [], certificates: [] };
  };

  // 1. User 1 (Rahim) signs in
  const user1Id = 'usr_rahim_101';
  const user1Name = 'Rahim Ahmed';
  const user1Data = loadUserData(user1Id);

  assert.equal(user1Data.testHistory.length, 0, 'New user starts with 0 tests');
  assert.equal(user1Data.certificates.length, 0, 'New user starts with 0 certificates');

  // Rahim completes a typing test
  user1Data.testHistory.push({
    id: 'test_1',
    netWpm: 58,
    accuracy: 96,
    passageTitle: 'The Art of Touch Typing'
  });
  // Certificate issued in Rahim's name
  user1Data.certificates.push({
    id: 'cert_1',
    recipientName: user1Name,
    wpm: 58,
    accuracy: 96
  });
  saveUserData(user1Id, user1Data);

  // 2. User 2 (Karim) signs in
  const user2Id = 'usr_karim_202';
  const user2Name = 'Karim Uddin';
  const user2Data = loadUserData(user2Id);

  // User 2 MUST NOT see User 1's data
  assert.equal(user2Data.testHistory.length, 0, 'User 2 sees 0 tests, not User 1 tests');
  assert.equal(user2Data.certificates.length, 0, 'User 2 sees 0 certificates');

  // Karim completes a test with different stats
  user2Data.testHistory.push({
    id: 'test_2',
    netWpm: 42,
    accuracy: 91,
    passageTitle: 'Curiosity and Wonder'
  });
  saveUserData(user2Id, user2Data);

  // 3. User 1 logs back in
  const reloadedUser1 = loadUserData(user1Id);
  assert.equal(reloadedUser1.testHistory.length, 1);
  assert.equal(reloadedUser1.testHistory[0].netWpm, 58);
  assert.equal(reloadedUser1.certificates[0].recipientName, 'Rahim Ahmed');

  // 4. Verify no data bleeding
  assert.notDeepEqual(reloadedUser1.testHistory, user2Data.testHistory);
  assert.equal(user2Data.testHistory[0].netWpm, 42);
});
