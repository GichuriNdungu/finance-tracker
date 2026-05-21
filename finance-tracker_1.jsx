import { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const MC = [
  { name: "Living", icon: "🏠", color: "#4ECDC4" },
  { name: "Lifestyle", icon: "✨", color: "#E8913A" },
  { name: "Transport", icon: "🏍️", color: "#60A5FA" },
  { name: "Miscellaneous", icon: "📦", color: "#A78BFA" },
];
const SC = {
  Living: [
    { name: "Living - Groceries", short: "Groceries", color: "#2DD4BF" },
    { name: "Living - Utilities", short: "Utilities", color: "#4ECDC4" },
    { name: "Living - House Supplies", short: "House Supplies", color: "#14B8A6" },
    { name: "Living - House Furniture", short: "House Furniture", color: "#0D9488" },
  ],
  Lifestyle: [
    { name: "Lifestyle - Date night", short: "Date Night", color: "#F59E0B" },
    { name: "Lifestyle - Beers", short: "Beers", color: "#E8913A" },
    { name: "Lifestyle - Eat Out", short: "Eat Out", color: "#D97706" },
    { name: "Lifestyle - Small treat", short: "Small Treat", color: "#FBBF24" },
    { name: "Lifestyle - Entertainment", short: "Entertainment", color: "#F97316" },
    { name: "Lifestyle - Sports", short: "Sports", color: "#EA580C" },
    { name: "Financial - Investments", short: "Investments", color: "#B45309" },
    { name: "Financial - Savings", short: "Savings", color: "#92400E" },
    { name: "Financial - Church Tithe", short: "Church Tithe", color: "#78350F" },
    { name: "Living - House Furniture", short: "House Furniture", color: "#0D9488" },
  ],
  Transport: [
    { name: "Transport - Moto Ride", short: "Moto Ride", color: "#60A5FA" },
    { name: "Transport - Move Ride", short: "Move Ride", color: "#3B82F6" },
  ],
  Miscellaneous: [
    { name: "Miscellanous - Unplanned purchase", short: "Unplanned Purchase", color: "#A78BFA" },
  ],
};
const ST = [
  { name: "Necessary (Unavoidable)", short: "Necessary", color: "#4ECDC4", icon: "✅" },
  { name: "Social/Relationship", short: "Social", color: "#60A5FA", icon: "💙" },
  { name: "Investment (future-focused)", short: "Investment", color: "#34D399", icon: "📈" },
  { name: "Impulse", short: "Impulse", color: "#FBBF24", icon: "⚡" },
  { name: "Regret (I wish I hadn't)", short: "Regret", color: "#FF6B6B", icon: "😔" },
  { name: "Planned (Budgeted)", short: "Planned", color: "#A78BFA", icon: "📋" },
];
const MOMO = ["MTN MoMo", "Airtel Money"];
const SK = "momo-finance-v2";
function gid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmt(n) { return new Intl.NumberFormat("en-RW").format(n) + " RWF"; }
function gwk(d) { const dt = new Date(d), s = new Date(dt.getFullYear(), 0, 1); return Math.ceil(((dt - s) / 864e5 + s.getDay() + 1) / 7); }
function pk(d) { const dt = new Date(d); return { day: dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), week: "W" + gwk(dt), month: dt.toLocaleDateString("en-US", { month: "short", year: "numeric" }) }; }
async function ld() { try { const r = await window.storage.get(SK); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function sv(d) { try { await window.storage.set(SK, JSON.stringify(d)); } catch (e) { console.error(e); } }

const SEED = [{"id":"imp0","amount":15000,"category":"Miscellaneous","subCategory":"Miscellanous - Unplanned purchase","spendingType":"Necessary (Unavoidable)","note":"Monitor charger","momoType":"MTN MoMo","date":"2026-02-23","recipient":"Monitor charger","txType":"payment"},{"id":"imp1","amount":2600,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Ugali flour","momoType":"MTN MoMo","date":"2026-02-23","recipient":"Ugali flour","txType":"payment"},{"id":"imp2","amount":5200,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Rugali Coffee","momoType":"MTN MoMo","date":"2026-02-23","recipient":"Rugali Coffee","txType":"payment"},{"id":"imp3","amount":3000,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-02-23","recipient":"Moto ride","txType":"payment"},{"id":"imp4","amount":25000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Wifi","momoType":"MTN MoMo","date":"2026-02-24","recipient":"Wifi","txType":"payment"},{"id":"imp5","amount":7000,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Social/Relationship","note":"Beers","momoType":"MTN MoMo","date":"2026-02-24","recipient":"Beers","txType":"payment"},{"id":"imp6","amount":11000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Gas","momoType":"MTN MoMo","date":"2026-02-25","recipient":"Gas","txType":"payment"},{"id":"imp7","amount":4700,"category":"Living","subCategory":"Living - House Supplies","spendingType":"Necessary (Unavoidable)","note":"Toilet paper and water","momoType":"MTN MoMo","date":"2026-02-26","recipient":"Toilet paper and water","txType":"payment"},{"id":"imp8","amount":1600,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Social/Relationship","note":"Sambusa","momoType":"MTN MoMo","date":"2026-02-26","recipient":"Sambusa","txType":"payment"},{"id":"imp9","amount":2300,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Rice","momoType":"MTN MoMo","date":"2026-02-26","recipient":"Rice","txType":"payment"},{"id":"imp10","amount":1000,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Social/Relationship","note":"Moto","momoType":"MTN MoMo","date":"2026-02-26","recipient":"Moto","txType":"payment"},{"id":"imp11","amount":5500,"category":"Lifestyle","subCategory":"Lifestyle - Beers","spendingType":"Social/Relationship","note":"Beers","momoType":"MTN MoMo","date":"2026-02-27","recipient":"Beers","txType":"payment"},{"id":"imp12","amount":1350,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Social/Relationship","note":"Water and soda","momoType":"MTN MoMo","date":"2026-02-28","recipient":"Water and soda","txType":"payment"},{"id":"imp13","amount":1500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Investment (future-focused)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-01","recipient":"Moto ride","txType":"payment"},{"id":"imp14","amount":5000,"category":"Lifestyle","subCategory":"Financial - Investments","spendingType":"Investment (future-focused)","note":"Car commisioner ride","momoType":"MTN MoMo","date":"2026-03-01","recipient":"Car commisioner ride","txType":"payment"},{"id":"imp15","amount":1500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Investment (future-focused)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-01","recipient":"Moto ride","txType":"payment"},{"id":"imp16","amount":500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Investment (future-focused)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-01","recipient":"Moto ride","txType":"payment"},{"id":"imp17","amount":2500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-02","recipient":"Moto ride","txType":"payment"},{"id":"imp18","amount":4000,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Necessary (Unavoidable)","note":"Samosas","momoType":"MTN MoMo","date":"2026-03-02","recipient":"Samosas","txType":"payment"},{"id":"imp19","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Mtn data","momoType":"MTN MoMo","date":"2026-03-02","recipient":"Mtn data","txType":"payment"},{"id":"imp20","amount":1700,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-02","recipient":"Moto ride","txType":"payment"},{"id":"imp21","amount":3000,"category":"Lifestyle","subCategory":"Lifestyle - Small treat","spendingType":"Social/Relationship","note":"Ice cream date","momoType":"MTN MoMo","date":"2026-03-02","recipient":"Ice cream date","txType":"payment"},{"id":"imp22","amount":5000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Electricity","momoType":"MTN MoMo","date":"2026-03-03","recipient":"Electricity","txType":"payment"},{"id":"imp23","amount":12000,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Social/Relationship","note":"Nigerian food","momoType":"MTN MoMo","date":"2026-03-04","recipient":"Nigerian food","txType":"payment"},{"id":"imp24","amount":17700,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Groceries","momoType":"MTN MoMo","date":"2026-03-05","recipient":"Groceries","txType":"payment"},{"id":"imp25","amount":1000,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-05","recipient":"Moto ride","txType":"payment"},{"id":"imp26","amount":5300,"category":"Living","subCategory":"Lifestyle - Small treat","spendingType":"Impulse","note":"Eggs and samosa","momoType":"MTN MoMo","date":"2026-03-05","recipient":"Eggs and samosa","txType":"payment"},{"id":"imp27","amount":6500,"category":"Lifestyle","subCategory":"Lifestyle - Entertainment","spendingType":"Necessary (Unavoidable)","note":"Colgate and condoms","momoType":"MTN MoMo","date":"2026-03-05","recipient":"Colgate and condoms","txType":"payment"},{"id":"imp28","amount":9200,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"Cofee and sandwich","momoType":"MTN MoMo","date":"2026-03-10","recipient":"Cofee and sandwich","txType":"payment"},{"id":"imp29","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Data","momoType":"MTN MoMo","date":"2026-03-10","recipient":"Data","txType":"payment"},{"id":"imp30","amount":2700,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-10","recipient":"Moto ride","txType":"payment"},{"id":"imp31","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Data","momoType":"MTN MoMo","date":"2026-03-09","recipient":"Data","txType":"payment"},{"id":"imp32","amount":7500,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Regret (I wish I hadn't)","note":"Crisps","momoType":"MTN MoMo","date":"2026-03-09","recipient":"Crisps","txType":"payment"},{"id":"imp33","amount":2500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-07","recipient":"Moto ride","txType":"payment"},{"id":"imp34","amount":11000,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Regret (I wish I hadn't)","note":"Wine","momoType":"MTN MoMo","date":"2026-03-07","recipient":"Wine","txType":"payment"},{"id":"imp35","amount":3000,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-07","recipient":"Moto ride","txType":"payment"},{"id":"imp36","amount":10000,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Social/Relationship","note":"Wine","momoType":"MTN MoMo","date":"2026-03-06","recipient":"Wine","txType":"payment"},{"id":"imp37","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Data","momoType":"MTN MoMo","date":"2026-03-06","recipient":"Data","txType":"payment"},{"id":"imp38","amount":800,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"moto ride","momoType":"MTN MoMo","date":"2026-03-11","recipient":"moto ride","txType":"payment"},{"id":"imp39","amount":500,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"groceries","momoType":"MTN MoMo","date":"2026-03-11","recipient":"groceries","txType":"payment"},{"id":"imp40","amount":17900,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"take out","momoType":"MTN MoMo","date":"2026-03-11","recipient":"take out","txType":"payment"},{"id":"imp41","amount":5000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Electricity","momoType":"MTN MoMo","date":"2026-03-12","recipient":"Electricity","txType":"payment"},{"id":"imp42","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Social/Relationship","note":"data","momoType":"MTN MoMo","date":"2026-03-12","recipient":"data","txType":"payment"},{"id":"imp43","amount":1500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"moto ride","momoType":"MTN MoMo","date":"2026-03-12","recipient":"moto ride","txType":"payment"},{"id":"imp44","amount":1700,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-12","recipient":"Moto ride","txType":"payment"},{"id":"imp45","amount":20000,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"Eat Out","momoType":"MTN MoMo","date":"2026-03-12","recipient":"Eat Out","txType":"payment"},{"id":"imp46","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Impulse","note":"data","momoType":"MTN MoMo","date":"2026-03-13","recipient":"data","txType":"payment"},{"id":"imp47","amount":2000,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Necessary (Unavoidable)","note":"Moto ride","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Moto ride","txType":"payment"},{"id":"imp48","amount":13500,"category":"Lifestyle","subCategory":"Living - House Furniture","spendingType":"Planned (Budgeted)","note":"Water Heater","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Water Heater","txType":"payment"},{"id":"imp49","amount":95000,"category":"Living","subCategory":"Living - House Furniture","spendingType":"Planned (Budgeted)","note":"Air fryer","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Air fryer","txType":"payment"},{"id":"imp50","amount":5700,"category":"Living","subCategory":"Living - House Furniture","spendingType":"Planned (Budgeted)","note":"Air Fryer Papers","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Air Fryer Papers","txType":"payment"},{"id":"imp51","amount":21250,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Groceries","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Groceries","txType":"payment"},{"id":"imp52","amount":28000,"category":"Transport","subCategory":"Transport - Move Ride","spendingType":"Necessary (Unavoidable)","note":"Move Ride","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Move Ride","txType":"payment"},{"id":"imp53","amount":1500,"category":"Transport","subCategory":"Transport - Moto Ride","spendingType":"Social/Relationship","note":"moto ride","momoType":"MTN MoMo","date":"2026-03-13","recipient":"moto ride","txType":"payment"},{"id":"imp54","amount":1500,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"Sambusa","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Sambusa","txType":"payment"},{"id":"imp55","amount":22500,"category":"Lifestyle","subCategory":"Lifestyle - Beers","spendingType":"Social/Relationship","note":"Beers and Eat Out","momoType":"MTN MoMo","date":"2026-03-13","recipient":"Beers and Eat Out","txType":"payment"},{"id":"imp56","amount":15000,"category":"Transport","subCategory":"Transport - Move Ride","spendingType":"Social/Relationship","note":"Move ride","momoType":"MTN MoMo","date":"2026-03-14","recipient":"Move ride","txType":"payment"},{"id":"imp57","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"data","momoType":"MTN MoMo","date":"2026-03-14","recipient":"data","txType":"payment"},{"id":"imp58","amount":13400,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"Vuba Eat out","momoType":"MTN MoMo","date":"2026-03-14","recipient":"Vuba Eat out","txType":"payment"},{"id":"imp59","amount":3000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Data","momoType":"MTN MoMo","date":"2026-03-15","recipient":"Data","txType":"payment"},{"id":"imp60","amount":2800,"category":"Lifestyle","subCategory":"Lifestyle - Date night","spendingType":"Impulse","note":"Eat Out","momoType":"MTN MoMo","date":"2026-03-15","recipient":"Eat Out","txType":"payment"},{"id":"imp61","amount":8300,"category":"Living","subCategory":"Living - Utilities","spendingType":"Impulse","note":"Groceries","momoType":"MTN MoMo","date":"2026-03-15","recipient":"Groceries","txType":"payment"},{"id":"imp62","amount":648000,"category":"Lifestyle","subCategory":"Living - House Furniture","spendingType":"Planned (Budgeted)","note":"Skyworth TV","momoType":"MTN MoMo","date":"2026-03-16","recipient":"Skyworth TV","txType":"payment"},{"id":"imp63","amount":20000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Planned (Budgeted)","note":"Electricity","momoType":"MTN MoMo","date":"2026-03-16","recipient":"Electricity","txType":"payment"},{"id":"imp64","amount":3000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"Data","momoType":"MTN MoMo","date":"2026-03-16","recipient":"Data","txType":"payment"},{"id":"imp65","amount":7000,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Groceries","momoType":"MTN MoMo","date":"2026-03-16","recipient":"Groceries","txType":"payment"},{"id":"imp66","amount":15000,"category":"Living","subCategory":"Living - House Furniture","spendingType":"Necessary (Unavoidable)","note":"water heater installment","momoType":"MTN MoMo","date":"2026-03-17","recipient":"water heater installment","txType":"payment"},{"id":"imp67","amount":11100,"category":"Lifestyle","subCategory":"Lifestyle - Eat Out","spendingType":"Impulse","note":"eat out","momoType":"MTN MoMo","date":"2026-03-17","recipient":"eat out","txType":"payment"},{"id":"imp68","amount":2000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"data","momoType":"MTN MoMo","date":"2026-03-17","recipient":"data","txType":"payment"},{"id":"imp69","amount":35200,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"groceries","momoType":"MTN MoMo","date":"2026-03-18","recipient":"groceries","txType":"payment"},{"id":"imp70","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"data","momoType":"MTN MoMo","date":"2026-03-19","recipient":"data","txType":"payment"},{"id":"imp71","amount":11600,"category":"Lifestyle","subCategory":"Lifestyle - Beers","spendingType":"Social/Relationship","note":"eat out","momoType":"MTN MoMo","date":"2026-03-19","recipient":"eat out","txType":"payment"},{"id":"imp72","amount":1000,"category":"Living","subCategory":"Living - Utilities","spendingType":"Necessary (Unavoidable)","note":"data","momoType":"MTN MoMo","date":"2026-03-20","recipient":"data","txType":"payment"},{"id":"imp73","amount":31900,"category":"Living","subCategory":"Living - Groceries","spendingType":"Necessary (Unavoidable)","note":"Groceries","momoType":"MTN MoMo","date":"2026-03-20","recipient":"Groceries","txType":"payment"}];

const SCREENS = { HOME: 0, ADD: 1, DASH: 2, INSIGHTS: 3, LIST: 4 };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [txs, setTxs] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ld().then(d => {
      setTxs(d && d.transactions && d.transactions.length > 0 ? d.transactions : SEED);
      setBudget(d ? d.budget || 0 : 0);
      setLoaded(true);
    });
  }, []);

  useEffect(() => { if (loaded) sv({ transactions: txs, budget }); }, [txs, budget, loaded]);
  const addTx = useCallback(t => { setTxs(p => [t, ...p]); setScreen(SCREENS.HOME); }, []);
  const delTx = useCallback(id => { setTxs(p => p.filter(t => t.id !== id)); }, []);

  if (!loaded) {
    return (
      <div style={S.loader}>
        <div style={S.spin} />
      </div>
    );
  }

  return (
    <div style={S.shell}>
      <div style={S.content}>
        {screen === SCREENS.HOME && <Home txs={txs} budget={budget} setBudget={setBudget} />}
        {screen === SCREENS.ADD && <Add onAdd={addTx} onBack={() => setScreen(SCREENS.HOME)} />}
        {screen === SCREENS.DASH && <Dash txs={txs} />}
        {screen === SCREENS.INSIGHTS && <Insights txs={txs} />}
        {screen === SCREENS.LIST && <ListScreen txs={txs} onDelete={delTx} />}
      </div>
      <Nav screen={screen} set={setScreen} />
    </div>
  );
}

function Nav({ screen, set }) {
  const items = [
    { id: SCREENS.HOME, icon: "⌂", label: "Home" },
    { id: SCREENS.ADD, icon: "＋", label: "Record", special: true },
    { id: SCREENS.DASH, icon: "◐", label: "Trends" },
    { id: SCREENS.INSIGHTS, icon: "◈", label: "Insights" },
    { id: SCREENS.LIST, icon: "☰", label: "History" },
  ];
  return (
    <nav style={S.nav}>
      {items.map(i => (
        <button key={i.id} onClick={() => set(i.id)} style={S.navBtn}>
          <span style={{ fontSize: i.special ? 26 : 20, lineHeight: 1, ...(i.special ? S.addIcon : {}), color: screen === i.id ? "#E8913A" : "#64748B" }}>{i.icon}</span>
          <span style={{ fontSize: 9, marginTop: 2, letterSpacing: 0.6, fontWeight: 600, color: screen === i.id ? "#E8913A" : "#64748B" }}>{i.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Home({ txs, budget, setBudget }) {
  const [editB, setEditB] = useState(false);
  const [bInput, setBInput] = useState("");
  const now = new Date();
  const month = txs.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const today = txs.filter(t => new Date(t.date).toDateString() === now.toDateString());
  const totalM = month.reduce((s, t) => s + t.amount, 0);
  const totalT = today.reduce((s, t) => s + t.amount, 0);
  const allTotal = txs.reduce((s, t) => s + t.amount, 0);
  const pct = budget > 0 ? Math.min((totalM / budget) * 100, 100) : 0;
  const rem = budget - totalM;
  const mainBreak = useMemo(() => {
    const m = {};
    txs.forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return MC.map(c => ({ ...c, amount: m[c.name] || 0 })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [txs]);
  const spendBreak = useMemo(() => {
    const m = {};
    txs.forEach(t => { m[t.spendingType] = (m[t.spendingType] || 0) + t.amount; });
    return ST.map(s => ({ ...s, amount: m[s.name] || 0 })).filter(s => s.amount > 0);
  }, [txs]);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <span style={{ fontSize: 28 }}>💰</span>
        <div>
          <div style={S.hTitle}>MoMo Tracker</div>
          <div style={S.hSub}>{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
      </div>
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={S.cardLbl}>Monthly Budget</span>
          <button onClick={() => { setEditB(!editB); setBInput(String(budget || "")); }} style={S.editBtn}>{editB ? "✕" : "✎"}</button>
        </div>
        {editB ? (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input type="number" value={bInput} onChange={e => setBInput(e.target.value)} placeholder="e.g. 500000" style={S.input} />
            <button onClick={() => { setBudget(Number(bInput) || 0); setEditB(false); }} style={S.saveBtn}>Save</button>
          </div>
        ) : (
          <div>
            <div style={S.bigNum}>{fmt(totalM)}</div>
            <div style={S.sm}>this month · {month.length} transactions</div>
            {budget > 0 && (
              <div>
                <div style={S.track}><div style={{ ...S.fill, width: pct + "%", background: pct > 90 ? "#FF6B6B" : pct > 70 ? "#FBBF24" : "#4ECDC4" }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={S.sm}>{pct.toFixed(0)}% used</span>
                  <span style={{ ...S.sm, color: rem < 0 ? "#FF6B6B" : "#4ECDC4" }}>{rem < 0 ? "Over by " : ""}{fmt(Math.abs(rem))} {rem >= 0 ? "left" : ""}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ ...S.mini, flex: 1 }}><div style={S.sm}>Today</div><div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{fmt(totalT)}</div></div>
        <div style={{ ...S.mini, flex: 1 }}><div style={S.sm}>All Time</div><div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{fmt(allTotal)}</div></div>
      </div>
      {mainBreak.length > 0 && (
        <div style={S.card}>
          <span style={S.cardLbl}>By Main Category</span>
          <div style={{ marginTop: 12 }}>
            {mainBreak.map(c => {
              const w = allTotal > 0 ? (c.amount / allTotal) * 100 : 0;
              return (
                <div key={c.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{c.icon} {c.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(c.amount)} <span style={{ fontWeight: 400, color: "#64748B", fontSize: 11 }}>({w.toFixed(1)}%)</span></span>
                  </div>
                  <div style={{ ...S.track, height: 6, marginTop: 0 }}><div style={{ height: "100%", borderRadius: 3, background: c.color, width: w + "%", transition: "width .5s" }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {spendBreak.length > 0 && (
        <div style={S.card}>
          <span style={S.cardLbl}>Spending Types Overview</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {spendBreak.map(s => (
              <div key={s.name} style={{ background: s.color + "18", border: "1px solid " + s.color + "33", borderRadius: 10, padding: "8px 12px", minWidth: 90 }}>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.icon} {s.short}</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{fmt(s.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {txs.length === 0 && (
        <div style={S.empty}>
          <div style={{ fontSize: 48 }}>📊</div>
          <div style={{ marginTop: 8, fontSize: 14, color: "#64748B" }}>No transactions yet. Tap <b>Record</b> to start!</div>
        </div>
      )}
    </div>
  );
}

function Add({ onAdd, onBack }) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [spendType, setSpendType] = useState("");
  const [note, setNote] = useState("");
  const [momo, setMomo] = useState(MOMO[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recipient, setRecipient] = useState("");
  const [txType, setTxType] = useState("payment");
  const subs = SC[cat] || [];
  const submit = () => {
    if (!amount || !cat || !subCat || !spendType) return;
    onAdd({ id: gid(), amount: Number(amount), category: cat, subCategory: subCat, spendingType: spendType, note: note, momoType: momo, date: date, recipient: recipient, txType: txType });
  };

  return (
    <div style={S.page}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={S.backBtn}>←</button>
        <h2 style={S.screenTitle}>Record Transaction</h2>
      </div>
      <label style={S.label}>Mobile Money</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {MOMO.map(m => (
          <button key={m} onClick={() => setMomo(m)} style={{ ...S.chip, ...(momo === m ? S.chipOn : {}) }}>{m === "MTN MoMo" ? "🟡" : "🔴"} {m}</button>
        ))}
      </div>
      <label style={S.label}>Type</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["payment", "💳 Payment"], ["transfer", "↔️ Transfer"], ["withdrawal", "🏧 Withdraw"]].map(([v, l]) => (
          <button key={v} onClick={() => setTxType(v)} style={{ ...S.chip, flex: 1, ...(txType === v ? S.chipOn : {}) }}>{l}</button>
        ))}
      </div>
      <label style={S.label}>Amount (RWF)</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" style={{ ...S.input, fontSize: 24, fontWeight: 700, marginBottom: 16 }} />
      <label style={S.label}>Recipient / Merchant</label>
      <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. Shop name" style={{ ...S.input, marginBottom: 16 }} />
      <label style={S.label}>Main Category</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {MC.map(c => (
          <button key={c.name} onClick={() => { setCat(c.name); setSubCat(""); }} style={{ ...S.catBtn, flex: 1, border: cat === c.name ? "2px solid " + c.color : "2px solid transparent", background: cat === c.name ? c.color + "22" : "#1E293B" }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span style={{ fontSize: 11, marginTop: 2 }}>{c.name}</span>
          </button>
        ))}
      </div>
      {subs.length > 0 && (
        <div>
          <label style={S.label}>Sub Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {subs.map(s => (
              <button key={s.name} onClick={() => setSubCat(s.name)} style={{ ...S.chip, border: subCat === s.name ? "2px solid " + s.color : "2px solid transparent", background: subCat === s.name ? s.color + "22" : "#1E293B" }}>{s.short}</button>
            ))}
          </div>
        </div>
      )}
      <label style={S.label}>Spending Type</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {ST.map(s => (
          <button key={s.name} onClick={() => setSpendType(s.name)} style={{ ...S.chip, border: spendType === s.name ? "2px solid " + s.color : "2px solid transparent", background: spendType === s.name ? s.color + "22" : "#1E293B" }}>{s.icon} {s.short}</button>
        ))}
      </div>
      <label style={S.label}>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...S.input, marginBottom: 16 }} />
      <label style={S.label}>Note (optional)</label>
      <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Quick note..." style={{ ...S.input, marginBottom: 24 }} />
      <button onClick={submit} style={{ ...S.primaryBtn, opacity: amount && cat && subCat && spendType ? 1 : 0.4 }}>✓ Save Transaction</button>
    </div>
  );
}

function Dash({ txs }) {
  const [view, setView] = useState("daily");
  const { chartData, pieData, totalP, avg } = useMemo(() => {
    if (!txs.length) return { chartData: [], pieData: [], totalP: 0, avg: 0 };
    const grouped = {};
    const catT = {};
    txs.forEach(t => {
      const p = pk(t.date);
      const key = view === "daily" ? t.date : view === "weekly" ? p.week : p.month;
      const label = view === "daily" ? p.day : key;
      if (!grouped[key]) grouped[key] = { key: key, label: label, total: 0 };
      grouped[key].total += t.amount;
      catT[t.category] = (catT[t.category] || 0) + t.amount;
    });
    const sorted = Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key)).slice(-14);
    const total = sorted.reduce((s, d) => s + d.total, 0);
    const pie = MC.map(c => ({ name: c.name, value: catT[c.name] || 0, color: c.color })).filter(p => p.value > 0);
    return { chartData: sorted, pieData: pie, totalP: total, avg: sorted.length ? total / sorted.length : 0 };
  }, [txs, view]);

  return (
    <div style={S.page}>
      <h2 style={S.screenTitle}>Trends & Analytics</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["daily", "weekly", "monthly"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ ...S.chip, flex: 1, ...(view === v ? S.chipOn : {}) }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
        ))}
      </div>
      {!txs.length ? (
        <div style={S.empty}><div style={{ fontSize: 48 }}>📈</div></div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ ...S.mini, flex: 1 }}><div style={S.sm}>Total</div><div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(totalP)}</div></div>
            <div style={{ ...S.mini, flex: 1 }}><div style={S.sm}>Avg/{view === "daily" ? "day" : view === "weekly" ? "week" : "month"}</div><div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(Math.round(avg))}</div></div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>Spending Over Time</span>
            <div style={{ marginTop: 12, marginLeft: -12 }}>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={chartData}>
                  <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8913A" stopOpacity={0.4} /><stop offset="100%" stopColor="#E8913A" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#1E293B", border: "none", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#64748B" }} itemStyle={{ color: "#E8913A" }} />
                  <Area type="monotone" dataKey="total" stroke="#E8913A" strokeWidth={2.5} fill="url(#ag)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>Comparison</span>
            <div style={{ marginTop: 12, marginLeft: -12 }}>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#1E293B", border: "none", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#64748B" }} itemStyle={{ color: "#4ECDC4" }} />
                  <Bar dataKey="total" fill="#4ECDC4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>By Main Category</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={58} paddingAngle={3} strokeWidth={0}>
                  {pieData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {pieData.map(p => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{fmt(p.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Insights({ txs }) {
  const [tab, setTab] = useState("sub");
  const total = txs.reduce((s, t) => s + t.amount, 0);
  const allSubs = [].concat(...Object.values(SC));
  const subData = useMemo(() => {
    const m = {};
    txs.forEach(t => { m[t.subCategory] = (m[t.subCategory] || 0) + t.amount; });
    return Object.entries(m).map(([name, value]) => {
      const found = allSubs.find(s => s.name === name);
      return { name: found ? found.short : (name.split(" - ")[1] || name), fullName: name, value: value, color: found ? found.color : "#94A3B8" };
    }).sort((a, b) => b.value - a.value);
  }, [txs]);
  const typeData = useMemo(() => {
    const m = {};
    txs.forEach(t => { m[t.spendingType] = (m[t.spendingType] || 0) + t.amount; });
    return ST.map(s => ({ ...s, value: m[s.name] || 0 })).filter(s => s.value > 0);
  }, [txs]);
  const typeCount = useMemo(() => {
    const m = {};
    txs.forEach(t => { m[t.spendingType] = (m[t.spendingType] || 0) + 1; });
    return m;
  }, [txs]);
  const radarData = useMemo(() => ST.map(s => ({ type: s.short, amount: (typeData.find(t => t.name === s.name) || { value: 0 }).value })), [typeData]);

  return (
    <div style={S.page}>
      <h2 style={S.screenTitle}>Deep Insights</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        <button onClick={() => setTab("sub")} style={{ ...S.chip, flex: 1, ...(tab === "sub" ? S.chipOn : {}) }}>📂 Sub Categories</button>
        <button onClick={() => setTab("type")} style={{ ...S.chip, flex: 1, ...(tab === "type" ? S.chipOn : {}) }}>🎯 Spending Types</button>
      </div>
      {tab === "sub" ? (
        <div>
          <div style={S.card}>
            <span style={S.cardLbl}>Sub-Category Breakdown</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart><Pie data={subData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={56} paddingAngle={2} strokeWidth={0}>
                  {subData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, maxHeight: 140, overflowY: "auto" }}>
                {subData.slice(0, 8).map(p => (
                  <div key={p.fullName} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{fmt(p.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>All Sub-Categories Ranked</span>
            <div style={{ marginTop: 12 }}>
              {subData.map(s => {
                const w = total > 0 ? (s.value / total) * 100 : 0;
                return (
                  <div key={s.fullName} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12 }}>{s.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{fmt(s.value)} <span style={{ fontWeight: 400, color: "#64748B" }}>({w.toFixed(1)}%)</span></span>
                    </div>
                    <div style={{ ...S.track, height: 6, marginTop: 0 }}><div style={{ height: "100%", borderRadius: 3, background: s.color, width: w + "%", transition: "width .5s" }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={S.card}>
            <span style={S.cardLbl}>Where Your Money Mindset Goes</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart><Pie data={typeData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={56} paddingAngle={2} strokeWidth={0}>
                  {typeData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {typeData.map(p => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, flex: 1 }}>{p.icon} {p.short}</span>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{fmt(p.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>Spending Type Radar</span>
            <div style={{ marginTop: 8, marginLeft: -16 }}>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="type" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <Radar dataKey="amount" stroke="#E8913A" fill="#E8913A" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={S.card}>
            <span style={S.cardLbl}>Spending Type Details</span>
            <div style={{ marginTop: 12 }}>
              {typeData.map(s => {
                const w = total > 0 ? (s.value / total) * 100 : 0;
                const cnt = typeCount[s.name] || 0;
                return (
                  <div key={s.name} style={{ marginBottom: 14, padding: 12, borderRadius: 12, background: s.color + "0D", border: "1px solid " + s.color + "22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.icon} {s.short}</span>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>{fmt(s.value)}</span>
                    </div>
                    <div style={{ ...S.track, height: 6, marginTop: 0, background: "rgba(255,255,255,0.06)" }}><div style={{ height: "100%", borderRadius: 3, background: s.color, width: w + "%" }} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: "#64748B" }}>{cnt} transaction{cnt !== 1 ? "s" : ""}</span>
                      <span style={{ fontSize: 10, color: "#64748B" }}>{w.toFixed(1)}% of total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListScreen({ txs, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [confirmDel, setConfirmDel] = useState(null);
  const allSubs = [].concat(...Object.values(SC));
  const filtered = filter === "all" ? txs : txs.filter(t => t.category === filter);
  const byDate = useMemo(() => {
    const m = {};
    filtered.forEach(t => {
      const key = new Date(t.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      if (!m[key]) m[key] = [];
      m[key].push(t);
    });
    return Object.entries(m);
  }, [filtered]);

  return (
    <div style={S.page}>
      <h2 style={S.screenTitle}>Transaction History</h2>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12, WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => setFilter("all")} style={{ ...S.chip, ...(filter === "all" ? S.chipOn : {}), whiteSpace: "nowrap" }}>All</button>
        {MC.map(c => (
          <button key={c.name} onClick={() => setFilter(c.name)} style={{ ...S.chip, ...(filter === c.name ? S.chipOn : {}), whiteSpace: "nowrap" }}>{c.icon} {c.name}</button>
        ))}
      </div>
      {byDate.length === 0 && (
        <div style={S.empty}><div style={{ fontSize: 36 }}>🔍</div><div style={{ marginTop: 8, fontSize: 14, color: "#64748B" }}>No transactions found</div></div>
      )}
      {byDate.map(([dateStr, items]) => (
        <div key={dateStr} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: 0.5 }}>{dateStr}</div>
          {items.map(t => {
            const mc = MC.find(c => c.name === t.category) || MC[3];
            const st = ST.find(s => s.name === t.spendingType);
            const sub = allSubs.find(s => s.name === t.subCategory);
            return (
              <div key={t.id} style={S.txRow}>
                <div style={{ ...S.txIcon, background: mc.color + "22", color: mc.color }}>{mc.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.recipient || t.note}</div>
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 1 }}>{sub ? sub.short : (t.subCategory ? t.subCategory.split(" - ")[1] : t.category)}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
                    {st && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: st.color + "22", color: st.color, fontWeight: 600 }}>{st.icon} {st.short}</span>}
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#334155", color: "#94A3B8" }}>{t.momoType}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>-{fmt(t.amount)}</div>
                  {confirmDel === t.id ? (
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      <button onClick={() => { onDelete(t.id); setConfirmDel(null); }} style={{ ...S.delBtn, color: "#FF6B6B" }}>Delete</button>
                      <button onClick={() => setConfirmDel(null)} style={{ ...S.delBtn, color: "#64748B" }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDel(t.id)} style={S.delBtn}>🗑</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const S = {
  shell: { maxWidth: 430, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0F172A", color: "#F1F5F9", fontFamily: "'DM Sans', -apple-system, sans-serif", position: "relative" },
  content: { flex: 1, overflowY: "auto", paddingBottom: 85 },
  page: { padding: "20px 16px" },
  nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, display: "flex", justifyContent: "space-around", padding: "6px 0 10px", background: "#1E293B", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 100 },
  navBtn: { display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", WebkitTapHighlightColor: "transparent" },
  addIcon: { background: "linear-gradient(135deg, #E8913A, #F59E0B)", color: "#fff", borderRadius: 14, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -14, boxShadow: "0 4px 16px rgba(232,145,58,0.4)" },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  hTitle: { fontSize: 21, fontWeight: 800, letterSpacing: -0.5 },
  hSub: { fontSize: 12, color: "#64748B" },
  screenTitle: { fontSize: 19, fontWeight: 800, margin: 0 },
  card: { background: "#1E293B", borderRadius: 16, padding: 16, marginBottom: 14, border: "1px solid rgba(255,255,255,0.05)" },
  mini: { background: "#1E293B", borderRadius: 12, padding: 12, border: "1px solid rgba(255,255,255,0.05)" },
  cardLbl: { fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: 0.6, textTransform: "uppercase" },
  bigNum: { fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 },
  sm: { fontSize: 11, color: "#64748B" },
  track: { height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", marginTop: 8, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, transition: "width 0.6s ease" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "#1E293B", color: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, letterSpacing: 0.4 },
  chip: { padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#1E293B", color: "inherit", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  chipOn: { border: "1px solid #E8913A", background: "rgba(232,145,58,0.13)", color: "#E8913A" },
  catBtn: { padding: "10px 8px", borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "inherit" },
  primaryBtn: { width: "100%", padding: "16px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: 700, background: "linear-gradient(135deg, #E8913A, #F59E0B)", color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(232,145,58,0.3)" },
  editBtn: { background: "none", border: "none", color: "#64748B", fontSize: 18, cursor: "pointer", padding: 4 },
  saveBtn: { padding: "10px 20px", borderRadius: 10, border: "none", background: "#4ECDC4", color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  backBtn: { background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "inherit", fontSize: 20, borderRadius: 10, width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  txRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  txIcon: { width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 },
  delBtn: { background: "none", border: "none", fontSize: 11, cursor: "pointer", padding: 2, color: "#64748B" },
  empty: { textAlign: "center", padding: "40px 20px" },
  loader: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0F172A" },
  spin: { width: 32, height: 32, borderRadius: "50%", border: "3px solid #E8913A", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" },
};
