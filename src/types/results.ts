import type { Category, Season, Country, Team } from './common.js';

// Types for the Results API

/**
 * Live timing session header information
 */
export interface LiveTimingHead {
  /** Championship ID (usually "3" for MotoGP) */
  championship_id: string;
  /** Category name (e.g., "MotoGP") */
  category: string;
  /** Circuit identifier */
  circuit_id: string;
  /** Circuit name */
  circuit_name: string;
  /** Global event identifier */
  global_event_id: string;
  /** Event identifier */
  event_id: string;
  /** Event TV display name */
  event_tv_name: string;
  /** Event short name (e.g., "QAT", "ITA") */
  event_shortname: string;
  /** Session date */
  date: string;
  /** Date as timestamp */
  datet: number;
  /** Date start timestamp */
  datst: number;
  /** Total number of laps in session */
  num_laps: number;
  /** GMT timezone info */
  gmt: string;
  /** Timing system ID */
  trsid: number;
  /** Session identifier */
  session_id: string;
  /** Session type code */
  session_type: number;
  /** Session name (e.g., "Practice 1") */
  session_name: string;
  /** Session short name (e.g., "FP1") */
  session_shortname: string;
  /** Session duration in microseconds */
  duration: string;
  /** Remaining time in session */
  remaining: string;
  /** Session status ID */
  session_status_id: string;
  /** Session status name */
  session_status_name: string;
  /** Formatted date string */
  date_formated: string;
  /** Session URL (if any) */
  url: string | null;
}

/**
 * Live timing data for individual riders
 */
export interface LiveTimingRider {
  /** Position order in timing list */
  order: number;
  /** Rider ID */
  rider_id: number;
  /** Status name (e.g., "CL" for classified) */
  status_name: string;
  /** Status ID */
  status_id: string;
  /** Rider's number */
  rider_number: string;
  /** Team color (hex) */
  color: string;
  /** Text color for contrast (hex) */
  text_color: string;
  /** Current position */
  pos: number;
  /** Rider's short name */
  rider_shortname: string;
  /** Rider's first name */
  rider_name: string;
  /** Rider's surname */
  rider_surname: string;
  /** Best/current lap time */
  lap_time: string;
  /** Number of completed laps */
  num_lap: number;
  /** Last lap time */
  last_lap_time: string;
  /** Last lap number */
  last_lap: number;
  /** Track status */
  trac_status: string;
  /** Team name */
  team_name: string;
  /** Bike manufacturer */
  bike_name: string;
  /** Gap to first place */
  gap_first: string;
  /** Gap to previous rider */
  gap_prev: string;
  /** Whether rider is in pit lane */
  on_pit: boolean;
}

/**
 * Complete live timing response structure
 */
export interface LiveTimingResponse {
  /** Session header information */
  head: LiveTimingHead;
  /** Rider timing data indexed by position */
  rider: Record<string, LiveTimingRider>;
}

/**
 * Race event information
 */
export interface Event {
  /** Unique event identifier */
  id: string;
  /** Event name */
  name: string;
  /** Sponsored event name */
  sponsored_name?: string;
  /** Short name/code for event */
  short_name: string;
  /** Whether this is a test event */
  test: boolean;
  /** Season year as string */
  season: string;
  /** Event start date/time */
  date_start: string;
  /** Event end date/time */
  date_end: string;
  /** Circuit information */
  circuit: Circuit;
  /** Country code */
  country: string;
}

/**
 * Circuit/track information
 */
export interface Circuit {
  /** Unique circuit identifier */
  id: string;
  /** Circuit name */
  name: string;
  /** Country ISO code */
  iso_code: string;
  /** Country name */
  country: string;
  /** Region/state */
  region: string;
  /** City name */
  city: string;
  /** Postal code */
  postal_code: string;
  /** Full address */
  address: string;
  /** Latitude coordinate */
  lat: string;
  /** Longitude coordinate */
  lng: string;
  /** Google Places ID */
  place_id: string;
  /** Year circuit was constructed */
  constructed: number;
  /** Circuit designer name */
  designer: string;
  /** Whether circuit is currently active */
  active: boolean;
  /** Timing system IDs */
  timing_ids: any[];
  /** Track layout information */
  track: any;
  /** Circuit descriptions */
  circuit_descriptions: any[];
  /** User location context */
  user_location?: {
    lat: string;
    radius: number;
  };
}

