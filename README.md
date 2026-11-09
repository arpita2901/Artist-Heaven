# Art Heaven

**Art Heaven** is a creative web platform for artists to create profiles, share artwork, explore category-based galleries, discover other artists, and save inspiring work. It is built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**, styled with a **soft autumn palette**.

## Features

- **Email account UI** (`/login`) — sign up / log in flow. Local browser storage is used by default; real Gmail/Google login requires Supabase Auth configuration.
- **Artist profile** (`/profile`, *My Canvas*) — name, creative interest, bio, and profile picture. Profile details are visible, while editable **Settings** are owner-only and hidden behind a toggle.
- **Saved artwork (private)** — logged-in users can view saved works in a private section on their profile.
- **Artwork posting** (`/create`) — upload an image, add title/description, and choose a section (Photography, Alpona, Drawing, Painting, Craft, Digital Art, Writing, Other). Artists can delete their own posts.
- **Showcase by section** — profile/artist pages display artworks grouped by creative section.
- **Explore categories** (home page) — four curated creative worlds:
  - **Hue & Heart** — Visual & fine art (Drawing, Painting, Alpona, Craft)
  - **Pixel Bloom** — Design/graphics (Digital Art)
  - **Frame & Light** — Media/photography (Photography)
  - **Word & Wonder** — Writing
- **Category search** (`/category/[slug]`) — search by **artist name** (opens the artist profile) or by **art term** (e.g. `pencil sketch`) to filter matching artworks.
- **Artist profiles** (`/artist/[id]`) — view an artist’s public profile summary and artworks.
- **Engagement** — like/dislike reactions and save/unsave on artwork cards.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- React + TypeScript
- Tailwind CSS v4
- Optional: [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) for real auth, database, and storage

## Getting started

### 1. Install dependencies

```bash
npm install
```

> On Windows PowerShell, if script execution blocks `npm`, use:
> ```powershell
> cmd /c npm install
> cmd /c npm run dev
> ```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Note: This project uses `next dev --webpack` for compatibility with environments where Turbopack/SWC native bindings are unavailable.

## Optional: real backend with Supabase

The app includes local browser-based data handling for development/demo. For real multi-user features (shared accounts, profiles, uploads, feed, saves, reactions), connect Supabase:

1. Copy `.env.example` to `.env.local`.
2. Add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Configure **Supabase Auth** (enable Google provider for Gmail/Google login if desired).
4. Create database tables and storage buckets, then integrate them in `src/lib/app-store.tsx` / Supabase helpers.

### Suggested production schema

- `profiles`: `id` (auth user id), `name`, `email`, `interest`, `bio`, `avatar_url`
- `artworks`: `id`, `artist_id`, `title`, `section`, `description`, `image_url`, `likes`, `dislikes`, `created_at`
- `saved_artworks`: `user_id`, `artwork_id` (unique pair)
- `artwork_reactions`: `user_id`, `artwork_id`, `reaction` (`like`/`dislike`)

Use Supabase Storage for avatars/artwork images and apply Row Level Security (RLS) policies.

## Deployment

**GitHub** hosts the source code. For a full Next.js app with backend features, deploy the app on **Vercel** (or a similar platform) and use **Supabase** for auth/data/storage.

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial Art Heaven app"
git branch -M main
git remote add origin https://github.com/arpita2901/art-heaven.git
git push -u origin main
```

> Create the `art-heaven` repository on GitHub first (under `arpita2901`) if it doesn’t exist, then run the push command.

### Deploy on Vercel

1. Import the GitHub repository in [Vercel](https://vercel.com/new).
2. Set environment variables (if using Supabase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy.

## Project structure

```text
src/
  app/
    page.tsx                 # Home: hero + category exploration
    login/page.tsx           # Account UI
    profile/page.tsx         # My Canvas (profile, settings, saved artwork, showcase)
    create/page.tsx          # Post artwork
    category/[slug]/page.tsx # Category gallery + search
    artist/[id]/page.tsx     # Public artist profile
    saved/page.tsx           # Saved works
    layout.tsx
    globals.css
  components/
    nav.tsx
    art-card.tsx
  lib/
    app-store.tsx            # Local app state/data handling
    artists.ts               # Artist lookup helpers
    categories.ts            # Category config
    supabase.ts              # Optional Supabase client
    types.ts
    utils.ts
public/
  pic/                       # Images/logos/category assets
```

## Scripts

```bash
npm run dev    # Start development server (webpack)
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Author

- GitHub: [@arpita2901](https://github.com/arpita2901)
