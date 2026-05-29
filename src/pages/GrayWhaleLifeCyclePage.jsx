import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, ComposedChart, Area
} from "recharts";

// ─── SINGLE-MONTH MOTHER DATA ─────────────────────────────────────────────────

const motherMonthData = [
  {
    month: "August", kg: 36000, pct: 100, phase: "peak", icon: "🏔️",
    bazi: "未 Goat → 申 Monkey", location: "Chukchi / Bering Sea",
    midMonth: "Around mid-August, the calf's nursing sessions shorten noticeably. The mother barely notices — she is nose-down in Arctic sediment, rolling on her right side, sieving amphipods through baleen by the thousands. She is at her largest. Her blubber layer is 6–8 inches thick. This is her highest weight of the entire cycle — the moment all those miles of fasting and nursing were building toward.",
    stat: "36,000 kg — 100% of peak"
  },
  {
    month: "September", kg: 34500, pct: 96, phase: "peak", icon: "⚡",
    bazi: "酉 Rooster", location: "Northern Bering Sea",
    midMonth: "Around mid-September, the calf makes its final separation. No ceremony — it forages in the same waters, independent for the first time. The mother continues feeding furiously. She mates, usually with multiple males over several days. Inside her, invisible and metabolically negligible, the next calf's story has begun. Yang Metal energy: precision, completion, harvest. She carries invisible Fire within her Metal season.",
    stat: "34,500 kg — 96% of peak · MATING · New pregnancy begins"
  },
  {
    month: "October", kg: 33000, pct: 92, phase: "departure", icon: "🌊",
    bazi: "戌 Dog", location: "Unimak Pass, Aleutians",
    midMonth: "Around mid-October, the sea surface drops another degree. The ice shelf edges south ten miles overnight. Her body knows before her mind does. She surfaces once from a long dive, orients south by the coastline's magnetic signature, and does not turn north again for six months. She passes through Unimak Pass into the open Pacific. Single as a Pringle. The Dog branch holds hidden Fire within Earth — the invisible embryo within her blubber.",
    stat: "33,000 kg — 92% · FASTING BEGINS · 6,200 miles ahead"
  },
  {
    month: "November", kg: 30500, pct: 85, phase: "migration", icon: "🌑",
    bazi: "亥 Pig", location: "Oregon Coast (Depoe Bay)",
    midMonth: "Around mid-November, she passes Oregon at 75 miles per day, night and day, without stopping. She has eaten almost nothing since Unimak Pass. The growing fetus is now 180–250 kg and its daily energy demand is visible on her body. Her blubber pays the invoice. Whale watching season opens at Depoe Bay. Humans see her blow from shore: two puffs, sometimes heart-shaped, then she's gone south. Pure Pig energy: Water fully unleashed.",
    stat: "30,500 kg — 85% · Fetus: ~200 kg · Oregon passing"
  },
  {
    month: "December", kg: 28000, pct: 78, phase: "migration", icon: "🎯",
    bazi: "子 Rat", location: "San Diego → Baja Norte",
    midMonth: "Around mid-December, she crosses the US-Mexico border south of San Diego. The water is 2°C warmer. Something shifts in her swimming cadence. The fetus now weighs 800–900 kg and is in its final exponential growth phase — 98% of total fetal energy cost concentrates in the last 100 days. She can sense the lagoon ahead like a frequency she's been tuned to for 20 years. First births occur late December to early January for the earliest-arriving mothers.",
    stat: "28,000 kg — 78% · Fetus: ~900 kg · First births in Baja beginning"
  },
  {
    month: "January", kg: 25500, pct: 71, phase: "birth", icon: "🏝️",
    bazi: "丑 Ox", location: "Laguna Ojo de Liebre / San Ignacio",
    midMonth: "Around mid-January, peak arrivals at the lagoons. Pregnant females come first. The water is turbid gray, warm, twice the salinity of open ocean. January 15–20 sees the first major wave of births — Ox branch energy fully open. The calf emerges fluke-first. The mother lifts it on her back and flukes for its first breath. 12,500 miles of purpose resolves into this one moment, in this one protected lagoon, at this one surface.",
    stat: "25,500 kg — 71% · ★ BIRTH · Calf: 500–680 kg"
  },
  {
    month: "February", kg: 24000, pct: 67, phase: "nursing", icon: "🍼",
    bazi: "丑 Ox peak", location: "All Three Baja Lagoons",
    midMonth: "Around mid-February, the ABSOLUTE PEAK of gray whale calving. All three lagoons are filled with mother-calf pairs. The mother is losing weight fastest now — producing up to 50 gallons of 53%-fat milk per day while eating almost nothing. The calf is gaining 60–70 lbs per day. The 'friendly whale' encounters peak here: mothers bring calves to the wooden pangas, calves press soft rostrums against human hands. The Frozen Treasury is fully open.",
    stat: "24,000 kg — 67% · 50 gal/day milk · Calf doubling weight"
  },
  {
    month: "March", kg: 22500, pct: 63, phase: "nursing", icon: "⬆️",
    bazi: "寅 Tiger", location: "Baja → California Coast",
    midMonth: "Around mid-March, the northbound migration begins. Mother-calf pairs are last to leave — giving calves maximum time to build blubber. She swims within 1–2 miles of shore, close enough to protect against orcas and great whites hunting in deeper water. She is still losing mass while nursing on the move. Tiger energy: upward, determined, breaking through toward spring. The calf drafts in her wake, learning the coastline by swimming it.",
    stat: "22,500 kg — 63% · Nursing on migration · Shore within 1–2 miles"
  },
  {
    month: "April", kg: 22000, pct: 61, phase: "minimum", icon: "📉",
    bazi: "卯 Rabbit", location: "Oregon / Washington Coast",
    midMonth: "Around mid-April, she reaches her absolute minimum weight — the low point of the entire 2-year cycle. Six months of fasting combined with nursing a rapidly growing calf has cost her 14,000 kg. This is the 'skinny whale' period documented by NOAA drone surveys. Yin Wood energy: gentle, careful, coastal. She and the calf hug the shore together. Both vulnerable, both moving north. Both alive.",
    stat: "22,000 kg — 61% · ABSOLUTE MINIMUM · Calf: ~2,700 kg"
  },
  {
    month: "May", kg: 22800, pct: 63, phase: "recovery", icon: "🌱",
    bazi: "辰 Dragon", location: "British Columbia / SE Alaska",
    midMonth: "Around mid-May, she reaches the first opportunistic feeding zones along the BC and SE Alaska coast. She scoops sediment in shallow bays between migration segments. The calf watches and begins its first clumsy attempts at bottom-rolling — tilting sideways in the shallows, mouth open, confused by the mud. She gains weight for the first time in 7 months. Small gains, but the direction has reversed. Dragon energy: Earth emerging from water, transition toward summer.",
    stat: "22,800 kg — 63% · Feeding resumes · Calf: ~3,400 kg"
  },
  {
    month: "June", kg: 24500, pct: 68, phase: "recovery", icon: "🐟",
    bazi: "巳 Snake", location: "Gulf of Alaska / Kodiak",
    midMonth: "Around mid-June, she enters true feeding waters. The Gulf of Alaska's shallow bays offer amphipod-rich sediment. Both mother and calf feed independently for stretches of hours. The calf's nursing frequency has dropped by 50% from its January peak. She is rebuilding slowly — the biological math is hard: nursing still costs her 3× more energy per day than she gains from feeding. Snake energy: Yin Fire activating, metabolism rising.",
    stat: "24,500 kg — 68% · Calf: ~4,200 kg · Nursing reduces to twice daily"
  },
  {
    month: "July", kg: 27000, pct: 75, phase: "recovery", icon: "🌊",
    bazi: "午 Horse", location: "Bering Sea feeding grounds",
    midMonth: "Around mid-July, she reaches the prime Arctic feeding grounds. The 24-hour Arctic summer daylight means she can feed continuously. The amphipod density here is 10,000× greater than California waters. Her weight gain accelerates — but she is still nursing. The calf follows her, watching her technique: roll right, open mouth, push mud through baleen, lick food off plates with the tongue. It practices alongside her. Horse energy: Fire maximum, full metabolic flame, feeding at peak intensity.",
    stat: "27,000 kg — 75% · Full Arctic feeding · Calf mirrors her technique"
  },
  {
    month: "August ↻", kg: 33000, pct: 92, phase: "peak", icon: "🔄",
    bazi: "未 Goat → 申 Monkey", location: "Chukchi / Northern Bering Sea",
    midMonth: "Around mid-August — exactly 12 months after the previous cycle's weaning — the calf separates for the last time. The mother is free to feed without the nursing drain for the first time since conception, 14 months ago. Her weight climbs 2,000–3,000 kg in the final weeks of August alone. She mates again. The invisible Fire of the next calf's embryo sparks in the Dog branch. The Frozen Treasury seals itself again, preparing its next unsealing in 丑 Ox, 16 months from now.",
    stat: "33,000 kg — 92% · ★ WEANING · ★ MATING · Cycle begins again"
  },
];

