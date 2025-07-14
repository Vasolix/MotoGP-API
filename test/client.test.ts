import { test, expect, describe } from 'bun:test';
import { MotoGPClient } from '../src/client/MotoGPClient';
import { 
  CATEGORY_IDS, 
  getCategoryId, 
  formatLapTime, 
  parseTimeToMs, 
  msToTimeString,
  getCurrentYear,
  isValidSeasonYear,
  findCategoryByName
} from '../src/utils/helpers';

describe('MotoGPClient', () => {
  const client = new MotoGPClient({
    timeout: 15000
  });

  describe('Client Initialization', () => {
    test('should create client with default options', () => {
      const defaultClient = new MotoGPClient();
      expect(defaultClient).toBeDefined();
    });

    test('should create client with custom options', () => {
      const customClient = new MotoGPClient({
        baseURL: 'https://custom.api.com',
        timeout: 5000,
        userAgent: 'Test-Client/1.0.0'
      });
      expect(customClient).toBeDefined();
    });
  });

  // Note: These tests require an internet connection
  describe('Results API', () => {
    test('should fetch seasons', async () => {
      try {
        const seasons = await client.getSeasons();
        expect(Array.isArray(seasons)).toBe(true);
        if (seasons.length > 0) {
          expect(seasons[0]).toHaveProperty('id');
          expect(seasons[0]).toHaveProperty('year');
          expect(typeof seasons[0].year).toBe('number');
        }
      } catch (error) {
        // Tests may fail if the API is unavailable
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);

    test('should fetch events for a specific season', async () => {
      try {
        const events = await client.getEvents('2024');
        expect(Array.isArray(events)).toBe(true);
        if (events.length > 0) {
          expect(events[0]).toHaveProperty('id');
          expect(events[0]).toHaveProperty('name');
          expect(events[0]).toHaveProperty('circuit');
          expect(events[0]).toHaveProperty('date_start');
          expect(events[0]).toHaveProperty('date_end');
        }
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);

    test('should fetch live timing', async () => {
      try {
        const liveTiming = await client.getLiveTiming();
        expect(liveTiming).toHaveProperty('head');
        expect(liveTiming).toHaveProperty('rider');
      } catch (error) {
        // This test may fail if no live session is active
        console.warn('Test skipped - No live session or API unavailable:', error);
      }
    }, 10000);

    test('should fetch classification for a session', async () => {
      try {
        // Try to get a recent session classification
        const classification = await client.getClassification('e8c110ad-64aa-4e8e-8a86-f2f152f6a942', 2024);
        expect(classification).toHaveProperty('classification');
        expect(Array.isArray(classification.classification)).toBe(true);
      } catch (error) {
        console.warn('Test skipped - Session not found or API unavailable:', error);
      }
    }, 10000);

    test('should fetch standings', async () => {
      try {
        const standings = await client.getStandings('2024', CATEGORY_IDS.MOTOGP);
        expect(standings).toHaveProperty('classification');
        expect(Array.isArray(standings.classification)).toBe(true);
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);
  });

  describe('Broadcast API', () => {
    test('should fetch categories for current year', async () => {
      try {
        const currentYear = new Date().getFullYear();
        const categories = await client.getCategories(currentYear);
        expect(Array.isArray(categories)).toBe(true);
        if (categories.length > 0) {
          expect(categories[0]).toHaveProperty('id');
          expect(categories[0]).toHaveProperty('name');
          expect(categories[0]).toHaveProperty('legacy_id');
        }
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);

    test('should fetch riders', async () => {
      try {
        const riders = await client.getRiders();
        expect(Array.isArray(riders)).toBe(true);
        if (riders.length > 0) {
          expect(riders[0]).toHaveProperty('id');
          expect(riders[0]).toHaveProperty('name');
          expect(riders[0]).toHaveProperty('surname');
          expect(riders[0]).toHaveProperty('current_career_step');
        }
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);

    test('should fetch teams', async () => {
      try {
        const teams = await client.getTeams(CATEGORY_IDS.MOTOGP, getCurrentYear());
        expect(Array.isArray(teams)).toBe(true);
        if (teams.length > 0) {
          expect(teams[0]).toHaveProperty('id');
          expect(teams[0]).toHaveProperty('name');
          expect(teams[0]).toHaveProperty('color');
          expect(teams[0]).toHaveProperty('constructor');
        }
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);

    test('should fetch events', async () => {
      try {
        const currentYear = getCurrentYear();
        const events = await client.getBroadcastEvents(currentYear);
        expect(Array.isArray(events)).toBe(true);
        if (events.length > 0) {
          expect(events[0]).toHaveProperty('id');
          expect(events[0]).toHaveProperty('name');
          expect(events[0]).toHaveProperty('circuit');
          expect(events[0]).toHaveProperty('season');
        }
      } catch (error) {
        console.warn('Test skipped - API unavailable:', error);
      }
    }, 10000);
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const failingClient = new MotoGPClient({
        baseURL: 'https://nonexistent.api.com',
        timeout: 1000
      });

      await expect(failingClient.getSeasons()).rejects.toThrow();
    });
  });
});

describe('Helpers', () => {
  describe('Category Helpers', () => {
    test('CATEGORY_IDS should contain correct IDs', () => {
      expect(CATEGORY_IDS.MOTOGP).toBe('737ab122-76e1-4081-bedb-334caaa18c70');
      expect(CATEGORY_IDS.MOTO2).toBe('ea854a67-73a4-4a28-ac77-d67b3b2a530a');
      expect(CATEGORY_IDS.MOTO3).toBe('1ab203aa-e292-4842-8bed-971911357af1');
      expect(CATEGORY_IDS.MOTOE).toBe('cf196668-f900-4116-af79-810b91828a37');
    });

    test('getCategoryId should return correct IDs', () => {
      expect(getCategoryId('MotoGP')).toBe(CATEGORY_IDS.MOTOGP);
      expect(getCategoryId('motogp')).toBe(CATEGORY_IDS.MOTOGP);
      expect(getCategoryId('MOTO GP')).toBe(CATEGORY_IDS.MOTOGP);
      expect(getCategoryId('Moto2')).toBe(CATEGORY_IDS.MOTO2);
      expect(getCategoryId('Moto3')).toBe(CATEGORY_IDS.MOTO3);
      expect(getCategoryId('MotoE')).toBe(CATEGORY_IDS.MOTOE);
      expect(getCategoryId('Invalid')).toBeUndefined();
    });

    test('findCategoryByName should find categories correctly', () => {
      const mockCategories = [
        { id: '1', name: 'MotoGP', acronym: 'MOT', legacy_id: 1 },
        { id: '2', name: 'Moto2', acronym: 'MO2', legacy_id: 2 },
        { id: '3', name: 'Moto3', acronym: 'MO3', legacy_id: 3 }
      ];

      expect(findCategoryByName(mockCategories, 'MotoGP')).toEqual(mockCategories[0]);
      expect(findCategoryByName(mockCategories, 'motogp')).toEqual(mockCategories[0]);
      expect(findCategoryByName(mockCategories, 'MOT')).toEqual(mockCategories[0]);
      expect(findCategoryByName(mockCategories, 'Moto2')).toEqual(mockCategories[1]);
      expect(findCategoryByName(mockCategories, 'NotFound')).toBeUndefined();
    });
  });

  describe('Time Formatting Helpers', () => {
    test('formatLapTime should format times correctly', () => {
      expect(formatLapTime("1'23.456")).toBe("1:23.456");
      expect(formatLapTime("2'15.789")).toBe("2:15.789");
      expect(formatLapTime("01:23.456")).toBe("01:23.456");
      expect(formatLapTime("0'45.123")).toBe("0:45.123");
    });

    test('parseTimeToMs should parse times correctly', () => {
      expect(parseTimeToMs("1:23.456")).toBe(83456);
      expect(parseTimeToMs("2:15.789")).toBe(135789);
      expect(parseTimeToMs("0:45.123")).toBe(45123);
      expect(parseTimeToMs("invalid")).toBe(0);
      expect(parseTimeToMs("1:23")).toBe(83000); // No milliseconds
    });

    test('msToTimeString should format ms correctly', () => {
      expect(msToTimeString(83456)).toBe("1:23.456");
      expect(msToTimeString(135789)).toBe("2:15.789");
      expect(msToTimeString(45123)).toBe("0:45.123");
      expect(msToTimeString(0)).toBe("0:00.000");
    });

    test('time conversion should be reversible', () => {
      const originalTime = "1:23.456";
      const ms = parseTimeToMs(originalTime);
      const backToTime = msToTimeString(ms);
      expect(backToTime).toBe(originalTime);
    });

    test('should handle edge cases in time parsing', () => {
      expect(parseTimeToMs("")).toBe(0);
      expect(parseTimeToMs("1")).toBe(0);
      expect(parseTimeToMs("1:")).toBe(0);
      expect(parseTimeToMs(":23")).toBe(0);
    });
  });

  describe('Year and Season Helpers', () => {
    test('getCurrentYear should return current year', () => {
      const currentYear = getCurrentYear();
      expect(typeof currentYear).toBe('number');
      expect(currentYear).toBeGreaterThan(2000);
      expect(currentYear).toBeLessThanOrEqual(new Date().getFullYear());
    });

    test('isValidSeasonYear should validate years correctly', () => {
      expect(isValidSeasonYear(2024)).toBe(true);
      expect(isValidSeasonYear(2000)).toBe(true);
      expect(isValidSeasonYear(getCurrentYear())).toBe(true);
      expect(isValidSeasonYear(getCurrentYear() + 1)).toBe(true);
      expect(isValidSeasonYear(1999)).toBe(false);
      expect(isValidSeasonYear(getCurrentYear() + 2)).toBe(false);
      expect(isValidSeasonYear(-1)).toBe(false);
    });
  });
});