/**
 * Practice/qualifying/race session information
 */
export interface Session {
  /** Unique session identifier */
  id: string;
  /** Event this session belongs to */
  event: Event;
  /** Session start date/time */
  date_start: string;
  /** Session end date/time */
  date_end: string;
  /** Session number */
  number: number;
  /** Track condition */
  condition: string;
  /** Session status */
  status: string;
  /** Session type (e.g., "Practice", "Race") */
  type: string;
  /** Category information */
  category: Category;
}

/**
 * Basic rider information for results
 */
export interface Rider {
  /** Unique rider identifier */
  id: string;
  /** Rider's first name */
  name: string;
  /** Rider's surname */
  surname: string;
  /** Rider's nickname (if any) */
  nickname?: string;
  /** Rider's country */
  country: Country;
  /** Birth city */
  birth_city: string;
  /** Birth date */
  birth_date: string;
  /** Current age */
  years_old: number;
  /** Legacy numeric identifier */
  legacy_id: number;
  /** Whether rider info is published */
  published: boolean;
}

/**
 * Individual classification entry (race result)
 */
export interface Classification {
  /** Final position in session */
  position: number;
  /** Rider information */
  rider: Rider;
  /** Team information */
  team: Team;
  /** Constructor name */
  constructor: string;
  /** Bike model */
  bike: string;
  /** Top speed in km/h */
  kmh: number;
  /** Total time or best lap time */
  time: string;
  /** Gap to previous rider */
  gap: string;
  /** Gap to first place */
  gap_first: string;
  /** Championship points earned */
  points: number;
  /** Whether rider is a rookie */
  rookie?: boolean;
}

/**
 * Complete classification/results response
 */
export interface ClassificationResponse {
  /** Array of classification entries */
  classification: Classification[];
  /** Official status of results */
  status: string;
  /** Related files (PDFs, etc.) */
  files?: any;
}

/**
 * Entry list response with participating riders
 */
export interface EntryResponse {
  /** Array of participating riders */
  entry: Rider[];
  /** URL to official entry list PDF */
  file: string;
}

/**
 * Grid position information
 */
export interface GridPosition {
  /** Rider information */
  rider: Rider;
  /** Team information */
  team: Team;
  /** Starting grid position */
  position: number;
  /** Qualifying time that earned this position */
  qualifying_time: string;
}

/**
 * Championship standings rider entry
 */
export interface StandingsRider {
  /** Rider identifier */
  id: string;
  /** Total championship points */
  points: number;
}

/**
 * Championship standings response
 */
export interface StandingsResponse {
  /** URL to official standings PDF */
  file: string;
  /** Array of rider standings */
  classification: StandingsRider[];
  /** URL to XML version of standings */
  xmlFile: string;
}

/**
 * Official standings files and documents
 */
export interface StandingsFilesResponse {
  /** Rider results related files */
  riders_results: {
    /** URL to podiums PDF */
    podiums: string;
    /** URL to pole positions PDF */
    pole_positions: string;
    /** URL to nations statistics PDF */
    nations_statistics: string;
    /** URL to all-time riders PDF */
    riders_all_time: string;
  };
  /** Championship related files */
  riders_championship: {
    /** URL to independent team rider PDF */
    independent_team_rider: string;
    /** URL to rookie of the year PDF */
    rookie_of_the_year: string;
    /** URL to season statistics PDF */
    season_statistics: string;
    /** URL to BMW award PDF */
    bmw_award: string;
  };
}

/**
 * BMW Award (qualifying standings) response
 */
export interface BMWAwardResponse {
  /** URL to official BMW Award PDF */
  file: string;
  /** Array of qualifying standings entries */
  classification: {
    /** Rider identifier */
    id: string;
  }[];
}