// ─── BABY GROWTH DATA ─────────────────────────────────────────────────────────

const babyMonthData = [
  {
    month: "January (Birth)", ageWeeks: 0, weightKg: 590, lengthM: 4.5,
    bazi: "丑 Ox", location: "Baja Lagoon — Ojo de Liebre / San Ignacio", color: "#a29bfe", icon: "🐣",
    story: "The calf emerges fluke-first in turbid 20°C lagoon water. Dark gray-black skin, no blubber, eyes wide open immediately. The mother rolls beneath it, lifting its head above the surface. It takes its first breath — a small puff, then a stronger one. Within hours it dives to 3 meters. Within two days it holds its breath for 3 minutes. Its skin is smooth as a peeled hardboiled egg — no barnacles yet. It weighs roughly the same as a grand piano and is 15 feet long on day one. The entire lagoon seems to slow down when they surface together.",
    dailyGain: "~20 kg/day in first days, accelerating to 27+ kg/day",
    nursingSessions: "Dozens per day — underwater, from nipples concealed in mammary slits on either side of the genital slit",
    behavior: "Surface. Breathe. Surface. Breathe. Stay within one body-length of mother at all times. Learn: this surface is safe."
  },
  {
    month: "February", ageWeeks: 4, weightKg: 1200, lengthM: 5.0,
    bazi: "丑 Ox peak", location: "Baja Lagoon — Peak Season", color: "#a29bfe", icon: "🍼",
    story: "By mid-February the calf has entered its peak growth rate: 60–70 lbs (27–32 kg) per day. Its skin, still relatively smooth, begins collecting the first barnacle larvae — invisible now, but in 20 years they will weigh hundreds of kilograms and define its entire appearance. The lagoon's high salinity makes the calf more buoyant, so nursing is easier — it doesn't fight to stay near the surface. This is when 'friendly whale' encounters peak: the mother brings the calf to the panga boat. The calf presses its soft rostrum against a human hand. It does not flinch. This is the beginning of its education about what humans are — not the whalers of its ancestors' memory, but the hand in the water at Laguna San Ignacio.",
    dailyGain: "60–70 lbs/day (27–32 kg) — PEAK GROWTH RATE",
    nursingSessions: "Continuous. Mother produces up to 50 gallons of 53%-fat milk per day. Milk is so thick it barely disperses in water.",
    behavior: "Approaches boats with curiosity. Rubs against hull fiberglass. Accepts touch on rostrum. Mother initiates these contacts — she brings the calf to the boat."
  },
  {
    month: "March", ageWeeks: 8, weightKg: 1800, lengthM: 5.5,
    bazi: "寅 Tiger", location: "Baja → California Coast", color: "#55efc4", icon: "⬆️",
    story: "The northbound migration begins. The calf has never seen open ocean — it was born in a shallow, protected lagoon surrounded by desert dunes. Now it follows its mother into Pacific swells, some 3–4 meters high. It drafts in her slipstream, riding the pressure wave her enormous body creates, expending 30% less energy than if swimming alone. The California coastline scrolls past: sea cliffs, kelp beds, harbor seals watching from rocks. The calf learns that the shore is to its right side. It won't forget this. In 20 years, it will navigate by this same coast without being taught — memory transmitted not through instruction but through the body's experience of swimming it.",
    dailyGain: "~19 kg/day (migration effort reduces pace slightly)",
    nursingSessions: "Nursing during coastal rest periods and in sheltered bays. Still primary nutritional source.",
    behavior: "Drafts in mother's wake (30% energy saving). Occasional spy-hopping — raising head vertically above water to look around. Learning: shore = right side, deep water = left side, danger."
  },
  {
    month: "April", ageWeeks: 13, weightKg: 2400, lengthM: 6.0,
    bazi: "卯 Rabbit", location: "California Coast (Mendocino → Oregon)", color: "#00b894", icon: "🌱",
    story: "The calf's weight has quadrupled from birth. Its length has grown 1.5 meters. The first barnacles are now visible — small gray-white crusts near the blowhole and along the rostrum. The calf begins breaching: launching its entire 2,400 kg body fully out of the water and crashing back in explosions of white foam. Scientists think this aids parasite removal, and may be communication, and may simply be the ecstasy of a body discovering what it can do. The mother matches its pace exactly. When it tires, they rest together in a shallow bay — bodies touching, rising and falling with the same breathing rhythm. Whale watchers on California tour boats see them passing: the mother vast and barnacled, the calf smooth and almost elegant, never more than 10 body-lengths from her side.",
    dailyGain: "~19 kg/day",
    nursingSessions: "3–4 major sessions per day during coastal resting periods.",
    behavior: "First breaching. Tail-slapping. Beginning to recognize orca threat signatures (specific call patterns, dorsal fin shape). Following mother's evasive maneuvers in shallow water."
  },
  {
    month: "May", ageWeeks: 17, weightKg: 3000, lengthM: 6.5,
    bazi: "辰 Dragon", location: "Oregon → British Columbia", color: "#6c5ce7", icon: "🐉",
    story: "The calf is now large enough that the mother allows small separations — 100 meters, then 200, then 500. It always returns. In BC's shallow bays, the calf does something entirely new: it tilts sideways in the water, rolls onto its right side, opens its mouth against the sandy bottom, and pushes. Nothing comes out effectively — its baleen is still too short to filter well — but the motion is correct. It is practicing the foundational gesture of its entire feeding life. The mother watches from 50 meters, continuing her own feeding, one eye angled back on the calf. Dragon energy: Earth emerging from Water, first real contact with the ground.",
    dailyGain: "~20 kg/day",
    nursingSessions: "2–3 per day. Nursing bouts shortening as calf becomes interested in other activities.",
    behavior: "FIRST FORAGING ATTEMPTS. Bottom-rolling practice in shallow bays. Explores independently within 500m radius. Beginning to investigate sediment with rostrum."
  },
  {
    month: "June", ageWeeks: 21, weightKg: 3700, lengthM: 7.0,
    bazi: "巳 Snake", location: "SE Alaska / Gulf of Alaska", color: "#e17055", icon: "🐍",
    story: "Alaska. The water changes — colder, darker, impossibly richer. The calf can feel the density of life in the sediment when it presses its rostrum against the bottom. It eats its first real mouthful of amphipods — a few hundred grams mixed with a liter of mud, filtered through its growing baleen plates. It swallows. The taste is entirely different from milk. It takes another mouthful. The mother feeds beside it, rolling effortlessly, exposing 20 years of practiced efficiency. The calf is clumsy and wonderful. Its weight gain slows slightly — it is burning more energy learning to feed than it gains from its first independent attempts. Snake energy: Yin Fire activating the first fires of self-sufficiency.",
    dailyGain: "~20 kg/day",
    nursingSessions: "1–2 per day. Calf increasingly distracted by independent feeding attempts.",
    behavior: "First successful independent foraging. Amphipods and benthic crustaceans. The right-side rolling habit establishing itself — the same side preference its mother has, learned by watching."
  },
  {
    month: "July", ageWeeks: 25, weightKg: 4300, lengthM: 7.5,
    bazi: "午 Horse", location: "Bering Sea / Chukchi approaches", color: "#d63031", icon: "🌊",
    story: "The calf has entered the Arctic proper. The 24-hour summer light means feeding opportunities at midnight, at 3am, at noon — time dissolves. It feeds alongside its mother in water that is 3°C but impossibly rich with life. By mid-July it spends more time feeding than nursing. The two behaviors overlap: it nurses, swims 20 meters, rolls and feeds, swims back, nurses again. The mother's milk production is declining — her body redirects resources to rebuilding her own blubber. The calf doesn't understand why the milk sessions are shorter. It compensates by eating more mud. Horse energy: Yang Fire at maximum — full metabolic flame, the body discovering its own power.",
    dailyGain: "~18 kg/day (post-nursing reduction beginning)",
    nursingSessions: "Less than once per day. Nursing sessions shortening to minutes rather than extended periods.",
    behavior: "Feeding competently. Swimming 2–3 km independently. Beginning to understand migration direction cues from the coastline's orientation."
  },
  {
    month: "August (WEANING)", ageWeeks: 29, weightKg: 5200, lengthM: 8.0,
    bazi: "申 Monkey", location: "Chukchi / Northern Bering Sea", color: "#b2bec3", icon: "✂️",
    story: "Around mid-August, the last nursing session occurs without ceremony. The mother simply does not present herself for nursing. The calf approaches — she moves away. It approaches again — she dives to feed. It waits at the surface. She does not come up beside it. It dives to find her. She is 200 meters away and feeding, facing away. The calf feeds beside her for three more weeks — same location, same mother, but the milk bond is permanently severed. Yang Metal energy: clean, precise, irreversible, merciful. The calf is now 8.7× its birth weight and 1.8× its birth length. In October it will make its first solo southbound migration. It will find Baja by the same magnetic coastline its mother taught it by swimming it beside her. The route is in its body now.",
    dailyGain: "~15 kg/day (post-weaning, independent feeding only)",
    nursingSessions: "ZERO. Weaned. The transition is complete.",
    behavior: "Fully independent. Feeding alone with increasing competence. Will follow mother's general southward route in October, then separate near the tropics for the first time completely alone."
  },
];

