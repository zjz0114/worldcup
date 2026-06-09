import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Teams data
const TEAMS = [
  { id: "brazil", name: "Brazil", flag: "🇧🇷" },
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "argentina", name: "Argentina", flag: "🇦🇷" },
  { id: "england", name: "England", flag: "🏴󠁧󠁢󠁳󠁿󠁯" },
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

// KV keys
const VOTES_KEY = "worldcup:votes";
const IPS_KEY = "worldcup:ips";
const LAST_UPDATED_KEY = "worldcup:lastUpdated";

// Helper function to read votes data from KV
async function readVotesData() {
  try {
    // Get votes from KV
    const votes = await kv.hgetall(VOTES_KEY) as Record<string, number> || {};

    // Get IPs from KV
    const ips = await kv.hgetall(IPS_KEY) as Record<string, string> || {};

    // Get last updated timestamp
    const lastUpdated = await kv.get(LAST_UPDATED_KEY) as string || new Date().toISOString();

    return {
      votes,
      ips,
      lastUpdated,
    };
  } catch (error) {
    console.error("Error reading from KV:", error);
    return {
      votes: {},
      ips: {},
      lastUpdated: new Date().toISOString(),
    };
  }
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
        percentage: Object.values(data.votes).reduce((a: number, b: number) => a + b, 0) > 0
          ? ((data.votes[team.id] || 0) / Object.values(data.votes).reduce((a: number, b: number) => a + b, 0)) * 100
          : 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = Object.values(data.votes).reduce((a: number, b: number) => a + b, 0);

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

    // Increment vote count for the team
    await kv.hincrby(VOTES_KEY, teamId, 1);

    // Record that this IP has voted
    await kv.hset(IPS_KEY, { [clientIp]: teamId });

    // Update last updated timestamp
    const now = new Date().toISOString();
    await kv.set(LAST_UPDATED_KEY, now);

    // Return updated rankings
    const updatedVotes = await kv.hgetall(VOTES_KEY) as Record<string, number>;
    const rankings = TEAMS
      .map((t) => ({
        ...t,
        votes: updatedVotes[t.id] || 0,
        percentage: Object.values(updatedVotes).reduce((a: number, b: number) => a + b, 0) > 0
          ? ((updatedVotes[t.id] || 0) / Object.values(updatedVotes).reduce((a: number, b: number) => a + b, 0)) * 100
          : 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = Object.values(updatedVotes).reduce((a: number, b: number) => a + b, 0);

    return NextResponse.json({
      success: true,
      votedTeam: team,
      rankings,
      totalVotes,
      lastUpdated: now,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
