# OscarBase API

Complete Academy Awards data from 1929 to present. Every nomination, winner, film, and filmmaker — queryable in milliseconds.

**Base URL:** `https://api.oscarbase.com`  
**Docs:** `https://api.oscarbase.com`  
**OpenAPI Spec:** `https://api.oscarbase.com/openapi.json`  
**AI/LLM Reference:** `https://api.oscarbase.com/llms.txt`

---

## Quick Start

No API key required for read access. Just make a GET request:

```bash
# Get all Best Picture winners
curl "https://api.oscarbase.com/api/nominations?category=Best+Picture&winner=true"

# Search for a person
curl "https://api.oscarbase.com/api/search?q=spielberg&winner=true"

# Get a specific ceremony
curl "https://api.oscarbase.com/api/ceremonies/97"
```

---

## Resources

| Resource | Records | Description |
|---|---|---|
| `/api/nominations` | ~16,000 | Central fact table — every nomination ever |
| `/api/ceremonies` | 97 | Ceremony metadata, venue, dates, highlights |
| `/api/movies` | varies | TMDB-enriched film data with posters |
| `/api/nominees` | 8,000+ | TMDB-enriched person data with bios |
| `/api/categories` | 29 | Award categories with definitions |
| `/api/songs` | varies | Spotify-enriched nominated songs |
| `/api/search` | — | Full-text search across nominations |

---

## Filtering & Pagination

### Pagination
All list endpoints (except Ceremonies and Categories) support pagination:
```
?page=1&limit=25    # default
?page=2&limit=100   # max 100 per page
```

Response includes a `pagination` object:
```json
{
  "data": [...],
  "pagination": {
    "total": 16000,
    "page": 1,
    "limit": 25,
    "totalPages": 640,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Year Filtering
Supported on nominations, movies, and search:
```
?year=2024                          # exact year
?yearStart=1990&yearEnd=1999        # decade
?yearStart=2000                     # from year to present
?yearEnd=1950                       # up to year
```

### Multi-ID Filtering
All list endpoints support comma-separated ID lookups:
```
?ids=1,2,3
?ceremony_ids=95,96,97              # nominations only
?category_ids=1,2                   # nominations only
?movie_ids=3011,3012                # nominations only
?nominee_ids=142,847                # nominations only
```

### Combining Filters
All filters combine as AND conditions:
```
# All of Meryl Streep's wins
GET /api/nominations?nominee=Meryl+Streep&winner=true

# Best Picture winners in the 1990s
GET /api/nominations?category=Best+Picture&winner=true&yearStart=1990&yearEnd=1999

# Directors nominated since 2000
GET /api/nominees?known_for_department=Directing&page=1&limit=50
```

---

## Endpoint Reference

### Nominations

```
GET /api/nominations
GET /api/nominations/:id
POST /api/nominations          # requires x-api-key header
PATCH /api/nominations/:id     # requires x-api-key header
```

**Query parameters:**
- `year`, `yearStart`, `yearEnd` — year filtering
- `nominee` — partial match on nominee name
- `movie` — partial match on movie title
- `category` — partial match on category name
- `winner` — `true` or `false`
- `is_song` — `true` or `false`
- `ids`, `ceremony_ids`, `category_ids`, `movie_ids`, `nominee_ids`
- `page`, `limit`

The `:id` endpoint returns embedded movie, ceremony, category, nominee, and song objects.

---

### Ceremonies

```
GET /api/ceremonies
GET /api/ceremonies/:id
POST /api/ceremonies           # requires x-api-key header
PATCH /api/ceremonies/:id      # requires x-api-key header
```

Returns all 97 ceremonies with no pagination. Fields include venue, date, overview, wiki URL, and up to 3 highlight moment captions and images.

---

### Movies

```
GET /api/movies
GET /api/movies/:id
POST /api/movies               # requires x-api-key header
PATCH /api/movies/:id          # requires x-api-key header
```

**Query parameters:** `title`, `tmdb_id`, `imdb_id`, `genre`, `ids`, `page`, `limit`

TMDB-enriched fields: `poster_path` and `backdrop_path` are full HTTPS URLs. `genres` and `origin_country` are arrays.

The `:id` endpoint embeds all nominations for that film.

---

### Nominees

```
GET /api/nominees
GET /api/nominees/:id
POST /api/nominees             # requires x-api-key header
PATCH /api/nominees/:id        # requires x-api-key header
```

**Query parameters:** `name`, `tmdb_person_id`, `imdb_id`, `known_for_department`, `ids`, `page`, `limit`

TMDB-enriched fields: `profile_path` is a full HTTPS URL. Includes `biography`, `birthday`, `deathday`, `place_of_birth`.

The `:id` endpoint embeds the full Oscar nomination history for that person.

---

### Categories

```
GET /api/categories
GET /api/categories/:id
```

Returns all 29 categories with no pagination. Fields include `category_name`, `category_group`, `definition`, `era`, `history`.

The `:id` endpoint embeds all nominations in that category.

---

### Songs

```
GET /api/songs
GET /api/songs/:id
POST /api/songs                # requires x-api-key header
PATCH /api/songs/:id           # requires x-api-key header
```

**Query parameters:** `title`, `artist`, `year`, `ids`, `page`, `limit`

Spotify-enriched fields: `spotify_id`, `spotify_url`, `spotify_track_name`, `spotify_album_name`, `spotify_year`.

---

### Search

```
GET /api/search?q=spielberg
```

**Query parameters:**
- `q` (required, min 2 chars) — searches nominee, movie, and category simultaneously
- `winner` — `true` or `false`
- `year`, `yearStart`, `yearEnd`
- `page`, `limit`

Response echoes the query string back:
```json
{
  "query": "spielberg",
  "data": [...],
  "pagination": {...}
}
```

---

## Authentication

Read endpoints are fully public — no auth required.

Write endpoints (POST, PATCH) require:
```
x-api-key: your-secret-key
Content-Type: application/json
```

Returns `401 Unauthorized` if the key is missing or invalid.

---

## Example Requests

```bash
# All of Meryl Streep's Oscar wins
GET /api/nominations?nominee=Meryl+Streep&winner=true

