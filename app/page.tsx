'use client'

export default function Home() {
  function toggle(e: React.MouseEvent<HTMLDivElement>) {
    const card = (e.currentTarget as HTMLElement).closest('.endpoint-card') as HTMLElement
    card.classList.toggle('open')
  }

  function copyUrl(e: React.MouseEvent, path: string) {
    e.stopPropagation()
    navigator.clipboard.writeText('https://api.oscarbase.com' + path)
    const el = e.currentTarget as HTMLElement
    const orig = el.innerHTML
    el.innerHTML = '✓ COPIED!'
    el.style.color = 'var(--success)'
    setTimeout(() => { el.innerHTML = orig; el.style.color = '' }, 1500)
  }

  const endpoints = [
    {
      id: 'ep-nominations',
      method: 'GET',
      path: '/api/nominations',
      desc: 'List & filter nominations',
      params: [
        {name:'year',type:'integer',req:false,desc:'Filter by exact ceremony year'},
        {name:'yearStart',type:'integer',req:false,desc:'Start of year range'},
        {name:'yearEnd',type:'integer',req:false,desc:'End of year range'},
        {name:'nominee',type:'string',req:false,desc:'Partial match on nominee name'},
        {name:'movie',type:'string',req:false,desc:'Partial match on movie title'},
        {name:'category',type:'string',req:false,desc:'Partial match on category name'},
        {name:'winner',type:'boolean',req:false,desc:'Filter winners (true) or losers (false)'},
        {name:'is_song',type:'boolean',req:false,desc:'Filter song nominations only'},
        {name:'ids',type:'string',req:false,desc:'Comma-separated nomination IDs'},
        {name:'ceremony_ids',type:'string',req:false,desc:'Filter by ceremony IDs'},
        {name:'category_ids',type:'string',req:false,desc:'Filter by category IDs'},
        {name:'movie_ids',type:'string',req:false,desc:'Filter by movie IDs'},
        {name:'nominee_ids',type:'string',req:false,desc:'Filter by nominee IDs'},
        {name:'page',type:'integer',req:false,desc:'Page number (default: 1)'},
        {name:'limit',type:'integer',req:false,desc:'Results per page (default: 25, max: 100)'},
      ],
      fields: [
        {name:'id',type:'bigint',desc:'Nomination ID'},
        {name:'ceremony_id',type:'integer',desc:'FK → ceremonies'},
        {name:'ceremony_year',type:'integer',desc:'Ceremony year (denormalized)'},
        {name:'category_id',type:'integer',desc:'FK → categories'},
        {name:'category',type:'text',desc:'Award category name'},
        {name:'movie_id',type:'integer',desc:'FK → movies'},
        {name:'movie',type:'text',desc:'Film title'},
        {name:'nominee_id',type:'integer',desc:'FK → nominees'},
        {name:'nominee',type:'text',desc:'Nominee name'},
        {name:'song_id',type:'integer',desc:'FK → songs (nullable)'},
        {name:'song_title',type:'text',desc:'Song title if applicable'},
        {name:'is_song',type:'boolean',desc:'True if song category'},
        {name:'winner',type:'boolean',desc:'True if won'},
      ],
      example: '/api/nominations?nominee=Meryl+Streep&winner=true',
    },
    {
      id: 'ep-nominations-id',
      method: 'GET',
      path: '/api/nominations/{id}',
      desc: 'Single nomination with full detail',
      params: [],
      fields: [
        {name:'id',type:'bigint',desc:'Nomination ID'},
        {name:'ceremony_year',type:'integer',desc:'Ceremony year'},
        {name:'category',type:'text',desc:'Award category name'},
        {name:'movie',type:'text',desc:'Film title'},
        {name:'nominee',type:'text',desc:'Nominee name'},
        {name:'winner',type:'boolean',desc:'True if won'},
        {name:'movie',type:'object',desc:'Full embedded movie record'},
        {name:'ceremony',type:'object',desc:'Full embedded ceremony record'},
        {name:'category',type:'object',desc:'Full embedded category record'},
        {name:'nominee',type:'object',desc:'Full embedded nominee record'},
        {name:'song',type:'object',desc:'Full embedded song record (if applicable)'},
      ],
      example: '/api/nominations/4821',
    },
    {
      id: 'ep-ceremonies',
      method: 'GET',
      path: '/api/ceremonies',
      desc: 'All 97 ceremonies',
      params: [
        {name:'ids',type:'string',req:false,desc:'Comma-separated ceremony IDs'},
      ],
      fields: [
        {name:'id',type:'integer',desc:'Ceremony ID'},
        {name:'ceremony_year',type:'integer',desc:'Year of ceremony'},
        {name:'date',type:'date',desc:'Ceremony date'},
        {name:'show_title',type:'text',desc:'e.g. "97th Academy Awards"'},
        {name:'venue',type:'text',desc:'Venue name'},
        {name:'overview',type:'text',desc:'Summary of the ceremony'},
        {name:'movies_eligible',type:'text',desc:'Eligibility window description'},
        {name:'wikiurl',type:'text',desc:'Wikipedia URL'},
        {name:'moment_1_caption',type:'text',desc:'Highlight moment caption'},
        {name:'moment_1_img_url',type:'text',desc:'Highlight moment image URL'},
        {name:'moment_2_caption',type:'text',desc:'Highlight moment caption'},
        {name:'moment_2_img_url',type:'text',desc:'Highlight moment image URL'},
        {name:'moment_3_caption',type:'text',desc:'Highlight moment caption'},
        {name:'moment_3_img_url',type:'text',desc:'Highlight moment image URL'},
      ],
      example: '/api/ceremonies?ids=95,96,97',
    },
    {
      id: 'ep-movies',
      method: 'GET',
      path: '/api/movies',
      desc: 'Search nominated films',
      params: [
        {name:'title',type:'string',req:false,desc:'Partial match on film title'},
        {name:'tmdb_id',type:'integer',req:false,desc:'TMDB movie ID'},
        {name:'imdb_id',type:'string',req:false,desc:'IMDB ID e.g. tt1234567'},
        {name:'genre',type:'string',req:false,desc:'Filter by genre'},
        {name:'ids',type:'string',req:false,desc:'Comma-separated IDs'},
        {name:'page',type:'integer',req:false,desc:'Page number (default: 1)'},
        {name:'limit',type:'integer',req:false,desc:'Results per page (default: 25, max: 100)'},
      ],
      fields: [
        {name:'id',type:'integer',desc:'Movie ID'},
        {name:'title',type:'text',desc:'Film title'},
        {name:'tagline',type:'text',desc:'Film tagline'},
        {name:'overview',type:'text',desc:'Plot summary'},
        {name:'release_date',type:'date',desc:'Release date'},
        {name:'runtime',type:'integer',desc:'Runtime in minutes'},
        {name:'genres',type:'text[]',desc:'Array of genre names'},
        {name:'origin_country',type:'text[]',desc:'Array of ISO country codes'},
        {name:'tmdb_id',type:'integer',desc:'TMDB movie ID'},
        {name:'imdb_id',type:'text',desc:'IMDB ID'},
        {name:'poster_path',type:'text',desc:'Full poster image URL'},
        {name:'backdrop_path',type:'text',desc:'Full backdrop image URL'},
      ],
      example: '/api/movies?genre=Drama&limit=50',
    },
    {
      id: 'ep-movies-id',
      method: 'GET',
      path: '/api/movies/{id}',
      desc: 'Single movie with nominations',
      params: [],
      fields: [
        {name:'id',type:'integer',desc:'Movie ID'},
        {name:'title',type:'text',desc:'Film title'},
        {name:'overview',type:'text',desc:'Plot summary'},
        {name:'release_date',type:'date',desc:'Release date'},
        {name:'runtime',type:'integer',desc:'Runtime in minutes'},
        {name:'genres',type:'text[]',desc:'Array of genre names'},
        {name:'poster_path',type:'text',desc:'Full poster image URL'},
        {name:'backdrop_path',type:'text',desc:'Full backdrop image URL'},
        {name:'tmdb_id',type:'integer',desc:'TMDB movie ID'},
        {name:'imdb_id',type:'text',desc:'IMDB ID'},
        {name:'nominations',type:'array',desc:'All nominations for this film'},
      ],
      example: '/api/movies/3011',
    },
    {
      id: 'ep-nominees',
      method: 'GET',
      path: '/api/nominees',
      desc: 'Search nominees & filmmakers',
      params: [
        {name:'name',type:'string',req:false,desc:'Partial match on name'},
        {name:'tmdb_person_id',type:'integer',req:false,desc:'TMDB person ID'},
        {name:'imdb_id',type:'string',req:false,desc:'IMDB person ID'},
        {name:'known_for_department',type:'string',req:false,desc:'e.g. Acting, Directing'},
        {name:'ids',type:'string',req:false,desc:'Comma-separated IDs'},
        {name:'page',type:'integer',req:false,desc:'Page number (default: 1)'},
        {name:'limit',type:'integer',req:false,desc:'Results per page (default: 25, max: 100)'},
      ],
      fields: [
        {name:'id',type:'integer',desc:'Nominee ID'},
        {name:'name',type:'text',desc:'Full name'},
        {name:'biography',type:'text',desc:'Biographical text'},
        {name:'birthday',type:'date',desc:'Date of birth'},
        {name:'deathday',type:'date',desc:'Date of death (if applicable)'},
        {name:'place_of_birth',type:'text',desc:'City/country of birth'},
        {name:'known_for_department',type:'text',desc:'e.g. Acting, Directing'},
        {name:'homepage',type:'text',desc:'Official website URL'},
        {name:'tmdb_person_id',type:'integer',desc:'TMDB person ID'},
        {name:'imdb_id',type:'text',desc:'IMDB person ID'},
        {name:'profile_path',type:'text',desc:'Full profile photo URL'},
      ],
      example: '/api/nominees?known_for_department=Directing',
    },
    {
      id: 'ep-nominees-id',
      method: 'GET',
      path: '/api/nominees/{id}',
      desc: 'Single nominee with Oscar history',
      params: [],
      fields: [
        {name:'id',type:'integer',desc:'Nominee ID'},
        {name:'name',type:'text',desc:'Full name'},
        {name:'biography',type:'text',desc:'Biographical text'},
        {name:'birthday',type:'date',desc:'Date of birth'},
        {name:'deathday',type:'date',desc:'Date of death (if applicable)'},
        {name:'place_of_birth',type:'text',desc:'City/country of birth'},
        {name:'profile_path',type:'text',desc:'Full profile photo URL'},
        {name:'nominations',type:'array',desc:'Full Oscar nomination history'},
      ],
      example: '/api/nominees/1',
    },
    {
      id: 'ep-categories',
      method: 'GET',
      path: '/api/categories',
      desc: 'All 29 award categories',
      params: [
        {name:'category_name',type:'string',req:false,desc:'Partial match on category name'},
        {name:'category_group',type:'string',req:false,desc:'e.g. Acting, Craft, Direction'},
        {name:'ids',type:'string',req:false,desc:'Comma-separated IDs'},
      ],
      fields: [
        {name:'id',type:'integer',desc:'Category ID'},
        {name:'category_name',type:'text',desc:'e.g. "Best Picture"'},
        {name:'category_group',type:'text',desc:'e.g. "Acting", "Craft"'},
        {name:'definition',type:'text',desc:'Official category definition'},
        {name:'era',type:'text',desc:'Era or time period active'},
        {name:'history',type:'text',desc:'History of the category'},
      ],
      example: '/api/categories?category_group=Acting',
    },
    {
      id: 'ep-songs',
      method: 'GET',
      path: '/api/songs',
      desc: 'Nominated original songs',
      params: [
        {name:'title',type:'string',req:false,desc:'Partial match on song title'},
        {name:'artist',type:'string',req:false,desc:'Partial match on artist name'},
        {name:'year',type:'integer',req:false,desc:'Filter by Spotify year'},
        {name:'ids',type:'string',req:false,desc:'Comma-separated IDs'},
        {name:'page',type:'integer',req:false,desc:'Page number (default: 1)'},
        {name:'limit',type:'integer',req:false,desc:'Results per page (default: 25, max: 100)'},
      ],
      fields: [
        {name:'id',type:'integer',desc:'Song ID'},
        {name:'original_title',type:'text',desc:'Original song title'},
        {name:'artist_names',type:'text',desc:'Artist name(s)'},
        {name:'spotify_id',type:'text',desc:'Spotify track ID'},
        {name:'spotify_url',type:'text',desc:'Spotify track URL'},
        {name:'spotify_track_name',type:'text',desc:'Track name on Spotify'},
        {name:'spotify_album_name',type:'text',desc:'Album name on Spotify'},
        {name:'spotify_year',type:'integer',desc:'Release year on Spotify'},
      ],
      example: '/api/songs?artist=Billie+Eilish',
    },
    {
      id: 'ep-search',
      method: 'GET',
      path: '/api/search',
      desc: 'Full-text search across nominations',
      params: [
        {name:'q',type:'string',req:true,desc:'Search term (min 2 chars). Matches nominee, movie, category.'},
        {name:'winner',type:'boolean',req:false,desc:'Filter to winners or losers'},
        {name:'year',type:'integer',req:false,desc:'Filter by exact year'},
        {name:'yearStart',type:'integer',req:false,desc:'Start of year range'},
        {name:'yearEnd',type:'integer',req:false,desc:'End of year range'},
        {name:'page',type:'integer',req:false,desc:'Page number (default: 1)'},
        {name:'limit',type:'integer',req:false,desc:'Results per page (default: 25, max: 100)'},
      ],
      fields: [
        {name:'query',type:'string',desc:'The search term you passed in'},
        {name:'data',type:'array',desc:'Matching nomination records'},
        {name:'pagination',type:'object',desc:'Pagination metadata'},
      ],
      example: '/api/search?q=spielberg&winner=true&yearStart=1990',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --gold:#F5C542;--gold-dark:#C89118;--gold-light:#FFD86A;
          --bg:#0B0F17;--card:#141B26;--card-hover:#1D2635;
          --text:#F2F4F7;--text-muted:#A8B0BC;--border:#2E394A;
          --blue:#5FA8FF;--blue-light:#8CC3FF;
          --success:#39D98A;--error:#FF6B6B;
        }
        html,body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden}
        .pixel-grid{position:fixed;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:40px 40px;opacity:0.15;pointer-events:none;z-index:0}
        nav{position:sticky;top:0;z-index:100;background:rgba(11,15,23,0.95);border-bottom:1px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:64px;backdrop-filter:blur(8px)}
        .nav-logo{display:flex;align-items:center;gap:10px}
        .nav-logo img{height:36px;width:auto}
        .nav-badge{font-family:'Share Tech Mono',monospace;font-size:10px;background:var(--card);border:1px solid var(--border);color:var(--text-muted);padding:2px 8px;border-radius:2px}
        .nav-links{display:flex;align-items:center;gap:2rem}
        .nav-links a{color:var(--text-muted);text-decoration:none;font-size:14px;font-family:'Share Tech Mono',monospace;transition:color 0.2s}
        .nav-links a:hover{color:var(--blue)}
        .nav-cta{background:var(--gold);color:#0B0F17;font-weight:600;font-size:13px;padding:8px 18px;border-radius:2px;text-decoration:none;font-family:'Share Tech Mono',monospace;transition:background 0.2s}
        .nav-cta:hover{background:var(--gold-light)}
        .nav-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px}
        .nav-hamburger span{width:22px;height:2px;background:var(--text);border-radius:2px;transition:all 0.2s}
        .nav-mobile-menu{display:none;position:fixed;top:64px;left:0;right:0;background:rgba(11,15,23,0.98);border-bottom:1px solid var(--border);padding:16px 2rem;flex-direction:column;gap:16px;z-index:99;backdrop-filter:blur(8px)}
        .nav-mobile-menu.open{display:flex}
        .nav-mobile-menu a{color:var(--text-muted);text-decoration:none;font-size:14px;font-family:'Share Tech Mono',monospace;padding:8px 0;border-bottom:1px solid var(--border)}
        @media(max-width:700px){
          .nav-links{display:none}
          .nav-cta{display:none}
          .nav-badge{display:none}
          .nav-hamburger{display:flex}
        }
        .hero{position:relative;z-index:1;max-width:100%;margin:0 auto;text-align:center}
        .hero-inner{background:#000;padding:32px 2rem;width:100%;display:block}
        .hero-logo{display:flex;justify-content:center;margin-bottom:0}
        .hero-logo img{height:180px;width:auto;max-width:80%;object-fit:contain}
        .hero-below{max-width:1100px;margin:0 auto;padding:32px 2rem;text-align:center}
        .hero-subtitle{font-family:'Share Tech Mono',monospace;font-size:15px;color:var(--text-muted);max-width:560px;margin:0 auto 20px;line-height:1.6}
        @media(max-width:700px){
          .hero-logo img{height:120px;width:auto;max-width:90%}
          .hero-inner{padding:24px 1rem}
        }
        .hero-subtitle{font-family:'Share Tech Mono',monospace;font-size:15px;color:var(--text-muted);max-width:560px;margin:0 auto 20px;line-height:1.6}
        .hero-actions{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
        .btn-primary{background:var(--gold);color:#0B0F17;font-weight:700;font-size:14px;padding:14px 28px;border-radius:2px;text-decoration:none;font-family:'Share Tech Mono',monospace;transition:background 0.2s;display:inline-flex;align-items:center;gap:8px}
        .btn-primary:hover{background:var(--gold-light)}
        .btn-secondary{background:transparent;color:var(--text);font-size:14px;padding:13px 28px;border-radius:2px;text-decoration:none;font-family:'Share Tech Mono',monospace;border:1px solid var(--border);transition:all 0.2s;display:inline-flex;align-items:center;gap:8px}
        .btn-secondary:hover{border-color:var(--blue);color:var(--blue)}
        .terminal-demo{position:relative;z-index:1;max-width:700px;margin:48px auto;background:var(--card);border:1px solid var(--border);border-radius:4px;overflow:hidden}
        .terminal-bar{background:#1D2635;padding:10px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border)}
        .dot{width:10px;height:10px;border-radius:50%}
        .dot.red{background:#FF6B6B}.dot.yellow{background:#F5C542}.dot.green{background:#39D98A}
        .terminal-url{font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--text-muted);margin-left:8px}
        .terminal-body{padding:20px;font-family:'Share Tech Mono',monospace;font-size:13px;line-height:1.8}
        .t-method{color:var(--blue)}
        .t-path{color:var(--gold)}
        .t-key{color:var(--blue-light)}
        .t-string{color:var(--success)}
        .t-num{color:var(--gold)}
        .t-bool{color:#FF6B6B}
        .t-comment{color:var(--text-muted);opacity:0.6}
        .stats-bar{position:relative;z-index:1;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--card);padding:24px 2rem;display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap}
        .stat-item{text-align:center;padding:12px 40px;border-right:1px solid var(--border)}
        .stat-item:last-child{border-right:none}
        @media(max-width:700px){
          .stat-item{width:50%;border-right:none;border-bottom:1px solid var(--border);padding:16px 0}
          .stat-item:nth-child(odd):not(:last-child){border-right:1px solid var(--border)}
          .stat-item:last-child{border-bottom:none;width:100%}
        }
        .stat-num{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--gold);letter-spacing:2px}
        .stat-label{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-muted);letter-spacing:1px;margin-top:2px}
        .section{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:60px 2rem}
        .section-header{margin-bottom:40px}
        .section-eyebrow{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--blue);letter-spacing:3px;margin-bottom:12px}
        .section-title{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:2px;color:var(--text)}
        .section-title span{color:var(--gold)}
        .endpoints-grid{display:flex;flex-direction:column;gap:12px}
        .endpoint-card{background:var(--card);border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:border-color 0.2s}
        .endpoint-card:hover{border-color:var(--blue)}
        .endpoint-card.open{border-color:var(--blue)}
        .endpoint-header{padding:16px 20px;display:flex;align-items:center;gap:16px;cursor:pointer;user-select:none}
        .method-badge{font-family:'Share Tech Mono',monospace;font-size:11px;font-weight:700;padding:4px 10px;border-radius:2px;min-width:52px;text-align:center}
        .get{background:rgba(95,168,255,0.15);color:var(--blue);border:1px solid rgba(95,168,255,0.3)}
        .post{background:rgba(57,217,138,0.15);color:var(--success);border:1px solid rgba(57,217,138,0.3)}
        .patch{background:rgba(245,197,66,0.15);color:var(--gold);border:1px solid rgba(245,197,66,0.3)}
        .endpoint-path{font-family:'Share Tech Mono',monospace;font-size:14px;color:var(--text);flex:1}
        .endpoint-path .param{color:var(--gold)}
        .endpoint-desc{font-size:13px;color:var(--text-muted)}
        .endpoint-body{border-top:1px solid var(--border);padding:20px;display:none;background:#0d1219}
        .endpoint-card.open .endpoint-body{display:block}
        .params-table{width:100%;font-size:13px;border-collapse:collapse;margin-bottom:24px}
        .params-table th{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-muted);text-align:left;padding:6px 12px;letter-spacing:1px;border-bottom:1px solid var(--border)}
        .params-table td{padding:8px 12px;border-bottom:1px solid rgba(46,57,74,0.5);vertical-align:top}
        .params-table tr:last-child td{border-bottom:none}
        .param-name{font-family:'Share Tech Mono',monospace;color:var(--blue-light);display:block}
        .param-type{font-family:'Share Tech Mono',monospace;color:var(--text-muted);font-size:11px;display:block;margin-top:2px}
        .param-req{font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--error);background:rgba(255,107,107,0.1);padding:2px 6px;border-radius:2px}
        .param-opt{display:none}
        .block-label{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-muted);letter-spacing:2px;margin-bottom:8px}
        .code-block{background:var(--card);border:1px solid var(--border);border-radius:2px;padding:14px 16px;font-family:'Share Tech Mono',monospace;font-size:12px;line-height:1.8;overflow-x:auto;word-break:break-all;white-space:pre-wrap}
        .copy-url{cursor:pointer;color:var(--gold);transition:color 0.2s;border-bottom:1px dashed rgba(245,197,66,0.4)}
        .copy-url:hover{color:var(--gold-light)}
        .resources-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}
        .resource-card{background:var(--card);border:1px solid var(--border);border-radius:4px;padding:20px;transition:all 0.2s;cursor:pointer;text-decoration:none;display:block}
        .resource-card:hover{border-color:var(--gold);background:var(--card-hover)}
        .resource-icon{font-size:24px;margin-bottom:12px}
        .resource-name{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:var(--gold);margin-bottom:4px}
        .resource-count{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-muted)}
        .resource-desc{font-size:13px;color:var(--text-muted);margin-top:8px;line-height:1.5}
        .auth-box{background:var(--card);border:1px solid var(--border);border-radius:4px;padding:32px;margin-top:24px}
        .auth-box h3{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:1px;margin-bottom:12px;color:var(--gold)}
        footer{position:relative;z-index:1;border-top:1px solid var(--border);padding:32px 2rem;text-align:center}
        .footer-logo img{height:40px;width:auto;margin-bottom:12px}
        .footer-text{font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--text-muted)}
        .pixel-divider{height:4px;background:repeating-linear-gradient(90deg,var(--gold) 0,var(--gold) 8px,transparent 8px,transparent 16px);opacity:0.3;margin:0}
        .cursor{display:inline-block;width:8px;height:14px;background:var(--gold);animation:blink 1s infinite;vertical-align:middle;margin-left:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .endpoint-body{overflow-x:hidden}
        .params-table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch}
      @media(max-width:700px){
        .two-col{grid-template-columns:1fr}
        .endpoint-desc{display:none}
        .endpoint-header{flex-wrap:wrap;gap:8px}
        .endpoint-path{font-size:12px}
        .code-block{font-size:11px;overflow-x:auto;-webkit-overflow-scrolling:touch;word-break:break-all;white-space:pre-wrap}
      }
      `}</style>

      <div className="pixel-grid"></div>

<nav>
<div className="nav-logo">
  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:23,letterSpacing:2,color:'var(--gold)'}}>OSCARBASE</span>
  <div className="nav-badge">API v1.0</div>
</div>
  <div className="nav-links">
    <a href="#endpoints">Endpoints</a>
    <a href="#resources">Resources</a>
    <a href="#auth">Auth</a>
    <a href="#examples">Examples</a>
  </div>
  <a href="#endpoints" className="nav-cta">EXPLORE API →</a>
  <div className="nav-hamburger" onClick={(e) => {
    const menu = document.getElementById('mobile-menu')
    menu?.classList.toggle('open')
  }}>
    <span></span><span></span><span></span>
  </div>
</nav>
<div className="nav-mobile-menu" id="mobile-menu">
  <a href="#endpoints" onClick={() => document.getElementById('mobile-menu')?.classList.remove('open')}>Endpoints</a>
  <a href="#resources" onClick={() => document.getElementById('mobile-menu')?.classList.remove('open')}>Resources</a>
  <a href="#auth" onClick={() => document.getElementById('mobile-menu')?.classList.remove('open')}>Auth</a>
  <a href="#examples" onClick={() => document.getElementById('mobile-menu')?.classList.remove('open')}>Examples</a>
</div>

<div className="hero">
  <div className="hero-inner">
    <div className="hero-logo">
      <img src="/oscarbase-logo.png" alt="OscarBase" />
    </div>
  </div>
  <div className="hero-below">
    <p className="hero-subtitle">Complete Academy Awards data from 1929 to present. Every nomination, winner, film, and filmmaker — queryable in milliseconds.</p>
    <div className="hero-actions">
      <a href="#endpoints" className="btn-primary">ENDPOINTS →</a>
      <a href="#examples" className="btn-secondary">EXAMPLES →</a>
    </div>
  </div>
</div>

      <div className="terminal-demo">
        <div className="terminal-bar">
          <div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div>
          <span className="terminal-url">api.oscarbase.com</span>
        </div>
        <div className="terminal-body">
          <div><span className="t-method">GET</span> <span className="t-path">/api/nominations?nominee=Meryl+Streep&winner=true</span></div>
          <div className="t-comment">{'// Response 200 OK'}</div>
          <div>{'{'}</div>
          <div>&nbsp;&nbsp;<span className="t-key">&quot;data&quot;</span>: [{'{'} <span className="t-key">&quot;id&quot;</span>: <span className="t-num">4821</span>, <span className="t-key">&quot;ceremony_year&quot;</span>: <span className="t-num">2012</span>, <span className="t-key">&quot;category&quot;</span>: <span className="t-string">&quot;Best Actress&quot;</span>, <span className="t-key">&quot;winner&quot;</span>: <span className="t-bool">true</span> {'}'}],</div>
          <div>&nbsp;&nbsp;<span className="t-key">&quot;pagination&quot;</span>: {'{ '}<span className="t-key">&quot;total&quot;</span>: <span className="t-num">3</span>, <span className="t-key">&quot;page&quot;</span>: <span className="t-num">1</span>, <span className="t-key">&quot;totalPages&quot;</span>: <span className="t-num">1</span>{' }'}</div>
          <div>{'}'}<span className="cursor"></span></div>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item"><div className="stat-num">97</div><div className="stat-label">CEREMONIES</div></div>
        <div className="stat-item"><div className="stat-num">16K+</div><div className="stat-label">NOMINATIONS</div></div>
        <div className="stat-item"><div className="stat-num">8K+</div><div className="stat-label">NOMINEES</div></div>
        <div className="stat-item"><div className="stat-num">6</div><div className="stat-label">ENDPOINTS</div></div>
        <div className="stat-item"><div className="stat-num">FREE</div><div className="stat-label">OPEN ACCESS</div></div>
      </div>

      <div className="pixel-divider"></div>

      <div className="section" id="resources">
        <div className="section-header">
          <div className="section-eyebrow">DATABASE SCHEMA</div>
          <div className="section-title">SIX <span>RESOURCES</span></div>
        </div>
        <div className="resources-grid">
          {[
            {icon:'🎬',name:'Nominations',count:'~16,000 RECORDS',desc:'Central fact table. Every nomination ever made, filterable by year, category, winner, and more.',href:'#ep-nominations'},
            {icon:'🏛️',name:'Ceremonies',count:'97 RECORDS',desc:'Full ceremony metadata including venue, date, overview, and highlight moments.',href:'#ep-ceremonies'},
            {icon:'🎥',name:'Movies',count:'TMDB ENRICHED',desc:'Film metadata with posters, backdrops, genres, runtime, and IMDB/TMDB IDs.',href:'#ep-movies'},
            {icon:'⭐',name:'Nominees',count:'8,000+ RECORDS',desc:'Person metadata with biographies, birthdays, profile photos, and full Oscar history.',href:'#ep-nominees'},
            {icon:'🏆',name:'Categories',count:'29 RECORDS',desc:'All award categories with definitions, history, and groupings.',href:'#ep-categories'},
            {icon:'🎵',name:'Songs',count:'SPOTIFY ENRICHED',desc:'Nominated original songs with Spotify links, artist names, and album data.',href:'#ep-songs'},
          ].map(r => (
            <a key={r.name} href={r.href} className="resource-card">
              <div className="resource-icon">{r.icon}</div>
              <div className="resource-name">{r.name}</div>
              <div className="resource-count">{r.count}</div>
              <div className="resource-desc">{r.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="pixel-divider"></div>

      <div className="section" id="endpoints">
        <div className="section-header">
          <div className="section-eyebrow">COMPLETE REFERENCE</div>
          <div className="section-title">ALL <span>ENDPOINTS</span></div>
        </div>
        <div className="endpoints-grid">
          {endpoints.map(ep => (
            <div key={ep.id} className="endpoint-card" id={ep.id}>
              <div className="endpoint-header" onClick={toggle}>
                <span className={`method-badge get`}>{ep.method}</span>
                <span className="endpoint-path">{ep.path.replace('{id}', '').length < ep.path.length
                  ? <>{ep.path.split('{id}')[0]}<span className="param">{'{'+'id'+'}'}</span></>
                  : ep.path}
                </span>
                <span className="endpoint-desc">{ep.desc}</span>
              </div>
              <div className="endpoint-body">
                <div className="two-col">
                  <div>
                    {ep.params.length > 0 && (
                      <>
                      <div className="block-label" style={{marginBottom:8}}>QUERY PARAMETERS <span style={{fontFamily:'Inter,sans-serif',fontSize:11,color:'var(--text-muted)',letterSpacing:0,textTransform:'none',fontWeight:400}}>(all optional unless noted)</span></div>
                        <table className="params-table">
                        <thead><tr><th>PARAM</th><th>DESCRIPTION</th></tr></thead>
                        <tbody>
                          {ep.params.map(p => (
                            <tr key={p.name}>
                              <td>
                                <span className="param-name">{p.name}</span>
                                <span className="param-type">({p.type})</span>
                                {p.req && <span className="param-req">required</span>}
                              </td>
                              <td style={{color:'var(--text-muted)',fontSize:13}}>{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </>
                    )}
                    {ep.params.length === 0 && (
                      <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:16}}>No query parameters — just pass the ID in the URL path.</p>
                    )}
                  </div>
                  <div>
                    <div className="block-label" style={{marginBottom:8}}>RESPONSE FIELDS</div>
                    <table className="params-table">
                    <thead><tr><th>FIELD</th><th>DESCRIPTION</th></tr></thead>
                    <tbody>
                      {ep.fields.map(f => (
                        <tr key={f.name+f.type}>
                          <td>
                            <span className="param-name">{f.name}</span>
                            <span className="param-type">({f.type})</span>
                          </td>
                          <td style={{color:'var(--text-muted)',fontSize:13}}>{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
                <div style={{marginTop:16}}>
                  <div className="block-label">EXAMPLE REQUEST — click URL to copy</div>
                  <div className="code-block">
                    <span className="t-method">GET</span>{' '}
                    <span
                      className="copy-url"
                      onClick={(e) => copyUrl(e, ep.example)}
                    >
                      https://api.oscarbase.com{ep.example}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pixel-divider"></div>

      <div className="section" id="auth">
        <div className="section-header">
          <div className="section-eyebrow">WRITE ACCESS</div>
          <div className="section-title">AUTH<span>ENTICATION</span></div>
        </div>
        <div className="auth-box">
          <h3>READ ENDPOINTS — NO AUTH REQUIRED</h3>
          <p style={{fontSize:14,color:'var(--text-muted)',marginBottom:24,lineHeight:1.6}}>All GET endpoints are fully public. No API key needed. Rate limited to 100 requests per minute per IP.</p>
          <h3>WRITE ENDPOINTS — API KEY REQUIRED</h3>
          <p style={{fontSize:14,color:'var(--text-muted)',marginBottom:16,lineHeight:1.6}}>POST and PATCH endpoints require an API key passed in the request header:</p>
          <div className="code-block">
            <span className="t-method">POST</span> <span className="t-path">https://api.oscarbase.com/api/movies</span><br/>
            <span className="t-key">x-api-key</span>: <span className="t-string">your-secret-key</span><br/>
            <span className="t-key">Content-Type</span>: <span className="t-string">application/json</span><br/><br/>
            {'{'}<br/>
            &nbsp;&nbsp;<span className="t-key">&quot;title&quot;</span>: <span className="t-string">&quot;Anora&quot;</span>,<br/>
            &nbsp;&nbsp;<span className="t-key">&quot;tmdb_id&quot;</span>: <span className="t-num">1234567</span><br/>
            {'}'}
          </div>
        </div>
      </div>

      <div className="pixel-divider"></div>

      <div className="section" id="examples">
        <div className="section-header">
          <div className="section-eyebrow">COMMON QUERIES</div>
          <div className="section-title">EXAMPLE <span>REQUESTS</span></div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[
            {label:"ALL OF MERYL STREEP'S WINS", path:"/api/nominations?nominee=Meryl+Streep&winner=true"},
            {label:"BEST PICTURE WINNERS 1990s", path:"/api/nominations?category=Best+Picture&winner=true&yearStart=1990&yearEnd=1999"},
            {label:"FIND A MOVIE BY IMDB ID", path:"/api/movies?imdb_id=tt15398776"},
            {label:"SEARCH FOR SPIELBERG NOMINATIONS", path:"/api/search?q=spielberg&winner=true"},
            {label:"ALL NOMINATED SONGS BY BILLIE EILISH", path:"/api/songs?artist=Billie+Eilish"},
            {label:"FULL CEREMONY DETAIL", path:"/api/ceremonies/97"},
          ].map(ex => (
            <div key={ex.label} className="auth-box" style={{padding:'20px 24px'}}>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'var(--text-muted)',letterSpacing:2,marginBottom:12}}>{ex.label}</div>
              <div className="code-block">
                <span className="t-method">GET</span>{' '}
                <span className="copy-url" onClick={(e) => copyUrl(e, ex.path)}>
                  https://api.oscarbase.com{ex.path}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <div className="footer-logo"><img src="/oscarbase-logo.png" alt="OscarBase" /></div>
        <div className="footer-text">Oscar history for developers &nbsp;·&nbsp; api.oscarbase.com &nbsp;·&nbsp; Free & open access</div>
      </footer>
    </>
  )
}
