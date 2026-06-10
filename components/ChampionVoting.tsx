"use client";

import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  flag: string;
}

interface RankingTeam extends Team {
  votes: number;
  percentage: number;
}

interface VoteData {
  hasVoted: boolean;
  rankings: RankingTeam[];
  totalVotes: number;
}

const ALL_TEAMS: Team[] = [
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

export default function ChampionVoting() {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [userVote, setUserVote] = useState<Team | null>(null);

  useEffect(() => {
    fetchVoteData();
  }, []);

  const fetchVoteData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("/api/vote", { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success) {
        setVoteData({
          hasVoted: data.hasVoted,
          rankings: data.rankings,
          totalVotes: data.totalVotes,
        });
        setHasVoted(data.hasVoted);
      } else {
        throw new Error(data.error || "Failed to fetch vote data");
      }
    } catch (error) {
      console.error("Error fetching vote data:", error);
      setVoteData({
        hasVoted: false,
        rankings: ALL_TEAMS.map((team) => ({ ...team, votes: 0, percentage: 0 })),
        totalVotes: 0,
      });
      setHasVoted(false);
    }
  };

  const handleVote = async () => {
    if (!selectedTeam || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: selectedTeam }),
      });

      const data = await res.json();

      if (data.success) {
        const team = ALL_TEAMS.find((t) => t.id === selectedTeam);
        setUserVote(team || null);
        setHasVoted(true);
        setVoteData({
          hasVoted: true,
          rankings: data.rankings,
          totalVotes: data.totalVotes,
        });
      } else {
        // Already voted
        if (data.hasVoted) {
          const team = ALL_TEAMS.find((t) => t.id === data.votedTeam);
          setUserVote(team || null);
          setHasVoted(true);
        }
        alert(data.error || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBarColor = (index: number) => {
    const colors = [
      "from-yellow-400 to-yellow-500",
      "from-gray-300 to-gray-400",
      "from-amber-600 to-amber-700",
      "from-green-400 to-green-500",
      "from-blue-400 to-blue-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
      "from-cyan-400 to-cyan-500",
      "from-indigo-400 to-indigo-500",
      "from-teal-400 to-teal-500",
    ];
    return colors[index] || "from-gray-400 to-gray-500";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  if (hasVoted === null || !voteData) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin text-4xl">⚽</div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasVoted) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl"></div>

          <div className="text-center mb-6 relative">
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl animate-pulse">🏆</span>
              <span>Predict the Champion!</span>
              <span className="text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>🔮</span>
            </h2>
            <p className="text-purple-200/70 text-sm">Who will lift the 2026 World Cup trophy? One vote per person!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
            {ALL_TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`p-4 rounded-2xl transition-all duration-300 text-center ${
                  selectedTeam === team.id
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-105 shadow-xl shadow-purple-500/30"
                    : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30"
                }`}
              >
                <div className="text-3xl mb-2">{team.flag}</div>
                <div className={`text-sm font-medium ${selectedTeam === team.id ? "text-white" : "text-white/80"}`}>
                  {team.name}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center relative">
            <button
              onClick={handleVote}
              disabled={!selectedTeam || isSubmitting}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                selectedTeam
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl shadow-purple-500/30"
                  : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚽</span>
                  Submitting...
                </span>
              ) : (
                "Submit Your Vote!"
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-white/40 text-xs relative">
            {voteData.totalVotes > 0 && `${voteData.totalVotes} people have already voted`}
          </div>
        </div>
      </div>
    );
  }

  // Show results after voting
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl"></div>

        <div className="text-center mb-6 relative">
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
            Champion Predictions
          </h2>
          <div className="flex items-center justify-center gap-2 text-purple-200/70 text-sm">
            <span>{voteData.totalVotes} total votes</span>
            <span>•</span>
            <span>Your pick: {userVote?.flag} {userVote?.name}</span>
          </div>
        </div>

        <div className="space-y-3 relative">
          {voteData.rankings.map((team, index) => (
            <div
              key={team.id}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/20 transition-all"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="text-2xl w-8 text-center font-bold text-white/60">
                  {getRankIcon(index)}
                </div>
                <div className="text-3xl">{team.flag}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{team.name}</div>
                  <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getBarColor(index)} transition-all duration-1000`}
                      style={{ width: `${Math.max(team.percentage, 5)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">{team.votes}</div>
                  <div className="text-white/50 text-xs">{team.percentage.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userVote && (
          <div className="mt-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full">
              <span className="text-green-400">✓</span>
              <span className="text-green-300 text-sm">You voted for {userVote.flag} {userVote.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
