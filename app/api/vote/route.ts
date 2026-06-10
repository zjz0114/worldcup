import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "votes.json");
const DATA_DIR = path.dirname(DATA_FILE);

// Type definitions
interface VotesData {
  votes: Record<string, number>;
  ips: Record<string, { team: string; timestamp: string }>;
  teams: typeof TEAMS;
  lastUpdated: string;
}

// Teams data
const TEAMS = [
  { id: "brazil", name: "Brazil", flag: "🇧🇷" },
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "argentina", name: "Argentina", flag: "🇦🇷" },
  { id: "england", name: "England", flag: "🏴󠁧󠁢󠁳󠁴󠁯" },
  { id: "spain", name: "Spain", flag: "🇪🇸" },
  { id: "germany", name: "Germany", flag: "🇩🇪" },
  { id: "portugal", name: "Portugal", flag: "🇵🇹" },
  { id: "netherlands", name: "Netherlands", flag: "🇳🇱" },
  { id: "italy", name: "Italy", flag: "🇮🇹" },
  { id: "belgium", name: "Belgium", flag: "🇧🇪" },
  { id: "croatia", name: "Croatia", flag: "🇭🇷" },
  { id: "uruguay", name: "Uruguay", flag: "🇺🇳" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "mexico", name: "Mexico", flag: "🇲🇱" },
  { id: "japan", name: "Japan", flag: "🇯🇵" },
  { id: "south_korea", name: "South Korea", flag: "🇰🇷" },
];

// Helper function to read votes data
async function readVotesData() {
  try {
    // Ensure data directory exists
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      votes: {},
      ips: {},
      teams: TEAMS,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Helper function to write votes data
async function writeVotesData(data: VotesData) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Get client IP address
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (ip) {
    return ip;
  }
  return "unknown";
}

// GET - Get voting results
export async function GET(request: NextRequest) {
  try {
    const data = await readVotesData();

    // Get IP to check if already voted
    const clientIp = getClientIp(request);
    const hasVoted = data.ips[clientIp];

    // Calculate rankings
    const rankings = TEAMS
      .map((team) => ({
        ...team,
        votes: data.votes[team.id] || 0,
        percentage: data.teams?.length > 0
          ? ((data.votes[team.id] || 0) / (Object.values(data.votes) as number[]).reduce((a: number, b: number) => a + b, 0) || 1) * 100
          : 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = (Object.values(data.votes) as number[]).reduce((a: number, b: number) => a + b, 0);

    return NextResponse.json({
      success: true,
      hasVoted,
      rankings,
      totalVotes,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error("Error reading votes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read votes" },
      { status: 500 }
    );
  }
}

// POST - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId } = body;

    if (!teamId) {
      return NextResponse.json(
        { success: false, error: "Team ID is required" },
        { status: 400 }
      );
    }

    const data = await readVotesData();
    const clientIp = getClientIp(request);

    // Check if IP has already voted
    if (data.ips[clientIp]) {
      return NextResponse.json({
        success: false,
        error: "You have already voted",
        hasVoted: true,
        votedTeam: data.ips[clientIp],
      });
    }

    // Check if team exists
    const team = TEAMS.find((t) => t.id === teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Invalid team" },
        { status: 400 }
      );
    }

    // Record the vote
    if (!data.votes[teamId]) {
      data.votes[teamId] = 0;
    }
    data.votes[teamId]++;

    // Record that this IP has voted
    data.ips[clientIp] = teamId;
    data.lastUpdated = new Date().toISOString();

    // Save to storage
    await writeVotesData(data);

    // Return updated rankings
    const rankings = TEAMS
      .map((t) => ({
        ...t,
        votes: data.votes[t.id] || 0,
        percentage: ((data.votes[t.id] || 0) / ((Object.values(data.votes) as number[]).reduce((a: number, b: number) => a + b, 0) || 1)) * 100,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = (Object.values(data.votes) as number[]).reduce((a: number, b: number) => a + b, 0);

    return NextResponse.json({
      success: true,
      votedTeam: team,
      rankings,
      totalVotes,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
