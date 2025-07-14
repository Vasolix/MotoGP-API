import { request } from 'undici';
import type { 
  ClientOptions, 
  APIError,
  Season,
  Category
} from '../types/common.js';
import type {
  LiveTimingResponse,
  Event,
  Session,
  ClassificationResponse,
  EntryResponse,
  GridPosition,
  StandingsResponse,
  StandingsFilesResponse,
  BMWAwardResponse
} from '../types/results.js';
import type {
  BroadcastEvent,
  BroadcastRider,
  RiderStatistics,
  SeasonStatistics,
  BroadcastTeam
} from '../types/broadcast.js';

/**
 * MotoGP API Client
 * 
 * A TypeScript client for the official MotoGP API, providing access to both Results API and Broadcast API endpoints.
 * Uses undici for high-performance HTTP requests with full TypeScript support.
 * 
 * @example
 * ```typescript
 * const client = new MotoGPClient();
 * const riders = await client.getRiders();
 * const seasons = await client.getSeasons();
 * ```
 */
export class MotoGPClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly userAgent: string;

  /**
   * Creates a new MotoGP API client instance
   * 
   * @param options - Configuration options for the client
   * @param options.baseURL - Base URL for the API (default: https://api.motogp.pulselive.com/motogp/v1/)
   * @param options.timeout - Request timeout in milliseconds (default: 10000)
   * @param options.userAgent - Custom User-Agent string (default: Chrome browser)
   * 
   * @example
   * ```typescript
   * const client = new MotoGPClient({
   *   timeout: 15000,
   *   userAgent: 'MyApp/1.0.0'
   * });
   * ```
   */
  constructor(options: ClientOptions = {}) {
    this.baseURL = options.baseURL || 'https://api.motogp.pulselive.com/motogp/v1/';
    this.timeout = options.timeout || 10000;
    this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  }

  /**
   * Makes an HTTP GET request to the API
   * 
   * @template T - The expected response type
   * @param endpoint - The API endpoint path (relative to baseURL)
   * @param searchParams - Optional query parameters to append to the URL
   * @returns Promise that resolves to the API response data
   * @throws {APIError} When the request fails or returns non-200 status
   * 
   * @private
   */
  private async makeRequest<T>(endpoint: string, searchParams?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    try {
      console.log(`Making request to: ${url.toString()}`);
      const response = await request(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json',
        },
        headersTimeout: this.timeout,
        bodyTimeout: this.timeout,
      });

      if (response.statusCode !== 200) {
        const error: APIError = {
          message: `HTTP ${response.statusCode}: ${response.statusCode === 404 ? 'Not Found' : 'Request Failed'}`,
          status: response.statusCode
        };
        throw error;
      }

      const data = await response.body.json() as T;
      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      
      const apiError: APIError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      throw apiError;
    }
  }

  // =============================================================================
  // RESULTS API
  // =============================================================================

  /**
   * Retrieves live timing data during active sessions
   * 
   * @returns Promise that resolves to live timing data including session info and rider positions
   * @throws {APIError} When no live session is active or request fails
   * 
   * @example
   * ```typescript
   * const liveTiming = await client.getLiveTiming();
   * console.log('Current session:', liveTiming.head.session_name);
   * Object.values(liveTiming.rider).forEach(rider => {
   *   console.log(`${rider.pos}. ${rider.rider_name} ${rider.rider_surname} - ${rider.lap_time}`);
   * });
   * ```
   */
  async getLiveTiming(): Promise<LiveTimingResponse> {
    return this.makeRequest<LiveTimingResponse>('timing-gateway/livetiming-lite');
  }

  /**
   * Retrieves all available MotoGP seasons
   * 
   * @returns Promise that resolves to an array of season objects
   * @throws {APIError} When the request fails
   * 
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * const currentSeason = seasons.find(s => s.current);
   * console.log('Current season:', currentSeason?.year);
   * ```
   */
  async getSeasons(): Promise<Season[]> {
    return this.makeRequest<Season[]>('results/seasons');
  }

  /**
   * Retrieves events for a specific season
   * 
   * @param seasonUuid - The unique identifier of the season
   * @returns Promise that resolves to an array of event objects
   * @throws {APIError} When the season is not found or request fails
   * 
   * @example
   * ```typescript
   * const events = await client.getEvents('season-uuid-here');
   * console.log(`Found ${events.length} events in the season`);
   * ```
   */
  async getEvents(seasonUuid: string): Promise<Event[]> {
    return this.makeRequest<Event[]>('results/events', { seasonUuid });
  }

  /**
   * Retrieves a specific event by ID
   * 
   * @param eventId - The unique identifier of the event
   * @returns Promise that resolves to the event object
   * @throws {APIError} When the event is not found or request fails
   * 
   * @example
   * ```typescript
   * const event = await client.getEvent('event-id-here');
   * console.log('Event:', event.name);
   * ```
   */
  async getEvent(eventId: string): Promise<Event> {
    return this.makeRequest<Event>(`results/events/${eventId}`);
  }

  /**
   * Retrieves sessions for a specific event and category
   * 
   * @param eventUuid - The unique identifier of the event
   * @param categoryUuid - The unique identifier of the category (e.g., MotoGP, Moto2, Moto3)
   * @returns Promise that resolves to an array of session objects
   * @throws {APIError} When the event/category is not found or request fails
   * 
   * @example
   * ```typescript
   * const sessions = await client.getSessions('event-uuid', 'motogp-category-uuid');
   * const raceSession = sessions.find(s => s.type.toLowerCase().includes('race'));
   * ```
   */
  async getSessions(eventUuid: string, categoryUuid: string): Promise<Session[]> {
    return this.makeRequest<Session[]>('results/sessions', { eventUuid, categoryUuid });
  }

  /**
   * Retrieves a specific session by ID
   * 
   * @param sessionId - The unique identifier of the session
   * @returns Promise that resolves to the session object
   * @throws {APIError} When the session is not found or request fails
   * 
   * @example
   * ```typescript
   * const session = await client.getSession('session-id-here');
   * console.log('Session:', session.type, session.status);
   * ```
   */
  async getSession(sessionId: string): Promise<Session> {
    return this.makeRequest<Session>(`results/sessions/${sessionId}`);
  }

  /**
   * Retrieves the classification (results) for a specific session
   * 
   * @param sessionId - The unique identifier of the session
   * @param seasonYear - Optional season year for disambiguation (e.g., 2024)
   * @param isTest - Optional flag indicating if this is a test session
   * @returns Promise that resolves to the classification data
   * @throws {APIError} When the session is not found or request fails
   * 
   * @example
   * ```typescript
   * const classification = await client.getClassification('session-id', 2024);
   * classification.classification.forEach((entry, index) => {
   *   console.log(`${index + 1}. ${entry.rider.name} ${entry.rider.surname} - ${entry.points} points`);
   * });
   * ```
   */
  async getClassification(
    sessionId: string, 
    seasonYear?: number, 
    isTest?: boolean
  ): Promise<ClassificationResponse> {
    const params: Record<string, string | number | boolean> = {};
    if (seasonYear !== undefined) params.seasonYear = seasonYear;
    if (isTest !== undefined) params.test = isTest;
    
    return this.makeRequest<ClassificationResponse>(`results/session/${sessionId}/classification`, params);
  }

  /**
   * Retrieves the entry list (participating riders) for an event
   * 
   * @param eventId - The unique identifier of the event
   * @param categoryUuid - The unique identifier of the category
   * @returns Promise that resolves to the entry list with rider data and PDF file link
   * @throws {APIError} When the event/category is not found or request fails
   * 
   * @example
   * ```typescript
   * const entryList = await client.getEntryList('event-id', 'category-uuid');
   * console.log(`${entryList.entry.length} riders participating`);
   * console.log('Official entry list PDF:', entryList.file);
   * ```
   */
  async getEntryList(eventId: string, categoryUuid: string): Promise<EntryResponse> {
    return this.makeRequest<EntryResponse>(`event/${eventId}/entry`, { categoryUuid });
  }

  /**
   * Retrieves grid positions for a specific event and category
   * 
   * @param eventId - The unique identifier of the event
   * @param categoryId - The unique identifier of the category
   * @returns Promise that resolves to an array of grid position objects
   * @throws {APIError} When the event/category is not found or request fails
   * 
   * @example
   * ```typescript
   * const gridPositions = await client.getGridPositions('event-id', 'category-id');
   * gridPositions.forEach(pos => {
   *   console.log(`Position ${pos.position}: ${pos.rider.name} ${pos.rider.surname} - ${pos.qualifying_time}`);
   * });
   * ```
   */
  async getGridPositions(eventId: string, categoryId: string): Promise<GridPosition[]> {
    return this.makeRequest<GridPosition[]>(`results/event/${eventId}/category/${categoryId}/grid`);
  }

  /**
   * Retrieves rider standings for a specific season and category
   * 
   * @param seasonUuid - The unique identifier of the season
   * @param categoryUuid - The unique identifier of the category
   * @returns Promise that resolves to the standings data with points and file links
   * @throws {APIError} When the season/category is not found or request fails
   * 
   * @example
   * ```typescript
   * const standings = await client.getStandings('season-uuid', 'motogp-category-uuid');
   * standings.classification.forEach((rider, index) => {
   *   console.log(`${index + 1}. Rider ${rider.id} - ${rider.points} points`);
   * });
   * ```
   */
  async getStandings(seasonUuid: string, categoryUuid: string): Promise<StandingsResponse> {
    return this.makeRequest<StandingsResponse>('results/standings', { seasonUuid, categoryUuid });
  }

  /**
   * Retrieves official files related to standings (PDFs, statistics)
   * 
   * @param seasonUuid - The unique identifier of the season
   * @param categoryUuid - The unique identifier of the category
   * @returns Promise that resolves to file URLs for various standings documents
   * @throws {APIError} When the season/category is not found or request fails
   * 
   * @example
   * ```typescript
   * const files = await client.getStandingsFiles('season-uuid', 'category-uuid');
   * console.log('Podiums PDF:', files.riders_results.podiums);
   * console.log('Pole positions PDF:', files.riders_results.pole_positions);
   * ```
   */
  async getStandingsFiles(seasonUuid: string, categoryUuid: string): Promise<StandingsFilesResponse> {
    return this.makeRequest<StandingsFilesResponse>('results/standings/files', { seasonUuid, categoryUuid });
  }

  /**
   * Retrieves qualifying standings (BMW Award) for a season
   * 
   * @param seasonUuid - The unique identifier of the season
   * @returns Promise that resolves to BMW Award standings data
   * @throws {APIError} When the season is not found or request fails
   * 
   * @example
   * ```typescript
   * const bmwAward = await client.getBMWAward('season-uuid');
   * console.log('BMW Award standings:', bmwAward.classification.length, 'riders');
   * ```
   */
  async getBMWAward(seasonUuid: string): Promise<BMWAwardResponse> {
    return this.makeRequest<BMWAwardResponse>('results/standings/bmwaward', { seasonUuid });
  }

  // =============================================================================
  // BROADCAST API
  // =============================================================================

  /**
   * Retrieves all categories for a specific season
   * 
   * @param seasonYear - The season year (e.g., 2024, 2025)
   * @returns Promise that resolves to an array of category objects (MotoGP, Moto2, Moto3, MotoE)
   * @throws {APIError} When the season year is invalid or request fails
   * 
   * @example
   * ```typescript
   * const categories = await client.getCategories(2024);
   * const motoGP = categories.find(c => c.name === 'MotoGP');
   * console.log('MotoGP category ID:', motoGP?.id);
   * ```
   */
  async getCategories(seasonYear: number): Promise<Category[]> {
    return this.makeRequest<Category[]>('categories', { seasonYear });
  }

  /**
   * Retrieves broadcast events for a specific season
   * 
   * @param seasonYear - The season year (e.g., 2024, 2025)
   * @returns Promise that resolves to an array of broadcast event objects
   * @throws {APIError} When the season year is invalid or request fails
   * 
   * @example
   * ```typescript
   * const events = await client.getBroadcastEvents(2024);
   * const upcomingEvents = events.filter(e => new Date(e.date_start) > new Date());
   * console.log(`${upcomingEvents.length} upcoming events`);
   * ```
   */
  async getBroadcastEvents(seasonYear: number): Promise<BroadcastEvent[]> {
    return this.makeRequest<BroadcastEvent[]>('events', { seasonYear });
  }

  /**
   * Retrieves a specific broadcast event by ID
   * 
   * @param eventId - The unique identifier of the broadcast event
   * @returns Promise that resolves to the broadcast event object with full details
   * @throws {APIError} When the event is not found or request fails
   * 
   * @example
   * ```typescript
   * const event = await client.getBroadcastEvent('event-id-here');
   * console.log('Event:', event.name);
   * console.log('Circuit:', event.circuit.name);
   * console.log('Broadcasts:', event.broadcasts.length);
   * ```
   */
  async getBroadcastEvent(eventId: string): Promise<BroadcastEvent> {
    return this.makeRequest<BroadcastEvent>(`events/${eventId}`);
  }

  /**
   * Retrieves all riders from the current season across all categories
   * 
   * @returns Promise that resolves to an array of rider objects with career information
   * @throws {APIError} When the request fails
   * 
   * @example
   * ```typescript
   * const riders = await client.getRiders();
   * const motoGPRiders = riders.filter(r => r.current_career_step.category.name === 'MotoGP');
   * motoGPRiders.forEach(rider => {
   *   console.log(`#${rider.current_career_step.number} ${rider.name} ${rider.surname} - ${rider.current_career_step.team.name}`);
   * });
   * ```
   */
  async getRiders(): Promise<BroadcastRider[]> {
    return this.makeRequest<BroadcastRider[]>('riders');
  }

  /**
   * Retrieves detailed information for a specific rider
   * 
   * @param riderId - The unique identifier of the rider
   * @returns Promise that resolves to the rider object with full career history and details
   * @throws {APIError} When the rider is not found or request fails
   * 
   * @example
   * ```typescript
   * const rider = await client.getRider('rider-uuid-here');
   * console.log(`${rider.name} ${rider.surname}`);
   * console.log('Country:', rider.country.name);
   * console.log('Career steps:', rider.career?.length);
   * ```
   */
  async getRider(riderId: string): Promise<BroadcastRider> {
    return this.makeRequest<BroadcastRider>(`riders/${riderId}`);
  }

  /**
   * Retrieves comprehensive statistics for a rider across their entire career
   * 
   * @param legacyId - The legacy ID of the rider (numeric identifier)
   * @returns Promise that resolves to detailed rider statistics including wins, podiums, poles, etc.
   * @throws {APIError} When the rider is not found or request fails
   * 
   * @example
   * ```typescript
   * const stats = await client.getRiderStatistics(7646); // Example: Brad Binder
   * console.log(`Total victories: ${stats.grand_prix_victories.total}`);
   * console.log(`Total podiums: ${stats.podiums.total}`);
   * console.log(`Total pole positions: ${stats.poles.total}`);
   * ```
   */
  async getRiderStatistics(legacyId: number): Promise<RiderStatistics> {
    return this.makeRequest<RiderStatistics>(`riders/${legacyId}/stats`);
  }

  /**
   * Retrieves rider statistics summarized by season
   * 
   * @param legacyId - The legacy ID of the rider (numeric identifier)
   * @returns Promise that resolves to an array of season statistics
   * @throws {APIError} When the rider is not found or request fails
   * 
   * @example
   * ```typescript
   * const seasonStats = await client.getRiderSeasonStatistics(7646);
   * seasonStats.forEach(season => {
   *   console.log(`${season.season}: ${season.points} points, Position ${season.position}`);
   * });
   * ```
   */
  async getRiderSeasonStatistics(legacyId: number): Promise<SeasonStatistics[]> {
    return this.makeRequest<SeasonStatistics[]>(`riders/${legacyId}/statistics`);
  }

  /**
   * Retrieves teams for a specific category and season
   * 
   * Note: This is the only known way to get riders from all seasons, as the getRiders() 
   * endpoint only returns riders from the current season.
   * 
   * @param categoryUuid - The unique identifier of the category (use CATEGORY_IDS constants)
   * @param seasonYear - The season year (e.g., 2024, 2025)
   * @returns Promise that resolves to an array of team objects with their riders
   * @throws {APIError} When the category/season is not found or request fails
   * 
   * @example
   * ```typescript
   * import { CATEGORY_IDS } from 'motogp-api';
   * const teams = await client.getTeams(CATEGORY_IDS.MOTOGP, 2024);
   * teams.forEach(team => {
   *   console.log(`${team.name} (${team.constructor.name})`);
   *   team.riders.forEach(rider => {
   *     console.log(`  - #${rider.current_career_step.number} ${rider.name} ${rider.surname}`);
   *   });
   * });
   * ```
   */
  async getTeams(categoryUuid: string, seasonYear: number): Promise<BroadcastTeam[]> {
    return this.makeRequest<BroadcastTeam[]>('teams', { categoryUuid, seasonYear });
  }
}
