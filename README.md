# World Cup 2026 Tracker

A World Cup 2026 tracker built with Next.js, featuring live standings, top scorers, team news, and player updates through embedded third-party websites.

## Features

- **📊 Standings Page** (`/standings`) - Live group standings from multiple data sources
- **⚽ Top Scorers Page** (`/top-scorers`) - Real-time goals and assists leaderboard
- **🏆 Team Dynamics** (`/team-dynamics`) - Latest team news and match analysis
- **🌟 Player Dynamics** (`/player-dynamics`) - Player performances, transfers, and updates
- **🔗 Data Source Switching** - Switch between multiple third-party websites

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Source**: Embedded third-party websites via iframe

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd worldcup
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
worldcup/
├── app/
│   ├── standings/page.tsx         # Standings page with iframe embedding
│   ├── top-scorers/page.tsx       # Top scorers page with iframe embedding
│   ├── team-dynamics/page.tsx     # Team blog page
│   ├── player-dynamics/page.tsx   # Player blog page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── nav.tsx                    # Navigation component
│   └── globals.css               # Global styles
├── public/                        # Static assets
└── README.md
```

## Available Data Sources

### Standings Page
- **FlashScore** - Real-time standings with detailed statistics
- **Soccerway** - Comprehensive tournament information
- **ESPN** - Official ESPN soccer standings
- **FIFA Official** - Official FIFA tournament page
- **Goal.com** - International coverage

### Top Scorers Page
- **FlashScore** - Top scorers with detailed statistics
- **WhoScored** - Player ratings and performance data
- **Transfermarkt** - Market value and statistics
- **Goal.com** - International top scorers list
- **ESPN** - ESPN player statistics

## Pages

### Home Page (`/`)
- Overview of all features
- Quick navigation to all sections
- World Cup 2026 information

### Standings Page (`/standings`)
- Multiple data source options
- iframe-embedded external websites
- "Open in new window" option for sources with cross-domain restrictions
- Loading indicators and error handling

### Top Scorers Page (`/top-scorers`)
- Multiple data source options
- Goals and assists leaderboard from external sites
- iframe embedding with fallback to new window

### Team Dynamics (`/team-dynamics`)
- Blog-style articles about teams
- Category filtering (Match Analysis, Team News, etc.)
- Full article view with detailed content
- Team flag icons

### Player Dynamics (`/player-dynamics`)
- Blog-style articles about players
- Category filtering (Match Performance, Transfers, Injuries)
- Full article view with detailed content
- Player profile icons

## Customization

### Adding New Data Sources

To add a new data source, edit the `dataSources` array in the respective page file:

**For Standings** (`app/standings/page.tsx`):
```typescript
const dataSources = [
  {
    id: "yoursite",
    name: "Your Site Name",
    url: "https://your-site.com/standings",
  },
  // ... existing sources
];
```

**For Top Scorers** (`app/top-scorers/page.tsx`):
```typescript
const dataSources = [
  {
    id: "yoursite",
    name: "Your Site Name",
    url: "https://your-site.com/top-scorers",
  },
  // ... existing sources
];
```

## Known Limitations

- Some websites may not load in iframe due to cross-domain restrictions (X-Frame-Options)
- For such sites, users can click "在新窗口打开" (Open in new window) to view directly
- Embedded content is subject to the third-party site's availability and terms

## Build for Production

```bash
npm run build
npm start
```

## License

[Your License]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