// ─── BAZI MONTHS ─────────────────────────────────────────────────────────────

const BAZI_MONTHS = [
  { branch: "寅 Tiger", elem: "Yang Wood",   dates: "Feb 4–Mar 5",   season: "Spring Begins",    color: "#55efc4", role: "Late births · First mother-calf pairs depart northbound", animalLink: "🐋 Calf pushing upward — wood breaking through winter earth" },
  { branch: "卯 Rabbit",elem: "Yin Wood",    dates: "Mar 6–Apr 4",   season: "Awakening",        color: "#00b894", role: "Northbound migration. Hugging California shore. Orca avoidance.", animalLink: "🌱 Gentle coastal travel. Calf learning geography of its life." },
  { branch: "辰 Dragon", elem: "Earth trans.",dates: "Apr 5–May 4",   season: "Clear & Bright",   color: "#6c5ce7", role: "First calf foraging attempts. Spring Earth emergence.", animalLink: "🐉 Dragon treasury opens. Calf rolls in sediment for the first time." },
  { branch: "巳 Snake",  elem: "Yin Fire",   dates: "May 5–Jun 5",   season: "Summer Begins",    color: "#e17055", role: "Alaska approach. Calf feeds independently. First fires of self-sufficiency.", animalLink: "🐍 Snake Fire ignites. Calf's first real meal from the Earth floor." },
  { branch: "午 Horse",  elem: "Yang Fire",  dates: "Jun 6–Jul 6",   season: "Grain in Ear",     color: "#d63031", role: "Arctic peak feeding. Mother rebuilds. Calf forages alongside.", animalLink: "🐎 Fire maximum. Full energy IN for both, side by side." },
  { branch: "未 Goat",   elem: "Earth+Fire", dates: "Jul 7–Aug 6",   season: "Minor Heat",       color: "#fdcb6e", role: "Late Arctic feeding. Weaning imminent. Earth transition.", animalLink: "🐐 Goat grazes in late summer. Calf discovers its own hunger." },
  { branch: "申 Monkey", elem: "Yang Metal", dates: "Aug 7–Sep 6",   season: "Autumn Begins",    color: "#b2bec3", role: "WEANING. Mother mates. Metal precision severs the nursing bond.", animalLink: "🐒 Metal = clean, irreversible separation. Calf becomes its own being." },
  { branch: "酉 Rooster",elem: "Yin Metal",  dates: "Sep 7–Oct 6",   season: "White Dew",        color: "#dfe6e9", role: "Mother peak feeding. Calf solo foraging. Both building for winter.", animalLink: "🐓 Rooster at dawn of next cycle. Both feeding furiously and alone." },
  { branch: "戌 Dog",    elem: "Earth+Metal+hidden Fire", dates: "Oct 7–Nov 6", season: "Cold Dew", color: "#fd79a8", role: "DEPARTURE. Pregnant, alone. Hidden Fire = invisible embryo beginning.", animalLink: "🐕 Dog guards the threshold. She crosses into open Pacific. Alone." },
  { branch: "亥 Pig",    elem: "Yang Water", dates: "Nov 7–Dec 6",   season: "Winter Begins",    color: "#74b9ff", role: "Deep southbound migration. Open Pacific. Pure Water rising.", animalLink: "🐖 Pig = Water unleashed. She swims through pure Water energy, night and day." },
  { branch: "子 Rat",    elem: "Pure Water", dates: "Dec 7–Jan 5",   season: "Major Snow",       color: "#0984e3", role: "Arriving Baja. First births. Life in maximum potential form.", animalLink: "🐀 Rat = seed in pure darkness. Calf about to emerge from the Water." },
  { branch: "丑 Ox",     elem: "Earth 60% Water 30% Metal 10%", dates: "Jan 6–Feb 3", season: "Minor Cold", color: "#a29bfe", role: "★ PEAK BIRTHS. 70% of all calves born. Frozen Treasury opens.", animalLink: "🐂 丑 Ox IS the gray whale. Earth holding Water. Birth made physical." },
];

