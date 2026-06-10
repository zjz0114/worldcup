import { NextRequest, NextResponse } from "next/server";

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
  { id: "uruguay", name: "Uruguay", flag: "🇺🇾" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "mexico", name: "Mexico", flag: "🇲🇽" },
  { id: "japan", name: "Japan", flag: "🇯🇵" },
  { id: "south_korea", name: "South Korea", flag: "🇰🇷" },
];

// In-memory storage
let votes: Record<string, number> = {};
let votedIps: Record<string, string> = {};

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
    const clientIp = getClientIp(request);
    const hasVoted = !!votedIps[clientIp];

    const rankings = TEAMS
      .map((team) => ({
        ...team,
        votes: votes[team.id] || 0,
        percentage: calculatePercentage(votes[team.id] || 0),
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      hasVoted,
      rankings,
      totalVotes,
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

    const clientIp = getClientIp(request);

    // Check if IP has already voted
    if (votedIps[clientIp]) {
      const votedTeam = TEAMS.find((t) => t.id === votedIps[clientIp]);
      return NextResponse.json({
        success: false,
        error: "You have already voted",
        hasVoted: true,
        votedTeam,
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
    votes[teamId] = (votes[teamId] || 0) + 1;
    votedIps[clientIp] = teamId;

    // Return updated rankings
    const rankings = TEAMS
      .map((t) => ({
        ...t,
        votes: votes[t.id] || 0,
        percentage: calculatePercentage(votes[t.id] || 0),
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      votedTeam: team,
      rankings,
      totalVotes,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}

function calculatePercentage(votes: number): number {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  return total > 0 ? (votes / total) * 100 : 0;
}
