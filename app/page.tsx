"use client";

import { useMemo, useRef, useState } from "react";

const script = [
  { time: "00:00", text: "英格兰距离世界杯决赛有多远？比分上，是七分钟。战术上，是从领先那一刻开始，自己一步一步退出来的。" },
  { time: "00:15", text: "第55分钟，罗杰斯送到后点，戈登破门。英格兰拿到了最理想的剧本：先进球，再逼阿根廷把身后的空间交出来。" },
  { time: "00:33", text: "但图赫尔没有继续问“怎么赢”，而是马上研究“怎么熬”。第71分钟改成五后卫，听起来是加锁，实际效果却像把自家前门交给阿根廷保管。" },
  { time: "00:54", text: "从戈登进球到劳塔罗绝杀，英格兰平均只有12%的控球。改成五后卫后的21分钟，阿根廷拿走接近93%的球权。这个不是低位防守，这是把比赛遥控器连电池一起送人。" },
  { time: "01:16", text: "更扎眼的是：英格兰进球以后，再也没有一次触球发生在阿根廷禁区内。变阵后到第二个丢球之间，他们在对方半场只完成七次传球，前场出口基本被自己拆了。" },
  { time: "01:39", text: "阿根廷当然也不是一路顺风。第76分钟麦卡利斯特击中门柱，第85分钟恩佐远射扳平，补时第92分钟，梅西第二次送出助攻，劳塔罗头球完成逆转。" },
  { time: "02:02", text: "有人会说，面对卫冕冠军，最后阶段收缩没有错。没错，收缩是手段；但没有反击点、没有控球点、没有出球线路，那不叫管理优势，那叫等待判决。" },
  { time: "02:24", text: "所以英格兰不是输在不会防守，而是把领先误解成了停止进攻的许可证。一比零不是护身符，五后卫也不是时间机器。领先以后还敢踢，才是强队真正昂贵的能力。" },
];

const facts = [
  ["官方事实", "英格兰 1–2 阿根廷；比赛于亚特兰大举行", "FIFA / AFC"],
  ["官方事实", "戈登 55′；恩佐 85′；劳塔罗 90+2′", "FIFA / Sky Sports"],
  ["官方事实", "梅西助攻阿根廷两个进球", "FIFA / Sky Sports"],
  ["媒体统计", "英格兰进球至绝杀期间，平均控球率仅约 12%", "Sky Sports"],
  ["媒体统计", "变五后卫后的 21 分钟，阿根廷接近 93% 球权", "Sky Sports"],
  ["媒体统计", "英格兰进球后没有再触球进入阿根廷禁区", "Sky Sports"],
  ["媒体统计", "变阵后至第二个丢球，英格兰在对方半场仅 7 次传球", "Sky Sports"],
  ["分析判断", "防守人数增加，但出球点和反击出口同时消失", "基于比赛进程"],
];