# Best Picture nominees from the 1990s
GET /api/nominations?category=Best+Picture&yearStart=1990&yearEnd=1999

# Find a movie by IMDB ID
GET /api/movies?imdb_id=tt15398776

# Find a person by TMDB ID
GET /api/nominees?tmdb_person_id=12345

# All nominated songs by Billie Eilish
GET /api/songs?artist=Billie+Eilish

# Search across all nominations
GET /api/search?q=nolan&winner=true

# Multiple ceremonies at once
GET /api/ceremonies?ids=95,96,97

# Paginate through all nominations
GET /api/nominations?page=1&limit=100
GET /api/nominations?page=2&limit=100

# Acting category nominations only
GET /api/categories?category_group=Acting

# Add a new ceremony (write access)
POST /api/ceremonies
x-api-key: your-key
{ "ceremony_year": 2025, "show_title": "98th Academy Awards", "venue": "Dolby Theatre" }
```

---

## Data Notes

- `nominations.id` is a bigint and is not auto-generated — supply it on insert
- `movies.genres` and `movies.origin_country` are Postgres arrays
- `poster_path`, `backdrop_path`, and `profile_path` are full HTTPS URLs
- Song nominations have `is_song: true` and a non-null `song_id`
- `ceremony_year` on nominations is denormalized from the ceremonies table for convenience
- The nominees table includes both individual people and production companies

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Hosting:** Vercel
- **Database:** Supabase (Postgres 15)
- **Data enrichment:** TMDB (movies & people), Spotify (songs)

---

## License

Data sourced from public Academy Awards records, enriched via TMDB and Spotify APIs.

---

### Stats

```
GET /api/stats/top-movies
GET /api/stats/top-nominees
```

#### `/api/stats/top-movies`
Returns films ranked by total nomination count. Counts each category once regardless of how many individual nominees (e.g. Best Picture with 4 producers = 1 nomination).

**Query parameters:** `sort` (nominations or wins), `genre` (e.g. Drama, Comedy, Horror), `yearStart`, `yearEnd`, `limit` (default 25, max 100)

**Response:**
```json
{
  "data": [
    { "movie_id": 4375, "movie": "Titanic", "total_nominations": 16, "total_wins": 12 }
  ]
}
```

#### `/api/stats/top-nominees`
Returns people ranked by total nomination count. Each nomination counted individually.

**Query parameters:** `sort` (nominations or wins), `known_for_department`, `category`, `category_group`, `yearStart`, `yearEnd`, `limit` (default 25, max 100)

**Response:**
```json
{
  "data": [
    { "nominee_id": 142, "nominee": "Meryl Streep", "total_nominations": 21, "total_wins": 3 }
  ]
}
```

**Stats examples:**
```bash
# Most nominated films ever
GET /api/stats/top-movies?limit=10

# Most winning films ever
GET /api/stats/top-movies?sort=wins&limit=10

# Most nominated Drama films
GET /api/stats/top-movies?genre=Drama

# Most winning Comedy films
GET /api/stats/top-movies?genre=Comedy&sort=wins

# Most nominated directors
GET /api/stats/top-nominees?known_for_department=Directing

# Most winning actors
GET /api/stats/top-nominees?known_for_department=Acting&sort=wins

# Most nominated people in the 2000s
GET /api/stats/top-nominees?yearStart=2000&yearEnd=2009&sort=nominations
```
