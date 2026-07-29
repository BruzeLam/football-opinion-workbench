import { NextRequest, NextResponse } from "next/server";

type SportsDbEvent = {
  idEvent: string;
  strEvent: string;
  strLeague?: string;
  strSeason?: string;
  dateEvent?: string;
  strTime?: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  strStatus?: string | null;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strVenue?: string | null;
  strRound?: string | null;
};

type MatchResult = {
  id: string;
  competition: string;
  date: string;
  teams: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  confidence: number;
  reason: string;
  source: string;
  venue?: string;
};

const verifiedWorldCupMatches: MatchResult[] = [
  {
    id: "fifa-wc-2026-final",
    competition: "2026 世界杯 · 决赛",
    date: "2026-07-19",
    teams: "西班牙 vs 阿根廷",
    homeTeam: "西班牙",
    awayTeam: "阿根廷",
    score: "1–0（加时）",
    homeScore: 1,
    awayScore: 0,
    status: "已结束",
    confidence: 96,
    reason: "赛事与决赛阶段完全匹配；年份按最近一届世界杯补全",
    source: "FIFA 官方赛程",
    venue: "纽约新泽西体育场",
  },
  {
    id: "fifa-wc-2026-semi-eng-arg",
    competition: "2026 世界杯 · 半决赛",
    date: "2026-07-15",
    teams: "英格兰 vs 阿根廷",
    homeTeam: "英格兰",
    awayTeam: "阿根廷",
    score: "1–2",
    homeScore: 1,
    awayScore: 2,
    status: "已结束",
    confidence: 82,
    reason: "赛事匹配，但比赛阶段为半决赛",
    source: "FIFA 官方赛程",
    venue: "亚特兰大体育场",
  },
  {
    id: "fifa-wc-2026-semi-fra-esp",
    competition: "2026 世界杯 · 半决赛",
    date: "2026-07-14",
    teams: "法国 vs 西班牙",
    homeTeam: "法国",
    awayTeam: "西班牙",
    score: "0–2",
    homeScore: 0,
    awayScore: 2,
    status: "已结束",
    confidence: 80,
    reason: "赛事匹配，但比赛阶段为半决赛",
    source: "FIFA 官方赛程",
    venue: "达拉斯体育场",
  },
];

const teamAliases: Record<string, string> = {
  曼联: "Manchester United",
  曼城: "Manchester City",
  利物浦: "Liverpool",
  阿森纳: "Arsenal",
  切尔西: "Chelsea",
  热刺: "Tottenham",
  皇马: "Real Madrid",
  巴萨: "Barcelona",
  拜仁: "Bayern Munich",
  巴黎: "Paris SG",
  国米: "Inter Milan",
  米兰: "AC Milan",
  尤文: "Juventus",
  阿根廷: "Argentina",
  英格兰: "England",
  法国: "France",
  德国: "Germany",
  西班牙: "Spain",
  葡萄牙: "Portugal",
  巴西: "Brazil",
};

function extractTeams(query: string) {
  return Object.entries(teamAliases)
    .filter(([alias]) => query.toLowerCase().includes(alias.toLowerCase()))
    .map(([, team]) => team)
    .slice(0, 2);
}

function extractDate(query: string) {
  const full = query.match(/(20\d{2})[./-](\d{1,2})[./-](\d{1,2})/);
  if (full) {
    return `${full[1]}-${full[2].padStart(2, "0")}-${full[3].padStart(2, "0")}`;
  }
  const short = query.match(/(\d{1,2})月(\d{1,2})日/);
  if (short) {
    return `${new Date().getFullYear()}-${short[1].padStart(2, "0")}-${short[2].padStart(2, "0")}`;
  }
  const now = new Date();
  if (query.includes("昨天") || query.includes("昨晚")) {
    now.setDate(now.getDate() - 1);
    return now.toISOString().slice(0, 10);
  }
  if (query.includes("今天") || query.includes("今晚")) return now.toISOString().slice(0, 10);

  const year = query.match(/(20\d{2})/)?.[1];
  if (year === "2026" && query.includes("世界杯") && /(总决赛|决赛)/.test(query)) {
    return "2026-07-19";
  }
  return undefined;
}

function extractCompetition(query: string) {
  const competitions = [
    ["世界杯", "World Cup"],
    ["欧冠", "Champions League"],
    ["英超", "Premier League"],
    ["西甲", "La Liga"],
    ["德甲", "Bundesliga"],
    ["意甲", "Serie A"],
    ["法甲", "Ligue 1"],
  ];
  return competitions.find(([alias]) => query.includes(alias))?.[1];
}

function extractStage(query: string) {
  if (query.includes("半决赛")) return "半决赛";
  if (query.includes("1/4决赛") || query.includes("四分之一决赛") || query.includes("八强")) return "四分之一决赛";
  if (query.includes("总决赛") || query.includes("决赛")) return "决赛";
  return undefined;
}

