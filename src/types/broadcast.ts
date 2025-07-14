import type { Category, Season, Country, Team, BusinessUnit } from './common.js';

/**
 * Types for the Broadcast API
 * Comprehensive definitions for all Broadcast API response structures
 */

/**
 * Event information from Broadcast API with full details
 */
export interface BroadcastEvent {
  /** Unique event identifier */
  id: string;
  /** Timing system identifier */
  timing_id: number;
  /** Categories participating in this event */
  event_categories: {
    /** Category identifier */
    category_id: string;
    /** Running order sequence */
    sequence: number;
  }[];
  /** Country code where event takes place */
  country: string;
  /** Circuit/track information */
  circuit: BroadcastCircuit;
  /** Event type (e.g., "NORMAL", "TEST") */
  kind: string;
  /** Live broadcast sessions */
  broadcasts: Broadcast[];
  /** Event end date */
  date_end: string;
  /** Event timezone */
  time_zone: string;
  /** Event type description */
  type: string;
  /** Short name/code for event */
  shortname: string;
  /** Business unit organizing the event */
  business_unit: BusinessUnit;
  /** Event URL slug */
  url: string;
  /** Sequence number in season */
  sequence: number;
  /** Event schedule information */
  schedule: Schedule;
  /** Event start date */
  date_start: string;
  /** Additional URLs */
  urls: any[];
  /** Event assets (images, videos) */
  assets: any[];
  /** Full event name */
  name: string;
  /** Season information */
  season: Season;
  /** Categories in this event */
  categories: BroadcastCategory[];
  /** Event status */
  status: string;
  /** Social media hashtag */
  hashtag: string;
  /** Results API circuit UUID (optional) */
  'results-api-circuit-uuid'?: string;
  /** Results API event UUID (optional) */
  'results-api-event-uuid'?: string;
}

/**
 * Circuit information from Broadcast API
 */
export interface BroadcastCircuit {
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
  /** Circuit designer */
  designer: string;
  /** Whether circuit is currently active */
  active: boolean;
  /** Timing system identifiers */
  timing_ids: any[];
  /** Track layout data */
  track: any;
  /** Circuit descriptions */
  circuit_descriptions: any[];
  /** User location context (optional) */
  user_location?: {
    /** User latitude */
    lat: string;
    /** Search radius */
    radius: number;
  };
}

/**
 * Individual broadcast session information
 */
export interface Broadcast {
  /** Unique broadcast identifier */
  id: string;
  /** Timing system ID */
  timing_id: number;
  /** Short name for broadcast */
  shortname?: string;
  /** Full broadcast name */
  name?: string;
  /** Broadcast start time */
  date_start?: string;
  /** Broadcast end time */
  date_end?: string;
  /** Remaining time in milliseconds */
  remain?: number;
  /** Broadcast type */
  type?: string;
  /** Broadcast kind */
  kind?: string;
  /** Current status */
  status?: string;
  /** Progressive number */
  progressive?: number;
  /** Whether timing data is available */
  has_timing?: boolean;
  /** Whether live stream is available */
  has_live?: boolean;
  /** Whether report is available */
  has_report?: boolean;
  /** Whether results are available */
  has_results?: boolean;
  /** Whether on-demand viewing is available */
  has_on_demand?: boolean;
  /** Whether currently live */
  is_live?: boolean;
  /** Whether live timing is active */
  is_live_timing?: boolean;
  /** Live status (deprecated) */
  live?: boolean;
  /** Category for this broadcast */
  category?: BroadcastCategory;
  /** Grand Prix day number */
  gp_day?: number;
}

/**
 * Category information for broadcasts
 */
export interface BroadcastCategory {
  /** Unique category identifier */
  id: string;
  /** Category acronym (e.g., "MOT") */
  acronym: string;
  /** Full category name */
  name: string;
  /** Whether category is active */
  active: boolean;
  /** Timing system ID */
  timing_id: number;
  /** Display priority */
  priority: number;
}

/**
 * Event schedule information
 */
export interface Schedule {
  /** Available schedule options */
  options: ScheduleOption[];
  /** Currently selected day */
  selected_day: number;
}

/**
 * Individual schedule option/day
 */
export interface ScheduleOption {
  /** Date as timestamp */
  date: number;
  /** Start date string */
  dateStart: string;
  /** Day name */
  name: string;
  /** Day number */
  day: number;
  /** Month name */
  month: string;
  /** Day suffix (st, nd, rd, th) */
  day_suffix: string;
  /** Grand Prix day number */
  gp_day: number;
}

/**
 * Comprehensive rider information from Broadcast API
 */