const PHASE_COLORS = {
  peak: "#1dd1a1", departure: "#74b9ff", migration: "#0984e3",
  nursing: "#fd79a8", minimum: "#e17055", recovery: "#55efc4", birth: "#ff9f43"
};
const phaseLabel = {
  peak: "Arctic Peak", departure: "Departure", migration: "Migration",
  nursing: "Nursing", minimum: "Weight Minimum", recovery: "Recovery", birth: "Birth"
};

const CTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const c = d.color || PHASE_COLORS[d.phase] || "#74b9ff";
  return (
    <div style={{ background: "#0d1b3e", border: `2px solid ${c}`, borderRadius: 10, padding: "10px 14px", maxWidth: 240, fontSize: 12 }}>
      <div style={{ color: c, fontWeight: 700 }}>{d.icon} {d.month}</div>
      {d.kg && <div style={{ color: "#74b9ff", marginTop: 3 }}>{(d.kg / 1000).toFixed(1)}t — {d.pct}%</div>}
      {d.weightKg && <div style={{ color: "#ff9f43", marginTop: 3 }}>Calf: {d.weightKg.toLocaleString()} kg · {d.lengthM}m</div>}
      {d.bazi && <div style={{ color: "#a29bfe", marginTop: 3 }}>{d.bazi}</div>}
    </div>
  );
};