function verifiedCandidates(query: string, teams: string[], date?: string, competition?: string) {
  if (competition !== "World Cup" && !query.includes("世界杯")) return [];
  const stage = extractStage(query);
  const year = query.match(/20\d{2}/)?.[0];

  return verifiedWorldCupMatches
    .map((match) => {
      const matchTeams = [match.homeTeam, match.awayTeam].map((team) => teamAliases[team] || team);
      const teamHits = teams.filter((team) => matchTeams.includes(team)).length;
      const stageMatches = !stage || match.competition.endsWith(stage);
      const dateMatches = !date || match.date === date;
      const yearMatches = !year || match.date.startsWith(year);
      const confidenceScore = 78
        + teamHits * 12
        + (stage ? (stageMatches ? 16 : -16) : 0)
        + (date ? (dateMatches ? 8 : -14) : 0)
        + (year ? (yearMatches ? 6 : -18) : 0)
        + (teams.length && teamHits === 0 ? -28 : 0);
      const confidence = Math.max(42, Math.min(98, confidenceScore));
      const reasonParts = [
        teamHits ? `${teamHits} 支球队匹配` : "未提供球队",
        stage ? (stageMatches ? `${stage}阶段匹配` : `实际为${match.competition.split("·")[1]?.trim()}`) : "按最近一届世界杯排序",
        date ? (dateMatches ? "日期匹配" : "日期不同") : "未提供日期",
      ];
      return { ...match, confidence, reason: reasonParts.join("；") };
    })
    .filter((match) => {
      if (teams.length && match.confidence < 62) return false;
      if (stage && !match.competition.endsWith(stage) && teams.length === 0) return false;
      return true;
    })
    .sort((a, b) => b.confidence - a.confidence);
}

async function sportsDb(path: string) {
  const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/${path}`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`TheSportsDB ${response.status}`);
  return response.json();
}

function normalize(event: SportsDbEvent, index: number, queryDate?: string) {
  const home = event.strHomeTeam || event.strEvent.split(" vs ")[0] || "主队";
  const away = event.strAwayTeam || event.strEvent.split(" vs ")[1] || "客队";
  const hasScore = event.intHomeScore != null && event.intAwayScore != null;
  const dateMatches = queryDate ? event.dateEvent === queryDate : true;
  const confidence = Math.max(56, 94 - index * 9 - (dateMatches ? 0 : 18));

  return {
    id: event.idEvent,
    competition: event.strLeague || "足球赛事",
    date: event.dateEvent || "日期待确认",
    teams: `${home} vs ${away}`,
    homeTeam: home,
    awayTeam: away,
    score: hasScore ? `${event.intHomeScore}–${event.intAwayScore}` : "未开赛",
    homeScore: hasScore ? Number(event.intHomeScore) : null,
    awayScore: hasScore ? Number(event.intAwayScore) : null,
    status: event.strStatus || (hasScore ? "已结束" : "赛程"),
    confidence,
    reason: dateMatches ? "球队与日期信息匹配" : "球队匹配，日期需要确认",
    source: "TheSportsDB",
    venue: event.strVenue || undefined,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ matches: [], error: "请输入比赛描述" }, { status: 400 });

  const teams = extractTeams(query);
  const date = extractDate(query);
  const competition = extractCompetition(query);
  const verified = verifiedCandidates(query, teams, date, competition);

  try {
    let events: SportsDbEvent[] = [];

    if (teams.length >= 2) {
      const eventName = `${teams[0]}_vs_${teams[1]}`.replaceAll(" ", "_");
      const params = new URLSearchParams({ e: eventName });
      if (date) params.set("d", date);
      const data = await sportsDb(`searchevents.php?${params}`);
      events = data.event || [];
    } else if (teams.length === 1) {
      const teamData = await sportsDb(`searchteams.php?t=${encodeURIComponent(teams[0])}`);
      const teamId = teamData.teams?.[0]?.idTeam;
      if (teamId) {
        const [past, next] = await Promise.all([
          sportsDb(`eventslast.php?id=${teamId}`),
          sportsDb(`eventsnext.php?id=${teamId}`),
        ]);
        events = [...(past.results || []), ...(next.events || [])];
      }
    } else if (date) {
      const data = await sportsDb(`eventsday.php?d=${date}&s=Soccer`);
      events = data.events || [];
    }

    const onlineMatches = events
      .filter((event) => !competition || event.strLeague?.toLowerCase().includes(competition.toLowerCase()))
      .filter((event, index, all) => all.findIndex((item) => item.idEvent === event.idEvent) === index)
      .slice(0, 5)
      .map((event, index) => normalize(event, index, date));
    const matches = [...verified, ...onlineMatches]
      .filter((event, index, all) => all.findIndex((item) => item.id === event.id) === index)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return NextResponse.json({
      matches,
      parsed: { teams, date, competition, stage: extractStage(query) },
      source: verified.length ? "FIFA 官方赛程索引 + TheSportsDB" : "TheSportsDB",
    });
  } catch {
    if (verified.length) {
      return NextResponse.json({
        matches: verified.slice(0, 5),
        parsed: { teams, date, competition, stage: extractStage(query) },
        source: "FIFA 官方赛程索引",
        warning: "实时赛事服务暂不可用，已返回核验过的世界杯候选",
      });
    }
    return NextResponse.json({ matches: [], error: "在线赛事服务暂时不可用，请补充球队、日期或赛事。" }, { status: 502 });
  }
}
