"use client";

import { useMemo, useRef, useState } from "react";

const script = [
  { time: "00:00", text: "英格兰距离世界杯决赛有多远？记分牌上，是七分钟；比赛逻辑上，他们从领先那一刻就开始往决赛门外走。最残酷的不是被绝杀，而是你能清楚看见一支球队怎样亲手缩小自己的生存空间。" },
  { time: "00:22", text: "第55分钟，罗杰斯右路低平球找到后点，戈登抢在莫利纳身前破门。这个进球证明英格兰原来的办法有效：前场有人跑、边路敢推进、阿根廷必须回头防。领先本来应该放大这套威胁，因为对手越着急，身后越容易留下空间。" },
  { time: "00:47", text: "可英格兰随后改变的，不只是一套阵型，而是整场比赛的交易方式。第71分钟孔萨登场，球队转成5-4-1。中路人数确实多了，但最前面的接应、持球和反击距离被一起拉断。五名后卫像多加了一层门板，却没人负责把不断飞回来的球运出屋子。" },
  { time: "01:13", text: "数据把这条因果链写得很直白：戈登进球到劳塔罗绝杀，英格兰平均控球率只有约12%；变成五后卫后的21分钟，阿根廷拿走接近93%的球权。低位防守可以让出球权，但不能让出每一次下一回合。英格兰的解围不是反击的起点，只是阿根廷下一轮进攻的开球仪式。" },
  { time: "01:40", text: "更致命的是出口消失：英格兰进球以后，在阿根廷禁区内再无触球；变阵到第二个丢球之间，对方半场只有七次传球，前场三区更只剩一次触球。当凯恩与中场之间隔着一整片无人区，阿根廷中卫不用后退，边后卫不用犹豫，梅西也不必为丢球后的转换风险付账。" },
  { time: "02:08", text: "于是警报不是突然响的，而是一遍遍预演。第69分钟皮克福德扑出冈萨雷斯的头球，第76分钟麦卡利斯特中柱；第85分钟，梅西参与短角球后横传，恩佐远射扳平；补时阶段麦卡利斯特再次击中门柱，梅西回收二点球，再用右脚把球送到后点，劳塔罗完成逆转。绝杀只是最后一张账单，消费早就开始了。" },
  { time: "02:37", text: "最强的反方意见是：面对卫冕冠军，又是世界杯半决赛，领先后收缩完全合理。确实，收缩不是原罪，图赫尔也解释说中路空当太大，需要增加制空和保护。但问题在于，防守从来不是“后卫数量加一”这么简单。没有出球点、没有反击威胁、没有让对手回头的理由，阵型越厚，承受的进攻次数反而越多。" },
  { time: "03:07", text: "这场失利真正刺痛英格兰的，是它又揭开了同一种大赛焦虑：领先以后，球队首先想到的不是怎样继续控制对手，而是怎样让时间赶紧消失。图赫尔换了，阵型换了，那个下意识却没有换。强队管理领先，不是把进攻键拔掉，而是让对手始终知道——你敢全压上，我仍然能让你付钱。英格兰缺的不是最后七分钟，缺的是领先后继续踢球的勇气和结构。" },
];

