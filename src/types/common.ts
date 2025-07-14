// Common types used throughout the MotoGP API

/**
 * Represents a country with ISO code and flag
 */
export interface Country {
  /** ISO country code (e.g., "IT", "ES") */
  iso: string;
  /** Full country name (e.g., "Italy", "Spain") */
  name: string;
  /** URL to the country's flag image */
  flag: string;
}

/**
 * Represents a MotoGP season
 */
export interface Season {
  /** Unique identifier for the season */
  id: string;
  /** Season name (usually null) */
  name?: string;
  /** Season year (e.g., 2024, 2025) */
  year: number;
  /** Whether this is the current active season */
  current: boolean;
}

/**
 * Represents a racing category (MotoGP, Moto2, Moto3, MotoE)
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Category name (e.g., "MotoGP", "Moto2") */
  name: string;
  /** Legacy numeric identifier */
  legacy_id: number;
  /** Category acronym (e.g., "MGP", "MT2") */
  acronym?: string;
  /** Whether the category is currently active */
  active?: boolean;
  /** Timing system identifier */
  timing_id?: number;
  /** Display priority order */
  priority?: number;
}

/**
 * Represents a motorcycle manufacturer/constructor
 */
export interface Constructor {
  /** Unique identifier for the constructor */
  id: string;
  /** Constructor name (e.g., "Ducati", "Yamaha") */
  name: string;
  /** Legacy numeric identifier */
  legacy_id: number;
}

/**
 * Represents a racing team
 */
export interface Team {
  /** Unique identifier for the team */
  id: string;
  /** Constructor/manufacturer information */
  constructor: Constructor;
  /** Full team name (e.g., "Ducati Lenovo Team") */
  name: string;
  /** Legacy numeric identifier */
  legacy_id: number;
  /** Team's primary color (hex code) */
  color: string;
  /** Text color for contrast (hex code) */
  text_color: string;
  /** URL to team's bike/logo image */
  picture: string;
  /** Whether the team information is published */
  published: boolean;
}

/**
 * Represents a business unit (e.g., MotoGP™ organization)
 */
export interface BusinessUnit {
  /** Unique identifier for the business unit */
  id: string;
  /** Full business unit name */
  name: string;
  /** Business unit acronym */
  acronym: string;
}

/**
 * API error interface for standardized error handling
 */
export interface APIError {
  /** Error message describing what went wrong */
  message: string;
  /** HTTP status code (optional) */
  status?: number;
}

/**
 * Configuration options for the MotoGP API client
 */
export interface ClientOptions {
  /** Base URL for the API (default: https://api.motogp.pulselive.com/motogp/v1/) */
  baseURL?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Custom User-Agent string for requests */
  userAgent?: string;
}