export default function GrayWhaleLifeCycle() {
  const [tab, setTab] = useState("baby");
  const [selMom, setSelMom] = useState(5);
  const [selBaby, setSelBaby] = useState(1);
  const [selBranch, setSelBranch] = useState(11);

  const tabs = [["baby","🐣 Baby Month by Month"],["mother","💙 Mother Month by Month"],["bazi","☯️ BaZi Animal Months"]];

  return (
    <div style={{ background:"linear-gradient(160deg,#060b1a 0%,#0a1628 50%,#060e1a 100%)", minHeight:"100vh", padding:"24px 16px 60px", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff" }}>

      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:36, marginBottom:4 }}>🐋🐣</div>
        <h1 style={{ fontSize:20, fontWeight:900, margin:0, background:"linear-gradient(90deg,#a29bfe,#74b9ff,#ff9f43)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Gray Whale Life Cycle — Month by Month
        </h1>
        <p style={{ color:"#888", fontSize:12, margin:"5px 0 0" }}>
          Eschrichtius robustus · One month = one story · Mid-month narrative · BaZi aligned
        </p>
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        {tabs.map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:600, fontSize:12,
            background: tab===v ? "linear-gradient(90deg,#a29bfe,#74b9ff)" : "rgba(255,255,255,0.07)",
            color: tab===v ? "#000" : "#888"
          }}>{l}</button>
        ))}
      </div>

      {/* ══ BABY TAB ══════════════════════════════════════════════════════════ */}
      {tab === "baby" && (
        <div>
          <div style={{ background:"rgba(255,159,67,0.08)", border:"1px solid rgba(255,159,67,0.25)", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ fontSize:32 }}>🐣</div>
              <div>
                <h2 style={{ color:"#ff9f43", fontSize:18, fontWeight:900, margin:"0 0 4px" }}>The Baby's First Year — Month by Month Story</h2>
                <p style={{ color:"#888", fontSize:12, margin:0 }}>
                  January birth (590 kg, 4.5m) → August weaning (5,200 kg, 8.0m) — 8.7× birthweight in 7–8 months<br/>
                  Milk: <strong style={{color:"#ff9f43"}}>53% fat</strong> · Peak gain: <strong style={{color:"#ff9f43"}}>60–70 lbs/day</strong> · Total nursing: 7–8 months
                </p>
              </div>
            </div>
          </div>

          {/* Month pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18, justifyContent:"center" }}>
            {babyMonthData.map((d,i) => (
              <button key={i} onClick={() => setSelBaby(i)} style={{
                padding:"7px 14px", borderRadius:14,
                border:`1px solid ${selBaby===i ? d.color : "transparent"}`,
                background: selBaby===i ? `${d.color}20` : "rgba(255,255,255,0.04)",
                color: selBaby===i ? d.color : "#666",
                fontSize:11, fontWeight:selBaby===i ? 700 : 400, cursor:"pointer"
              }}>{d.icon} {d.month.split(" ")[0]}</button>
            ))}
          </div>

          {/* Detail card */}
          {(() => {
            const b = babyMonthData[selBaby];
            return (
              <div style={{ background:`${b.color}10`, border:`2px solid ${b.color}40`, borderRadius:18, padding:"22px 24px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:32 }}>{b.icon}</span>
                      <div>
                        <div style={{ color:b.color, fontWeight:900, fontSize:20 }}>{b.month}</div>
                        <div style={{ color:"#aaa", fontSize:12 }}>~{b.ageWeeks} weeks old · {b.location}</div>
                        <span style={{ color:b.color, background:`${b.color}20`, padding:"3px 10px", borderRadius:10, fontSize:11, display:"inline-block", marginTop:4 }}>{b.bazi}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ color:"#ff9f43", fontWeight:900, fontSize:24 }}>{b.weightKg.toLocaleString()}</div>
                      <div style={{ color:"#555", fontSize:10 }}>kg</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ color:"#74b9ff", fontWeight:900, fontSize:24 }}>{b.lengthM}m</div>
                      <div style={{ color:"#555", fontSize:10 }}>length</div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:14, color:"#ccc", fontSize:13, lineHeight:1.8, marginBottom:16 }}>
                  {b.story}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ color:"#fd79a8", fontSize:11, fontWeight:700, marginBottom:4 }}>🍼 NURSING · {b.dailyGain}</div>
                    <div style={{ color:"#999", fontSize:12 }}>{b.nursingSessions}</div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ color:"#74b9ff", fontSize:11, fontWeight:700, marginBottom:4 }}>🌊 BEHAVIOR</div>
                    <div style={{ color:"#999", fontSize:12 }}>{b.behavior}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Chart */}
          <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"16px 8px", marginBottom:16 }}>
            <p style={{ textAlign:"center", color:"#888", fontSize:12, margin:"0 0 10px" }}>Calf weight by month (kg) — click any bar</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={babyMonthData} margin={{ top:5, right:20, left:5, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill:"#666", fontSize:9 }} angle={-35} textAnchor="end" height={60}
                  tickFormatter={v => v.split(" ")[0]} />
                <YAxis tickFormatter={v => `${(v/1000).toFixed(1)}t`} tick={{ fill:"#888", fontSize:10 }} />
                <Tooltip content={<CTip />} />
                <Bar dataKey="weightKg" radius={[4,4,0,0]} onClick={(_,i) => setSelBaby(i)} cursor="pointer">
                  {babyMonthData.map((d,i) => <Cell key={i} fill={selBaby===i ? d.color : `${d.color}55`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:9 }}>
            {[["590 kg","Birth weight\n(grand piano)","#a29bfe"],["53% fat","Mother's milk fat\n(human: 2%)","#ff9f43"],["50 gal/day","Milk volume\nproduced","#fd79a8"],["60–70 lbs","Peak daily\nweight gain","#55efc4"],["5,200 kg","Weaning weight\n(8 months)","#b2bec3"],["8.7×","Birthweight\nmultiplier","#ffd32a"],["4.5→8.0m","Length\ngrowth","#74b9ff"],["7–8 months","Total nursing\nduration","#e17055"]].map(([v,l,c]) => (
              <div key={v} style={{ background:`${c}10`, border:`1px solid ${c}25`, borderRadius:11, padding:"11px 9px", textAlign:"center" }}>
                <div style={{ color:c, fontWeight:900, fontSize:15, lineHeight:1.2 }}>{v}</div>
                <div style={{ color:"#777", fontSize:10, marginTop:3, lineHeight:1.4, whiteSpace:"pre-line" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ MOTHER TAB ════════════════════════════════════════════════════════ */}
      {tab === "mother" && (
        <div>
          <div style={{ background:"rgba(116,185,255,0.08)", border:"1px solid rgba(116,185,255,0.2)", borderRadius:16, padding:"16px 20px", marginBottom:20 }}>
            <h3 style={{ color:"#74b9ff", margin:"0 0 4px", fontWeight:900 }}>💙 Mother Weight — One Month At A Time</h3>
            <p style={{ color:"#888", fontSize:12, margin:0 }}>
              Peak: 36,000 kg (August) → Minimum: 22,000 kg (April) · Loss: up to 14,000 kg (39% of body weight)<br/>
              <span style={{color:"#e17055"}}>Each month has its own story. Mid-month: what is happening inside her body and world.</span>
            </p>
          </div>

          {/* Month pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18, justifyContent:"center" }}>
            {motherMonthData.map((d,i) => (
              <button key={i} onClick={() => setSelMom(i)} style={{
                padding:"7px 14px", borderRadius:14,
                border:`1px solid ${selMom===i ? PHASE_COLORS[d.phase] : "transparent"}`,
                background: selMom===i ? `${PHASE_COLORS[d.phase]}20` : "rgba(255,255,255,0.04)",
                color: selMom===i ? PHASE_COLORS[d.phase] : "#666",
                fontSize:11, fontWeight:selMom===i ? 700 : 400, cursor:"pointer"
              }}>{d.icon} {d.month.slice(0,3)}</button>
            ))}
          </div>

          {/* Detail card */}
          {(() => {
            const d = motherMonthData[selMom];
            const pc = PHASE_COLORS[d.phase];
            return (
              <div style={{ background:`${pc}10`, border:`2px solid ${pc}40`, borderRadius:18, padding:"22px 24px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:32 }}>{d.icon}</span>
                      <div>
                        <div style={{ color:pc, fontWeight:900, fontSize:22 }}>{d.month}</div>
                        <div style={{ color:"#aaa", fontSize:12 }}>{d.location}</div>
                        <div style={{ color:"#666", fontSize:11, marginTop:2 }}>{d.bazi}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:pc, fontWeight:900, fontSize:28 }}>{(d.kg/1000).toFixed(1)}t</div>
                    <div style={{ color:"#555", fontSize:12 }}>{d.kg.toLocaleString()} kg</div>
                    <div style={{ background:`${pc}25`, borderRadius:10, padding:"4px 10px", marginTop:4 }}>
                      <span style={{ color:pc, fontWeight:700, fontSize:14 }}>{d.pct}% of peak</span>
                    </div>
                    <div style={{ color:"#777", fontSize:11, marginTop:4 }}>{phaseLabel[d.phase]}</div>
                  </div>
                </div>
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:14 }}>
                  <div style={{ color:pc, fontSize:12, fontWeight:700, marginBottom:8 }}>MID-MONTH STORY:</div>
                  <div style={{ color:"#ccc", fontSize:13, lineHeight:1.8 }}>{d.midMonth}</div>
                  <div style={{ marginTop:12, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 14px" }}>
                    <span style={{ color:pc, fontWeight:700 }}>{d.stat}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Bar chart */}
          <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"16px 8px", marginBottom:16 }}>
            <p style={{ textAlign:"center", color:"#888", fontSize:12, margin:"0 0 10px" }}>Mother body weight across full annual cycle — click any bar</p>
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={motherMonthData} margin={{ top:8, right:20, left:10, bottom:50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill:"#666", fontSize:9 }} angle={-40} textAnchor="end" height={70}
                  tickFormatter={v => v.slice(0,3)} />
                <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}t`} tick={{ fill:"#74b9ff", fontSize:10 }} domain={[20000,38000]} />
                <Tooltip content={<CTip />} />
                <ReferenceLine y={22000} stroke="#e17055" strokeDasharray="5 3"
                  label={{ value:"22t minimum", fill:"#e17055", fontSize:9, position:"insideTopRight" }} />
                <ReferenceLine y={30000} stroke="#55efc4" strokeDasharray="4 4"
                  label={{ value:"30t healthy", fill:"#55efc4", fontSize:9 }} />
                <Area type="monotone" dataKey="kg" fill="rgba(116,185,255,0.05)" stroke="none" />
                <Bar dataKey="kg" radius={[4,4,0,0]} onClick={(_,i) => setSelMom(i)} cursor="pointer">
                  {motherMonthData.map((d,i) => <Cell key={i} fill={selMom===i ? PHASE_COLORS[d.phase] : `${PHASE_COLORS[d.phase]}50`} />)}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth:540 }}>
              <thead>
                <tr style={{ background:"rgba(116,185,255,0.1)" }}>
                  {["","Month","Weight","% Peak","Phase","BaZi"].map(h => (
                    <th key={h} style={{ padding:"8px", textAlign:"left", color:"#74b9ff", fontWeight:700, fontSize:10, borderBottom:"2px solid rgba(116,185,255,0.2)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {motherMonthData.map((d,i) => {
                  const pc = PHASE_COLORS[d.phase];
                  return (
                    <tr key={i} onClick={() => setSelMom(i)}
                      style={{ background:selMom===i ? `${pc}15` : i%2===0 ? "rgba(255,255,255,0.02)" : "transparent", cursor:"pointer" }}>
                      <td style={{ padding:"7px 6px", fontSize:16 }}>{d.icon}</td>
                      <td style={{ padding:"7px 6px", color:selMom===i ? pc : "#ccc", fontWeight:selMom===i ? 700 : 400 }}>{d.month}</td>
                      <td style={{ padding:"7px 6px", color:"#74b9ff", fontWeight:700 }}>{(d.kg/1000).toFixed(1)}t</td>
                      <td style={{ padding:"7px 6px" }}>
                        <span style={{ color:pc, background:`${pc}20`, padding:"2px 7px", borderRadius:8 }}>{d.pct}%</span>
                      </td>
                      <td style={{ padding:"7px 6px", color:pc, fontSize:10 }}>{phaseLabel[d.phase]}</td>
                      <td style={{ padding:"7px 6px", color:"#a29bfe", fontSize:10 }}>{d.bazi.slice(0,22)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phase legend */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginTop:14 }}>
            {Object.entries(phaseLabel).map(([k,l]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:PHASE_COLORS[k] }} />
                <span style={{ color:"#777" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ BAZI TAB ══════════════════════════════════════════════════════════ */}
      {tab === "bazi" && (
        <div>
          <div style={{ background:"rgba(162,155,254,0.08)", borderRadius:16, padding:"16px 20px", marginBottom:20 }}>
            <h3 style={{ color:"#a29bfe", margin:"0 0 4px", fontWeight:900 }}>☯️ 12 BaZi Months — Gray Whale Alignment</h3>
            <p style={{ color:"#888", fontSize:12, margin:0 }}>
              The gray whale does not follow the BaZi calendar. <strong style={{color:"#a29bfe"}}>It IS the calendar</strong> — 36 tonnes of Earth and Water, one branch at a time.
            </p>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18, justifyContent:"center" }}>
            {BAZI_MONTHS.map((b,i) => (
              <button key={i} onClick={() => setSelBranch(i)} style={{
                padding:"6px 12px", borderRadius:14,
                border:`1px solid ${selBranch===i ? b.color : "transparent"}`,
                background: selBranch===i ? `${b.color}25` : "rgba(255,255,255,0.04)",
                color: selBranch===i ? b.color : "#666",
                fontSize:11, fontWeight:selBranch===i ? 700 : 400, cursor:"pointer"
              }}>{b.branch.split(" ")[0]}</button>
            ))}
          </div>

          {(() => {
            const b = BAZI_MONTHS[selBranch];
            return (
              <div style={{ background:`${b.color}10`, border:`2px solid ${b.color}40`, borderRadius:18, padding:"22px 24px", marginBottom:20 }}>
                <div style={{ color:b.color, fontWeight:900, fontSize:26 }}>{b.branch}</div>
                <div style={{ color:"#aaa", fontSize:13 }}>{b.season} · {b.dates}</div>
                <div style={{ color:"#666", fontSize:12, marginTop:2, marginBottom:14 }}>{b.elem}</div>
                <div style={{ borderTop:`1px solid ${b.color}30`, paddingTop:14 }}>
                  <div style={{ color:"#ccc", fontSize:14, marginBottom:10 }}>{b.role}</div>
                  <div style={{ color:b.color, fontSize:14, fontStyle:"italic", fontWeight:600 }}>{b.animalLink}</div>
                </div>
              </div>
            );
          })()}

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(245px,1fr))", gap:10 }}>
            {BAZI_MONTHS.map((b,i) => (
              <div key={i} onClick={() => setSelBranch(i)} style={{
                background:`${b.color}0A`, border:`1px solid ${selBranch===i ? b.color : b.color+"30"}`,
                borderRadius:12, padding:"12px 14px", cursor:"pointer"
              }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:b.color, fontWeight:700, fontSize:14 }}>{b.branch}</span>
                  <span style={{ color:"#444", fontSize:10 }}>{b.dates}</span>
                </div>
                <div style={{ color:"#999", fontSize:11, marginTop:3 }}>{b.elem}</div>
                <div style={{ color:"#666", fontSize:11, marginTop:5, lineHeight:1.5 }}>{b.role.slice(0,65)}…</div>
              </div>
            ))}
          </div>

          <div style={{ background:"linear-gradient(135deg,rgba(162,155,254,0.15),rgba(116,185,255,0.1))", border:"2px solid rgba(162,155,254,0.6)", borderRadius:18, padding:"20px 24px", marginTop:24 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🐂✨</div>
            <div style={{ color:"#a29bfe", fontWeight:900, fontSize:20, marginBottom:8 }}>丑 Ox = The Gray Whale Month</div>
            <p style={{ color:"#ccc", fontSize:13, lineHeight:1.8, margin:0 }}>
              <strong style={{color:"#74b9ff"}}>Earth 60%</strong> — She is the bottom-feeder. Barnacle-covered Earth. Rolls on her right side in sediment every summer of her 70-year life.<br/>
              <strong style={{color:"#74b9ff"}}>Water 30%</strong> — Born in water. Navigates 12,500 miles by coastline. Carries water's life within her always.<br/>
              <strong style={{color:"#74b9ff"}}>Metal 10%</strong> — Navigational precision across 50 years of the same route. Returns to the same lagoon, the same square mile, year after year.<br/><br/>
              <span style={{ color:"#a29bfe", fontStyle:"italic" }}>
                "丑 Ox does not announce itself. It opens quietly — in turbid shallow lagoon water at 20°C, when a 36-tonne mother rolls beneath her calf and it takes its first breath. Earth releases what Water prepared. Metal remembers the way home."
              </span>
            </p>
          </div>
        </div>
      )}

      <p style={{ textAlign:"center", color:"#2d2d2d", fontSize:11, marginTop:32 }}>
        Eschrichtius robustus · NOAA · ACS · Jones & Swartz 1984 · ADFG · Oceanic Society · GENESIS Project 2026
      </p>
    </div>
  );
}