const facts = [
  { type: "官方事实", fact: "英格兰 1–2 阿根廷；比赛于亚特兰大举行", source: "FIFA / AFC", url: "https://www.fifa.com/en/articles/england-argentina-match-report-highlights" },
  { type: "官方事实", fact: "戈登 55′；恩佐 85′；劳塔罗 90+2′", source: "FIFA / Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "官方事实", fact: "梅西助攻阿根廷两个进球", source: "FIFA / Sky Sports", url: "https://www.fifa.com/en/articles/england-argentina-match-report-highlights" },
  { type: "比赛进程", fact: "69′ 皮克福德扑救；76′ 麦卡利斯特头球中柱", source: "FIFA / Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "比赛进程", fact: "绝杀前麦卡利斯特再次中柱，梅西回收二点后传中", source: "FIFA", url: "https://www.fifa.com/en/articles/england-argentina-match-report-highlights" },
  { type: "媒体统计", fact: "英格兰进球至绝杀期间，平均控球率仅约 12%", source: "Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "媒体统计", fact: "变五后卫后的 21 分钟，阿根廷接近 93% 球权", source: "Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "媒体统计", fact: "英格兰进球后没有再触球进入阿根廷禁区", source: "Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "媒体统计", fact: "变阵后至第二个丢球，英格兰在对方半场仅 7 次传球", source: "Sky Sports", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "赛后回应", fact: "图赫尔承认球队进球后过于被动；凯恩认为只想守住领先远远不够", source: "Sky Sports / BBC 赛后采访转引", url: "https://www.skysports.com/football/england-vs-argentina/549867" },
  { type: "分析判断", fact: "防守人数增加，但出球点、反击威胁与攻守转换同时消失", source: "编辑判断" },
];

const headlines = [
  "英格兰不是七分钟丢掉决赛，而是领先后主动退出比赛",
  "12%控球、零次禁区触球：英格兰的解围，只是阿根廷下一次进攻的开球",
  "五后卫为什么越守越危险？图赫尔切断了英格兰唯一的逃生通道",
];

type MatchCandidate = {
  id: string;
  competition: string;
  date: string;
  teams: string;
  score: string;
  status: string;
  confidence: number;
  reason: string;
  source?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
};

type ScriptLine = { time: string; text: string };
type FactItem = { type: string; fact: string; source: string; url?: string };
type ContentPackage = {
  thesis: string;
  script: ScriptLine[];
  facts: FactItem[];
  headlines: string[];
};

const durationIndexes: Record<string, number[]> = {
  "60 秒": [0, 3, 4, 7],
  "90 秒": [0, 1, 2, 3, 5, 7],
  "3 分钟": [0, 1, 2, 3, 4, 5, 6, 7],
};

function fitDuration(lines: ScriptLine[], duration: string) {
  const indexes = durationIndexes[duration] || durationIndexes["3 分钟"];
  const selected = indexes.map((index) => lines[index]).filter(Boolean);
  if (duration === "3 分钟") return selected;
  const step = duration === "60 秒" ? 18 : duration === "90 秒" ? 16 : 20;
  return selected.map((line, index) => ({
    ...line,
    time: `${String(Math.floor(index * step / 60)).padStart(2, "0")}:${String(index * step % 60).padStart(2, "0")}`,
  }));
}

const matchCandidates = [
  {
    id: "wc-2026-eng-arg",
    competition: "2026 世界杯 · 半决赛",
    date: "2026.07.15",
    teams: "英格兰 vs 阿根廷",
    score: "1–2",
    status: "已结束",
    confidence: 96,
    reason: "日期、双方球队、赛事阶段和赛果均已核验",
  },
  {
    id: "friendly-2025-eng-arg",
    competition: "国际友谊赛",
    date: "2025.10.11",
    teams: "英格兰 vs 阿根廷",
    score: "–",
    status: "历史赛程",
    confidence: 62,
    reason: "球队匹配，但日期与赛事阶段不一致",
  },
] satisfies MatchCandidate[];

function buildOpinionPackage(match: MatchCandidate, stance: string, duration: string): ContentPackage {
  const [fallbackHome, fallbackAway] = match.teams.split(" vs ");
  const home = match.homeTeam || fallbackHome || "主队";
  const away = match.awayTeam || fallbackAway || "客队";
  const scoreKnown = match.score !== "未开赛" && match.score !== "–";
  const verdict = stance.trim() || (
    scoreKnown
      ? `${home}和${away}踢出的不只是一场${match.score}，而是一堂“名气不能替你完成比赛”的公开课。`
      : `${home}对${away}，真正值得看的不是赛前声量，而是谁能先把计划变成行动。`
  );

  const generatedScript = [
    { time: "00:00", text: `${home}对${away}，先别急着复述比分。${verdict}` },
    { time: "00:15", text: `${match.competition}，${match.date}，${scoreKnown ? `最终比分${match.score}` : "比赛信息已经匹配"}。这是事实底座，下面才是观点。` },
    { time: "00:32", text: `${home}的问题，不一定是某一个人突然不会踢了，而是比赛一进入压力区，原来的计划就像临时搭的棚子——风还没大，先自己响起来了。` },
    { time: "00:55", text: `${away}也不是靠运气把结果捡回家。足球最诚实的地方就在这儿：你可以控制话题，但控制不了每一次二点球和每一次退防选择。` },
    { time: "01:18", text: `当然，单场比赛不能给一支球队判终身。但“偶然”如果每次都穿着同一件衣服出现，那就该检查衣柜，而不是继续怪天气。` },
    { time: "01:42", text: `${verdict} 下一场可以换人、换阵，最难换掉的，是球队在关键时刻下意识选择的那条路。` },
  ];

  const paddedScript = [...generatedScript, generatedScript[4], generatedScript[5]];
  return {
    thesis: verdict,
    script: fitDuration(paddedScript, duration),
    facts: [
      { type: "比赛数据", fact: `${home} ${match.score} ${away}`, source: match.source || "用户确认" },
      { type: "赛事信息", fact: `${match.date} · ${match.competition}`, source: match.source || "用户确认" },
      { type: "分析判断", fact: "比赛矛盾由结果、对阵与用户立场提炼", source: "观点引擎" },
      { type: "事实边界", fact: "未获得的进球时间、阵容和技术统计不会自动补写", source: "系统规则" },
    ],
    headlines: [
      `${home}对${away}：比分只是结果，选择才是答案`,
      `${match.score}之后，最该复盘的不是运气`,
      `别急着找战犯，这场球的问题比一个人更大`,
    ],
  };
}

export default function Home() {
  const [mode, setMode] = useState("资料锐评");
  const [duration, setDuration] = useState("3 分钟");
  const [sharpness, setSharpness] = useState("犀利");
  const [generated, setGenerated] = useState(true);
  const [activeTab, setActiveTab] = useState("口播稿");
  const [copied, setCopied] = useState(false);
  const [matchQuery, setMatchQuery] = useState("2026.7.15 英格兰 vs 阿根廷｜世界杯半决赛");
  const [selectedMatch, setSelectedMatch] = useState<MatchCandidate>(matchCandidates[0]);
  const [candidates, setCandidates] = useState<MatchCandidate[]>(matchCandidates);
  const [showMatches, setShowMatches] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [stance, setStance] = useState("英格兰输掉的不只是最后七分钟，而是领先后继续控制比赛的勇气与结构。");
  const [contentKind, setContentKind] = useState<"旗舰样片" | "AI 初稿" | "演示数据">("旗舰样片");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<ContentPackage>(() => ({
    thesis: "英格兰输掉的不只是最后七分钟，而是领先后继续控制比赛的勇气与结构。",
    script: fitDuration(script, "3 分钟"),
    facts,
    headlines,
  }));
  const resultRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);

  const total = useMemo(() => duration === "60 秒" ? "约 280 字" : duration === "3 分钟" ? "约 900 字" : "约 520 字", [duration]);

  function generate() {
    setGenerated(false);
    window.setTimeout(() => {
      setContent(buildOpinionPackage(selectedMatch, stance, duration));
      setContentKind(selectedMatch.id === "wc-2026-eng-arg" ? "旗舰样片" : "AI 初稿");
      setGenerated(true);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
  }

  function changeDuration(nextDuration: string) {
    setDuration(nextDuration);
    if (contentKind === "旗舰样片") {
      setContent((current) => ({ ...current, script: fitDuration(script, nextDuration) }));
    } else {
      setContent(buildOpinionPackage(selectedMatch, stance, nextDuration));
    }
  }

  function openFlagship() {
    setSelectedMatch(matchCandidates[0]);
    setMatchQuery("2026.7.15 英格兰 vs 阿根廷｜世界杯半决赛");
    setContent({
      thesis: "英格兰输掉的不只是最后七分钟，而是领先后继续控制比赛的勇气与结构。",
      script: fitDuration(script, duration),
      facts,
      headlines,
    });
    setContentKind("旗舰样片");
    setActiveTab("口播稿");
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function updateScriptLine(index: number, text: string) {
    setContent((current) => ({
      ...current,
      script: current.script.map((line, lineIndex) => lineIndex === index ? { ...line, text } : line),
    }));
  }

  function removeScriptLine(index: number) {
    setContent((current) => ({ ...current, script: current.script.filter((_, lineIndex) => lineIndex !== index) }));
  }

  function rewriteScriptLine(index: number) {
    setContent((current) => ({
      ...current,
      script: current.script.map((line, lineIndex) => lineIndex === index
        ? { ...line, text: `${line.text.replace(/[。！]$/, "")}。换句话说，比分能遮住问题一晚，比赛内容不会替任何人长期保密。` }
        : line),
    }));
  }

  async function copyScript() {
    await navigator.clipboard?.writeText(content.script.map((item) => item.text).join("\n\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function findMatch() {
    setShowMatches(true);
    setSearching(true);
    setSearchMessage("");
    try {
      const response = await fetch(`/api/matches/search?q=${encodeURIComponent(matchQuery)}`);
      const data = await response.json();
      if (response.ok && data.matches?.length) {
        setCandidates(data.matches);
        setSearchMessage(`已从 ${data.source} 获取真实赛程`);
      } else {
        setCandidates([]);
        setSearchMessage(data.error || "没有找到可信的真实比赛，请补充球队、日期或赛事");
      }
    } catch {
      setCandidates([]);
      setSearchMessage("在线匹配暂不可用，你可以稍后重试或载入演示比赛");
    } finally {
      setSearching(false);
    }
  }

  function selectMatch(candidate: MatchCandidate) {
    setSelectedMatch(candidate);
    setMatchQuery(`${candidate.date} ${candidate.teams}｜${candidate.competition}`);
    setContentKind(candidate.id === "wc-2026-eng-arg" ? "旗舰样片" : "AI 初稿");
    setShowMatches(false);
  }

  function loadDemoMatch() {
    setCandidates(matchCandidates);
    setSearchMessage("以下内容是演示数据，不代表真实赛果");
    setContentKind("演示数据");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="开球工作台首页">
          <span className="brand-ball">⚽</span>
          <span>开球<span className="brand-light"> · 观点工作台</span></span>
        </a>
        <div className="top-actions">
          <span className="status"><i /> 观点引擎已就绪</span>
          <button className="ghost-button">历史内容 <span>⌄</span></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="pitch-markings" aria-hidden="true"><i /><b /></div>
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> 足球观点短视频生产器</p>
          <h1>把一场比赛，<br />变成一个<span>有力的观点。</span></h1>
          <p className="hero-description">核验事实，提炼矛盾，生成有节奏的原创中文足球口播。<br />不是复述比分，是解释比赛为什么会变成这样。</p>
          <div className="hero-tags">
            <span>事实有出处</span><span>观点够鲜明</span><span>口播能落地</span>
          </div>
          <div className="hero-actions">
            <button className="primary-cta" onClick={openFlagship}>体验旗舰样片 <b>→</b></button>
            <button className="secondary-cta" onClick={() => workspaceRef.current?.scrollIntoView({ behavior: "smooth" })}>输入我的比赛</button>
          </div>
        </div>
        <aside className="score-card">
          <div className="score-top"><span>2026 世界杯 · 半决赛</span><b>FT</b></div>
          <div className="teams">
            <div><span className="flag england">＋</span><strong>英格兰</strong></div>
            <p><b>1</b><em>:</em><b>2</b></p>
            <div><span className="flag argentina">☀</span><strong>阿根廷</strong></div>
          </div>
          <div className="score-events"><span>戈登 55′</span><span>恩佐 85′ · 劳塔罗 90+2′</span></div>
          <div className="verdict">“领先以后，他们停止了踢球。”</div>
        </aside>
      </section>

      <section className="workspace" ref={workspaceRef}>
        <div className="section-heading">
          <div><p className="step">STEP 01</p><h2>设置这期内容</h2></div>
          <p>输入最少信息，剩下的交给观点引擎。</p>
        </div>

        <div className="builder">
          <div className="form-card">
            <label>用一句话描述比赛 <span className="optional">日期、球队、赛事写不全也可以</span></label>
            <div className="match-finder">
              <div className="input-with-tag">
                <input
                  value={matchQuery}
                  onChange={(event) => {
                    setMatchQuery(event.target.value);
                    setShowMatches(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && findMatch()}
                  placeholder="例如：昨晚阿根廷那场半决赛"
                  aria-label="比赛或话题"
                />
                <button onClick={findMatch}>自动匹配</button>
              </div>

              {showMatches && (
                <div className="match-results" aria-live="polite">
                  <div className="match-results-head">
                    <div><b>{searching ? "正在搜索真实比赛" : `找到 ${candidates.length} 场可能的比赛`}</b><span>按匹配度排序</span></div>
                    <button onClick={() => setShowMatches(false)} aria-label="关闭候选比赛">×</button>
                  </div>
                  {searching && <div className="match-loading">正在识别球队、日期和赛事…</div>}
                  {!searching && searchMessage && <div className="match-message">{searchMessage}</div>}
                  {!searching && candidates.length === 0 && (
                    <div className="no-match">
                      <b>没有可确认的比赛</b>
                      <span>建议补充球队名称、完整日期或赛事阶段。</span>
                      <button onClick={loadDemoMatch}>载入演示比赛</button>
                    </div>
                  )}
                  {!searching && candidates.map((candidate, index) => (
                    <button className="match-option" key={candidate.id} onClick={() => selectMatch(candidate)}>
                      <span className="match-rank">0{index + 1}</span>
                      <span className="match-main">
                        <small>{candidate.date} · {candidate.competition}</small>
                        <b>{candidate.teams} <em>{candidate.score}</em></b>
                        <small>{candidate.reason}</small>
                      </span>
                      <span className={`confidence ${candidate.confidence > 80 ? "high" : ""}`}>
                        <b>{candidate.confidence}%</b>
                        <small>匹配度</small>
                      </span>
                    </button>
                  ))}
                  <p>没找到？可以补充大致日期、主客队或赛事名称后重新匹配。</p>
                </div>
              )}

              {!showMatches && selectedMatch && (
                <div className="matched-game">
                  <span>✓ 已匹配</span>
                  <div><b>{selectedMatch.teams}</b><small>{selectedMatch.date} · {selectedMatch.competition}</small></div>
                  <strong>{selectedMatch.confidence}%</strong>
                  <button onClick={findMatch}>更换</button>
                </div>
              )}
            </div>

            <div className="form-row">
              <div>
                <label>工作模式</label>
                <div className="segmented">
                  {["资料锐评", "录像复盘", "混合生产"].map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}
                </div>
              </div>
              <div>
                <label>目标时长</label>
                <div className="segmented compact">
                  {["60 秒", "90 秒", "3 分钟"].map((item) => <button key={item} className={duration === item ? "active" : ""} onClick={() => changeDuration(item)}>{item}</button>)}
                </div>
              </div>
            </div>

            <label>我的立场 <span className="optional">可选，不填则自动提炼</span></label>
            <textarea value={stance} onChange={(event) => setStance(event.target.value)} aria-label="观点立场" />

            <div className="form-row bottom-row">
              <div>
                <label>表达锐度</label>
                <div className="sharpness">
                  {["克制", "犀利", "高强度"].map((item) => <button key={item} className={sharpness === item ? "active" : ""} onClick={() => setSharpness(item)}>{item}</button>)}
                </div>
              </div>
              <button className="generate" onClick={generate}><span>生成本期内容</span><b>→</b></button>
            </div>
          </div>

          <aside className="source-card">
            <div className="source-title"><span>✓</span><div><b>信息源已核验</b><small>8 条关键事实</small></div></div>
            <ul>
              <li><i className="official" /><a href="https://www.fifa.com/en/articles/england-argentina-match-report-highlights" target="_blank" rel="noreferrer">FIFA 比赛中心 ↗</a><b>官方</b></li>
              <li><i className="official" /><a href="https://www.the-afc.com/en/national/fifa_world_cup.html/news/s-final-messis-argentina-stun-england-in-comeback" target="_blank" rel="noreferrer">AFC 比赛报道 ↗</a><b>官方</b></li>
              <li><i className="media" /><a href="https://www.skysports.com/football/england-vs-argentina/549867" target="_blank" rel="noreferrer">Sky Sports ↗</a><b>媒体</b></li>
            </ul>
            <p>当前为“{mode}”模式，战术判断基于比赛记录，不冒充完整录像观察。</p>
          </aside>
        </div>
      </section>

      <section className={`results ${generated ? "" : "loading"}`} ref={resultRef}>
        <div className="section-heading result-heading">
          <div><p className="step">STEP 02</p><h2>本期内容包</h2></div>
          <div className="result-meta"><span className={`content-kind kind-${contentKind}`}>{contentKind}</span><span>90 / 100 事实完整度</span><span>{sharpness}表达</span><span>{total}</span></div>
        </div>

        <div className="thesis">
          <p>核心观点</p>
          <h3>{content.thesis}</h3>
        </div>

        <div className="argument-grid">
          <div><span>结构断点</span><b>71′ 转为 5-4-1</b><p>中路人数增加，前场接应与转换线路却同时断开。</p></div>
          <div><span>因果证据</span><b>93% 球权 + 7 次传球</b><p>解围无法变成控球，阿根廷得以连续发动下一回合。</p></div>
          <div><span>最强反方</span><b>半决赛领先，收缩合理</b><p>但收缩不等于撤掉全部反击威胁；防守也需要让对手付出风险。</p></div>
        </div>

        <nav className="tabs" aria-label="内容包视图">
          {["口播稿", "画面时间轴", "事实卡", "标题文案", "编辑策略"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>

        {activeTab === "口播稿" && (
          <article className="script-card">
            <div className="script-toolbar">
              <span><i /> 预计 {duration === "60 秒" ? "00:58" : duration === "90 秒" ? "01:28" : "03:35"} · {content.script.reduce((sum, item) => sum + item.text.length, 0)} 字</span>
              <div><button onClick={() => setEditing((value) => !value)}>{editing ? "完成编辑" : "在线编辑"}</button><button onClick={copyScript}>{copied ? "已复制 ✓" : "复制全文"}</button></div>
            </div>
            <div className="script-list">
              {content.script.map((item, index) => (
                <div className={`script-line ${editing ? "is-editing" : ""}`} key={`${item.time}-${index}`}>
                  <time>{item.time}</time>
                  {editing ? <textarea value={item.text} onChange={(event) => updateScriptLine(index, event.target.value)} aria-label={`编辑第 ${index + 1} 段口播`} /> : <p>{item.text}</p>}
                  {editing ? <span className="line-actions"><button onClick={() => rewriteScriptLine(index)}>改写</button><button onClick={() => removeScriptLine(index)}>删除</button></span> : <span>{index === 0 || index === 5 ? "金句" : index === 3 ? "数据" : ""}</span>}
                </div>
              ))}
            </div>
          </article>
        )}

        {activeTab === "画面时间轴" && (
          <article className="timeline-card">
            {[
              ["00:00–00:22", "比分牌 → 英格兰失落", "冷开场：七分钟只是表象，退出控制才是原因"],
              ["00:22–00:47", "罗杰斯传中 → 戈登后点破门", "画线展示原方案为何有效，以及领先后的反击空间"],
              ["00:47–01:13", "孔萨登场 → 阵型切换 5-4-1", "冻结画面：后卫增加，凯恩与中场连接断开"],
              ["01:13–01:40", "阿根廷连续回收二点并再次组织", "数据卡：12% / 93%，用循环箭头表现“解围即重开”"],
              ["01:40–02:08", "英格兰长传丢失 → 阿根廷中卫压上", "数据卡：零次禁区触球 / 对方半场仅七次传球"],
              ["02:08–02:37", "扑救 → 两次门柱 → 扳平 → 绝杀", "按时间递进警报，说明绝杀并非偶然突发"],
              ["02:37–03:07", "图赫尔与凯恩赛后画面", "呈现收缩的合理性，再拆解执行上的结构代价"],
              ["03:07–03:35", "英格兰近年大赛节点 → 空球场落版", "结论：强队管理领先，必须保留让对手回头的能力"],
            ].map(([time, visual, note]) => <div key={time}><time>{time}</time><b>{visual}</b><span>{note}</span></div>)}
          </article>
        )}

        {activeTab === "事实卡" && (
          <article className="facts-card">
            {content.facts.map(({ type, fact, source, url }) => <div key={fact}><span>{type}</span><b>{fact}</b><small>{url ? <a href={url} target="_blank" rel="noreferrer">{source} ↗</a> : source}</small></div>)}
          </article>
        )}

        {activeTab === "标题文案" && (
          <article className="headlines-card">
            {content.headlines.map((headline, index) => <div key={headline}><span>0{index + 1}</span><b>{headline}</b><button onClick={() => navigator.clipboard?.writeText(headline)}>复制</button></div>)}
          </article>
        )}

        {activeTab === "编辑策略" && (
          <article className="strategy-card">
            <header><span>为什么这样写</span><h3>不是堆情绪，而是先让事实站稳，再把矛盾推到台前。</h3></header>
            <div className="strategy-grid">
              <section><b>01 · 冷开场</b><p>先给结果与代价，不绕背景，让观众在前五秒知道“这场球为什么值得讲”。</p></section>
              <section><b>02 · 单一矛盾</b><p>把复杂比赛压缩成“领先后是否还敢踢”，保证口播有一条清晰主线。</p></section>
              <section><b>03 · 证据递进</b><p>换人、控球、射门、进球按因果排序；数据不是装饰，而是观点的承重墙。</p></section>
              <section><b>04 · 给反方出口</b><p>承认收缩本身合理，再指出执行缺陷，避免把锐评写成情绪宣判。</p></section>
              <section><b>05 · 原创表达</b><p>借鉴强节奏足球评论的方法，不复刻任何真实创作者的口头禅或身份。</p></section>
            </div>
          </article>
        )}
      </section>

      <footer><span>开球 · 观点工作台</span><p>原创表达 · 事实优先 · 不冒充任何真实创作者</p><b>观点引擎 · MVP</b></footer>
    </main>
  );
}
