// ── Enums ──────────────────────────────────────────────────────────────────

export type AlbumStatus = "WANT_TO_LISTEN" | "LISTENING" | "LISTENED";
export type AlbumType = "album" | "single" | "compilation";
export type SortOrder = "asc" | "desc";

// ── Paginação ──────────────────────────────────────────────────────────────

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface UserProfile extends User {
  _count: {
    reviews: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

// ── Genre ──────────────────────────────────────────────────────────────────

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

// ── Artist ─────────────────────────────────────────────────────────────────

export interface ArtistSummary {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface Artist extends ArtistSummary {
  bio: string | null;
  country: string | null;
  formedYear: number | null;
  dissolvedYear: number | null;
  spotifyId: string | null;
  createdAt: string;
  genres: Genre[];
  _count: {
    albums: number;
  };
}

export interface ArtistWithDiscography extends Artist {
  albums: AlbumSummary[];
}

// ── Track ──────────────────────────────────────────────────────────────────

export interface Track {
  id: string;
  title: string;
  number: number;
  duration: number | null;
}

// ── Album ──────────────────────────────────────────────────────────────────

export interface AlbumSummary {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  releaseYear: number | null;
  inHumix: boolean;
  spotifyId?: string | null;
  _count: {
    reviews: number;
  };
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  releaseYear: number | null;
  releaseDate: string | null;
  totalTracks: number | null;
  description: string | null;
  spotifyId: string | null;
  createdAt: string;
  artist: ArtistSummary;
  genres: Genre[];
  _count: {
    reviews: number;
    userAlbums: number;
  };
}

export interface AlbumDetail extends Album {
  tracks: Track[];
  stats: {
    avgRating: number | null;
    reviewCount: number;
  };
  userAlbum?: UserAlbum | null;
  userReview?: ReviewSummary | null;
}

// ── UserAlbum ──────────────────────────────────────────────────────────────

export interface UserAlbum {
  userId: string;
  albumId: string;
  status: AlbumStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserAlbumWithAlbum {
  status: AlbumStatus;
  updatedAt: string;
  album: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string | null;
    releaseYear: number | null;
    inHumix: boolean;
    artist: {
      name: string;
      slug: string;
    };
  };
}

// ── Review ─────────────────────────────────────────────────────────────────

export interface ReviewSummary {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
}

export interface Review extends ReviewSummary {
  listenedAt: string | null;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  album: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string | null;
    artist: {
      name: string;
      slug: string;
    };
  };
}

// ── Streak ─────────────────────────────────────────────────────────────────

export interface StreakEntry {
  id: string;
  date: string;
  albumId: string | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  history: StreakEntry[];
}

// ── Spotify ────────────────────────────────────────────────────────────────

export interface SpotifySearchResult {
  spotifyId: string;
  title: string;
  albumType: AlbumType;
  artist: {
    spotifyId: string;
    name: string;
  };
  releaseYear: number | null;
  coverUrl: string | null;
  totalTracks: number;
  inHumix: boolean;
  alreadyImported: boolean;
  importedSlug: string | null;
}

// ── Recommendation ─────────────────────────────────────────────────────────

export interface Recommendation {
  album: {
    id: string;
    title: string;
    slug: string;
    coverUrl: string | null;
    releaseYear: number | null;
    inHumix: boolean;
    spotifyId: string | null;
    artist: {
      id: string;
      name: string;
      slug: string;
      imageUrl: string | null;
    };
    genres: Genre[];
    avgRating: number;
    reviewCount: number;
  };
  score: number;
  influencedBy: {
    album: {
      id: string;
      title: string;
      slug: string;
      coverUrl: string | null;
      releaseYear: number | null;
      artist: {
        name: string;
        slug: string;
      };
    };
    rating: number;
    matchingGenres: string[];
  };
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

// ── Auth ───────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string | null;
  };
}

// ── Stats ──────────────────────────────────────────────────────────────────

export interface TopArtist extends ArtistSummary {
  genres: Genre[];
  reviewCount: number;
  avgRating: number;
}

export interface TopAlbum {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  releaseYear: number | null;
  artist: {
    name: string;
    slug: string;
  };
  avgRating: number;
  reviewCount: number;
}

export interface TopGenre extends Genre {
  albumCount: number;
}

export interface UserStats {
  reviewCount: number;
  avgRating: number | null;
  totalListened: number;
  currentStreak: number;
  longestStreak: number;
  topGenres: Array<Genre & { count: number }>;
}

// ── Session ────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