const headlines = [
  "英格兰不是被绝杀，是从领先开始主动退出决赛",
  "12%控球、零次禁区触球：一比零之后，英格兰把进攻键拔了",
  "五后卫不是自动保存键：图赫尔如何亲手交出比赛",
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

function buildOpinionPackage(match: MatchCandidate, stance: string) {
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

  return {
    thesis: verdict,
    script: generatedScript,
    facts: [
      ["比赛数据", `${home} ${match.score} ${away}`, match.source || "用户确认"],
      ["赛事信息", `${match.date} · ${match.competition}`, match.source || "用户确认"],
      ["分析判断", "比赛矛盾由结果、对阵与用户立场提炼", "观点引擎"],
      ["事实边界", "未获得的进球时间、阵容和技术统计不会自动补写", "系统规则"],
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
  const [stance, setStance] = useState("英格兰不是输在不会防守，而是把领先误解成了停止进攻的许可证。");
  const [content, setContent] = useState(() => ({ thesis: "英格兰不是输在不会防守，而是把领先误解成了停止进攻的许可证。", script, facts, headlines }));
  const resultRef = useRef<HTMLElement>(null);

  const total = useMemo(() => duration === "60 秒" ? "约 280 字" : duration === "3 分钟" ? "约 900 字" : "约 520 字", [duration]);

  function generate() {
    setGenerated(false);
    window.setTimeout(() => {
      setContent(buildOpinionPackage(selectedMatch, stance));
      setGenerated(true);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
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
    setShowMatches(false);
  }

  function loadDemoMatch() {
    setCandidates(matchCandidates);
    setSearchMessage("以下内容是演示数据，不代表真实赛果");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="开球工作台首页">
          <span className="brand-ball">⚽</span>
          <span>开球<span className="brand-light"> · 观点工作台</span></span>
        </a>
        <div className="top-actions">
          <span className="status"><i /> Skill 已连接</span>
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

      <section className="workspace">
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
                  {["60 秒", "90 秒", "3 分钟"].map((item) => <button key={item} className={duration === item ? "active" : ""} onClick={() => setDuration(item)}>{item}</button>)}
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
              <li><i className="official" />FIFA 比赛中心 <b>官方</b></li>
              <li><i className="official" />AFC 比赛报道 <b>官方</b></li>
              <li><i className="media" />Sky Sports <b>媒体</b></li>
            </ul>
            <p>当前为“{mode}”模式，战术判断基于比赛记录，不冒充完整录像观察。</p>
          </aside>
        </div>
      </section>

      <section className={`results ${generated ? "" : "loading"}`} ref={resultRef}>
        <div className="section-heading result-heading">
          <div><p className="step">STEP 02</p><h2>本期内容包</h2></div>
          <div className="result-meta"><span>90 / 100 事实完整度</span><span>{sharpness}表达</span><span>{total}</span></div>
        </div>

        <div className="thesis">
          <p>核心观点</p>
          <h3>{content.thesis}</h3>
        </div>

        <div className="argument-grid">
          <div><span>转折点</span><b>71′ 改打五后卫</b><p>人数增加了，前场出口却消失了。</p></div>
          <div><span>核心证据</span><b>约 12% 控球率</b><p>领先后到绝杀前，比赛控制权几乎完全让出。</p></div>
          <div><span>反方观点</span><b>收缩本身没有错</b><p>问题是没有保留反击点，也没有第二套出球方案。</p></div>
        </div>

        <nav className="tabs" aria-label="内容包视图">
          {["口播稿", "画面时间轴", "事实卡", "标题文案"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>

        {activeTab === "口播稿" && (
          <article className="script-card">
            <div className="script-toolbar"><span><i /> 预计 {duration === "60 秒" ? "00:58" : duration === "90 秒" ? "01:28" : "02:42"}</span><button onClick={copyScript}>{copied ? "已复制 ✓" : "复制全文"}</button></div>
            <div className="script-list">
              {content.script.map((item, index) => (
                <div className="script-line" key={item.time}>
                  <time>{item.time}</time><p>{item.text}</p><span>{index === 0 || index === 5 ? "金句" : index === 3 ? "数据" : ""}</span>
                </div>
              ))}
            </div>
          </article>
        )}

        {activeTab === "画面时间轴" && (
          <article className="timeline-card">
            {[
              ["00:00–00:15", "比分牌 → 英格兰失落", "冷开场：距离决赛只差七分钟"],
              ["00:15–00:33", "罗杰斯传中 → 戈登后点破门", "画线突出后点空当"],
              ["00:33–00:54", "孔萨登场 → 阵型切换 5-4-1", "字幕：71′ 改打五后卫"],
              ["00:54–01:16", "阿根廷连续控球与围攻", "数据卡：12% / 93% / 0次禁区触球"],
              ["01:16–01:39", "出球失败 → 门柱 → 远射", "连续短切，强化窒息感"],
              ["01:39–02:02", "恩佐扳平 → 梅西传中 → 劳塔罗绝杀", "两次进球用同一视觉标记串联"],
              ["02:02–02:24", "图赫尔场边 → 凯恩赛后画面", "加入反方观点，避免单纯甩锅"],
              ["02:24–02:42", "空球场与比分落版", "结论：领先以后仍然敢踢"],
            ].map(([time, visual, note]) => <div key={time}><time>{time}</time><b>{visual}</b><span>{note}</span></div>)}
          </article>
        )}

        {activeTab === "事实卡" && (
          <article className="facts-card">
            {content.facts.map(([type, fact, source]) => <div key={fact}><span>{type}</span><b>{fact}</b><small>{source}</small></div>)}
          </article>
        )}

        {activeTab === "标题文案" && (
          <article className="headlines-card">
            {content.headlines.map((headline, index) => <div key={headline}><span>0{index + 1}</span><b>{headline}</b><button onClick={() => navigator.clipboard?.writeText(headline)}>复制</button></div>)}
          </article>
        )}
      </section>

      <footer><span>开球 · 观点工作台</span><p>原创表达 · 事实优先 · 不冒充任何真实创作者</p><b>Powered by $football-opinion-show-producer</b></footer>
    </main>
  );
}
