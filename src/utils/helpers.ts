import type { Category } from '../types/common.js';

/**
 * Commonly used category IDs for MotoGP championships
 * These UUIDs are consistent across the API and can be used for direct category filtering
 * 
 * @example
 * ```typescript
 * const motogpEvents = await client.getEvents('2024', CATEGORY_IDS.MOTOGP);
 * ```
 */
export const CATEGORY_IDS = {
  /** MotoGP (premier class) category UUID */
  MOTOGP: '737ab122-76e1-4081-bedb-334caaa18c70',
  /** Moto2 (intermediate class) category UUID */
  MOTO2: 'ea854a67-73a4-4a28-ac77-d67b3b2a530a', 
  /** Moto3 (entry class) category UUID */
  MOTO3: '1ab203aa-e292-4842-8bed-971911357af1',
  /** MotoE (electric class) category UUID */
  MOTOE: 'cf196668-f900-4116-af79-810b91828a37'
} as const;

/**
 * Gets a category UUID by category name
 * 
 * @param categoryName - The category name (case-insensitive, special characters ignored)
 * @returns The category UUID if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const motogpId = getCategoryId('MotoGP'); // Returns MOTOGP UUID
 * const moto2Id = getCategoryId('moto-2'); // Returns MOTO2 UUID
 * const invalidId = getCategoryId('F1'); // Returns undefined
 * ```
 */
export function getCategoryId(categoryName: string): string | undefined {
  const normalizedName = categoryName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  switch (normalizedName) {
    case 'MOTOGP':
      return CATEGORY_IDS.MOTOGP;
    case 'MOTO2':
      return CATEGORY_IDS.MOTO2;
    case 'MOTO3': 
      return CATEGORY_IDS.MOTO3;
    case 'MOTOE':
      return CATEGORY_IDS.MOTOE;
    default:
      return undefined;
  }
}

/**
 * Finds a category by name in a list of categories
 * Performs case-insensitive matching on both name and acronym fields
 * 
 * @param categories - Array of category objects to search through
 * @param name - Category name or acronym to search for
 * @returns The matching category object if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const categories = await client.getCategories();
 * const motogp = findCategoryByName(categories, 'MotoGP');
 * const moto2 = findCategoryByName(categories, 'MOT'); // Partial match on acronym
 * ```
 */
export function findCategoryByName(categories: Category[], name: string): Category | undefined {
  const normalizedName = name.toLowerCase();
  return categories.find(cat => 
    cat.name.toLowerCase().includes(normalizedName) || 
    cat.acronym?.toLowerCase().includes(normalizedName)
  );
}

/**
 * Gets the current year
 * Useful for fetching current season data
 * 
 * @returns The current year as a number
 * 
 * @example
 * ```typescript
 * const currentSeasonEvents = await client.getEvents(getCurrentYear().toString());
 * ```
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Validates if a year is within the valid range for MotoGP season data
 * MotoGP data is generally available from 2000 onwards and up to next year
 * 
 * @param year - The year to validate
 * @returns True if the year is valid for MotoGP data, false otherwise
 * 
 * @example
 * ```typescript
 * console.log(isValidSeasonYear(2024)); // true
 * console.log(isValidSeasonYear(1999)); // false (too old)
 * console.log(isValidSeasonYear(2030)); // false (too far in future)
 * ```
 */
export function isValidSeasonYear(year: number): boolean {
  const currentYear = getCurrentYear();
  // MotoGP data generally goes back to 2000 and doesn't exceed next year
  return year >= 2000 && year <= currentYear + 1;
}

/**
 * Formats a lap time string by replacing apostrophes with colons
 * Standardizes time format from MotoGP's "1'23.456" to more common "1:23.456"
 * 
 * @param timeString - The time string to format
 * @returns Formatted time string with colons instead of apostrophes
 * 
 * @example
 * ```typescript
 * console.log(formatLapTime("1'23.456")); // "1:23.456"
 * console.log(formatLapTime("01:23.456")); // "01:23.456" (unchanged)
 * ```
 */
export function formatLapTime(timeString: string): string {
  // Times are generally in format "1'23.456" or "01:23.456"
  return timeString.replace(/[']/g, ':');
}

/**
 * Converts milliseconds to a readable time string format
 * Useful for displaying duration or lap times
 * 
 * @param ms - Milliseconds to convert
 * @returns Formatted time string in "M:SS.mmm" format
 * 
 * @example
 * ```typescript
 * console.log(msToTimeString(83456)); // "1:23.456"
 * console.log(msToTimeString(123456)); // "2:03.456"
 * ```
 */
export function msToTimeString(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Parses a time string into milliseconds
 * Handles various time formats used in MotoGP data
 * 
 * @param timeString - Time string to parse (supports "1'23.456", "01:23.456", etc.)
 * @returns Time in milliseconds, or 0 if parsing fails
 * 
 * @example
 * ```typescript
 * console.log(parseTimeToMs("1'23.456")); // 83456
 * console.log(parseTimeToMs("01:23.456")); // 83456
 * console.log(parseTimeToMs("invalid")); // 0
 * ```
 */
export function parseTimeToMs(timeString: string): number {
  // Handle formats like "1'23.456", "01:23.456", etc.
  const cleanTime = timeString.replace(/[']/g, ':');
  const parts = cleanTime.split(':');
  
  if (parts.length !== 2) return 0;
  
  const minutes = parseInt(parts[0], 10);
  const secondsParts = parts[1].split('.');
  const seconds = parseInt(secondsParts[0], 10);
  const milliseconds = secondsParts[1] ? parseInt(secondsParts[1].padEnd(3, '0'), 10) : 0;
  
  // Check if any parsing failed (NaN)
  if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
    return 0;
  }
  
  return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}