export interface BroadcastRider {
  /** Unique rider identifier */
  id: string;
  /** Rider's first name */
  name: string;
  /** Rider's surname */
  surname: string;
  /** Rider's nickname (optional) */
  nickname?: string;
  /** Rider's country */
  country: Country;
  /** Birth city */
  birth_city: string;
  /** Birth date */
  birth_date: string;
  /** Current age */
  years_old: number;
  /** Legacy identifier */
  legacy_id: number;
  /** Publication status */
  published: boolean;
  /** Current career information */
  current_career_step: CareerStep;
  /** Whether rider is a legend */
  legend?: boolean;
  /** Merchandise store URL */
  merchandise_url?: string;
  /** Biography information */
  biography?: any;
  /** Legend picture URL */
  legend_picture?: string;
  /** Whether rider is a wildcard entry */
  wildcard?: boolean;
  /** Whether rider is currently injured */
  injured?: boolean;
  /** Physical measurements */
  physical_attributes?: {
    /** Height in cm */
    height: number;
    /** Weight in kg */
    weight: number;
  };
  /** Whether rider is banned */
  banned?: boolean;
  /** Complete career history */
  career?: CareerStep[];
}

/**
 * Career step information for riders
 */
export interface CareerStep {
  /** Season year */
  season: number;
  /** Rider number */
  number: number;
  /** Sponsored team name */
  sponsored_team: string;
  /** Team information */
  team: Team;
  /** Category information */
  category: Category;
  /** Whether rider is in the grid */
  in_grid: boolean;
  /** Short nickname */
  short_nickname: string;
  /** Whether this is current career step */
  current: boolean;
  /** Rider pictures */
  pictures: RiderPictures;
  /** Career step type */
  type: string;
}

/**
 * Rider pictures and visual assets
 */
export interface RiderPictures {
  /** Profile pictures */
  profile: {
    /** Main profile picture */
    main: string;
    /** Secondary profile picture */
    secondary?: string;
  };
  /** Bike pictures */
  bike: {
    /** Main bike picture */
    main: string;
    /** Secondary bike picture */
    secondary?: string;
  };
  /** Helmet pictures */
  helmet: {
    /** Main helmet picture */
    main: string;
    /** Secondary helmet picture */
    secondary?: string;
  };
  /** Rider number image */
  number: string;
  /** Portrait image */
  portrait: string;
}

/**
 * Comprehensive rider statistics
 */
export interface RiderStatistics {
  /** First Grand Prix appearances */
  first_grand_prix: StatEvent[];
  /** Podium statistics */
  podiums: StatCount;
  /** Most recent wins */
  last_wins: StatEvent[];
  /** Third place finishes */
  third_positions: StatCount;
  /** Pole position statistics */
  poles: StatCount;
  /** First podium appearances */
  first_podiums: StatEvent[];
  /** Second place finishes */
  second_positions: StatCount;
  /** World championship wins */
  world_championship_wins: StatCount;
  /** Best race positions */
  best_positions: StatPosition[];
  /** Best grid positions */
  best_grid_positions: StatPosition[];
  /** First Grand Prix victories */
  first_grand_prix_victories: StatEvent[];
  /** Race fastest lap statistics */
  race_fastest_laps: StatCount;
  /** Best qualifying positions */
  best_qualify_positions: StatPosition[];
  /** Total Grand Prix victories */
  grand_prix_victories: StatCount;
  /** All races statistics */
  all_races: StatCount;
  /** First race fastest laps */
  first_race_fastest_lap: StatEvent[];
  /** First pole positions */
  first_pole_positions: StatEvent[];
}

/**
 * Statistical event information
 */
export interface StatEvent {
  /** Category of the event */
  category: Category;
  /** Event details */
  event: {
    /** Event identifier */
    id: string;
    /** Event name */
    name: string;
    /** Sponsored event name */
    sponsored_name: string;
    /** Short event name */
    short_name: string;
    /** Whether it was a test */
    test: boolean;
    /** Season year */
    season: string;
  };
}

/**
 * Statistical count by category
 */
export interface StatCount {
  /** Count by category */
  categories: {
    /** Category information */
    category: Category;
    /** Count for this category */
    count: number;
  }[];
  /** Total count across all categories */
  total: number;
}

/**
 * Statistical position by category
 */
export interface StatPosition {
  /** Category information */
  category: Category;
  /** Position count */
  count: number;
}

/**
 * Season statistics for a rider
 */
export interface SeasonStatistics {
  /** Season year */
  season: string;
  /** Category name */
  category: string;
  /** Constructor name */
  constructor: string;
  /** Number of race starts */
  starts: number;
  /** Number of first place finishes */
  first_position: number;
  /** Number of second place finishes */
  second_position: number;
  /** Number of third place finishes */
  third_position: number;
  /** Total podium finishes */
  podiums: number;
  /** Number of pole positions */
  poles: number;
  /** Total championship points */
  points: number;
  /** Final championship position */
  position: number;
}

/**
 * Team information from Broadcast API
 */
export interface BroadcastTeam {
  /** Unique team identifier */
  id: string;
  /** Team primary color (hex) */
  color: string;
  /** Riders in this team */
  riders: BroadcastRider[];
  /** Constructor/manufacturer information */
  constructor: {
    /** Constructor identifier */
    id: string;
    /** Constructor name */
    name: string;
    /** Legacy constructor ID */
    legacy_id: number;
  };
  /** Team name */
  name: string;
  /** Legacy team identifier */
  legacy_id: number;
  /** Text color for contrast (hex) */
  text_color: string;
  /** Publication status */
  published: boolean;
  /** Team logo/picture URL */
  picture: string;
}
