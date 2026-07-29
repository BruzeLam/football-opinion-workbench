"use client";

import { useMemo, useRef, useState } from "react";

const script = [
  { time: "00:00", text: "英格兰距离世界杯决赛有多远？比分上，是七分钟。战术上，是从领先那一刻开始，自己一步一步退出来的。" },
  { time: "00:16", text: "第55分钟，戈登包抄破门。英格兰拿到了最理想的剧本：先进球，再逼阿根廷主动暴露空间。" },
  { time: "00:34", text: "结果图赫尔一看领先，立刻把比赛从“怎么赢”，改成了“怎么熬”。五后卫不是领先自动保存键。" },
  { time: "00:58", text: "英格兰进球以后，再也没有一次触球发生在阿根廷禁区内。不是没有射门，是连禁区都没再摸进去。" },
  { time: "01:24", text: "恩佐扳平，劳塔罗补时绝杀。阿根廷一直在找赢球的方法，英格兰却只顾着寻找终场哨。" },
  { time: "01:48", text: "一比零不是护身符，五后卫也不是时间机器。真正昂贵的能力，是领先以后仍然敢踢足球。" },
];

const facts = [
  ["官方事实", "英格兰 1–2 阿根廷", "FIFA / 英格兰足总"],
  ["官方事实", "戈登 55′；恩佐 85′；劳塔罗 90+3′", "英格兰足总"],
  ["媒体统计", "变阵后约 21 分钟，阿根廷接近 93% 球权", "Sky Sports"],
  ["分析判断", "撤掉推进点后，英格兰失去反击出口", "基于比赛记录"],
];

const headlines = [
  "英格兰不是被绝杀，是从领先开始主动退出决赛",
  "一比零之后，英格兰把进攻键拔了",
  "五后卫没守住七分钟：图赫尔到底在怕什么？",
];

export default function Home() {
  const [mode, setMode] = useState("资料锐评");
  const [duration, setDuration] = useState("90 秒");
  const [sharpness, setSharpness] = useState("犀利");
  const [generated, setGenerated] = useState(true);
  const [activeTab, setActiveTab] = useState("口播稿");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLElement>(null);

  const total = useMemo(() => duration === "60 秒" ? "约 280 字" : duration === "3 分钟" ? "约 900 字" : "约 520 字", [duration]);

  function generate() {
    setGenerated(false);
    window.setTimeout(() => {
      setGenerated(true);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
  }

  async function copyScript() {
    await navigator.clipboard?.writeText(script.map((item) => item.text).join("\n\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
          <div className="score-events"><span>戈登 55′</span><span>恩佐 85′ · 劳塔罗 90+3′</span></div>
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
            <label>比赛或话题</label>
            <div className="input-with-tag">
              <input defaultValue="2026.7.16 英格兰 vs 阿根廷｜世界杯半决赛" aria-label="比赛或话题" />
              <span>已识别</span>
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
            <textarea defaultValue="英格兰不是输在不会防守，而是把领先误解成了停止进攻的许可证。" aria-label="观点立场" />

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
            <div className="source-title"><span>✓</span><div><b>信息源已核验</b><small>4 条关键事实</small></div></div>
            <ul>
              <li><i className="official" />FIFA 比赛中心 <b>官方</b></li>
              <li><i className="official" />英格兰足总 <b>官方</b></li>
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
          <h3>英格兰不是输在不会防守，<br />而是把领先误解成了<span>停止进攻的许可证。</span></h3>
        </div>

        <nav className="tabs" aria-label="内容包视图">
          {["口播稿", "画面时间轴", "事实卡", "标题文案"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>

        {activeTab === "口播稿" && (
          <article className="script-card">
            <div className="script-toolbar"><span><i /> 预计 01:52</span><button onClick={copyScript}>{copied ? "已复制 ✓" : "复制全文"}</button></div>
            <div className="script-list">
              {script.map((item, index) => (
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
              ["00:00–00:16", "比分牌 → 英格兰庆祝", "字幕：距离决赛只差七分钟"],
              ["00:16–00:34", "戈登后点包抄进球", "突出罗杰斯传中线路"],
              ["00:34–00:58", "阵型后退 → 阿根廷围攻", "叠加“五后卫 / 93%球权”"],
              ["00:58–01:24", "连续扑救 → 恩佐扳平", "节奏提速，压缩空镜"],
              ["01:24–01:52", "劳塔罗绝杀 → 英格兰失落", "落版核心观点"],
            ].map(([time, visual, note]) => <div key={time}><time>{time}</time><b>{visual}</b><span>{note}</span></div>)}
          </article>
        )}

        {activeTab === "事实卡" && (
          <article className="facts-card">
            {facts.map(([type, fact, source]) => <div key={fact}><span>{type}</span><b>{fact}</b><small>{source}</small></div>)}
          </article>
        )}

        {activeTab === "标题文案" && (
          <article className="headlines-card">
            {headlines.map((headline, index) => <div key={headline}><span>0{index + 1}</span><b>{headline}</b><button onClick={() => navigator.clipboard?.writeText(headline)}>复制</button></div>)}
          </article>
        )}
      </section>

      <footer><span>开球 · 观点工作台</span><p>原创表达 · 事实优先 · 不冒充任何真实创作者</p><b>Powered by $football-opinion-show-producer</b></footer>
    </main>
  );
}
