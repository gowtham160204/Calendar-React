import { useState, useEffect, useRef } from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
];

/* ─────────────────────────────────────────────
   SEASON / WEATHER config per month (0-based)
   Each entry: bg gradient, card tint, accent,
   particle type, label, SVG scene
───────────────────────────────────────────── */
const THEMES = [
  // 0 January – deep winter / snowstorm
  {
    label: "❄️ Deep Winter",
    bg: "linear-gradient(160deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
    cardBg: "rgba(255,255,255,0.10)",
    cardBorder: "rgba(255,255,255,0.18)",
    textColor: "#e8f4ff",
    subColor: "#90b8cc",
    accent: "#7dd3f8",
    blobColors: ["#7dd3f8","#a5c8e4","#c4dff0"],
    particles: "snow",
    scene: "winter",
  },
  // 1 February – cold + soft pink (Valentine)
  {
    label: "🌨️ Cold & Rosy",
    bg: "linear-gradient(160deg,#1a0a2e 0%,#2d1b4e 50%,#4a2060 100%)",
    cardBg: "rgba(255,255,255,0.11)",
    cardBorder: "rgba(255,180,200,0.25)",
    textColor: "#ffe0f0",
    subColor: "#d4a0c0",
    accent: "#f9a8d4",
    blobColors: ["#f9a8d4","#e879a8","#fda4af"],
    particles: "snow",
    scene: "february",
  },
  // 2 March – early spring / blossoms
  {
    label: "🌸 Early Spring",
    bg: "linear-gradient(160deg,#f8e8f8 0%,#fce4ec 50%,#f3e5f5 100%)",
    cardBg: "rgba(255,255,255,0.72)",
    cardBorder: "rgba(240,160,180,0.30)",
    textColor: "#4a1942",
    subColor: "#a060a0",
    accent: "#e879a8",
    blobColors: ["#f9a8d4","#fde68a","#c084fc"],
    particles: "petals",
    scene: "spring",
  },
  // 3 April – rainy spring
  {
    label: "🌧️ April Showers",
    bg: "linear-gradient(160deg,#2b4162 0%,#385f8c 50%,#57879e 100%)",
    cardBg: "rgba(255,255,255,0.13)",
    cardBorder: "rgba(150,200,255,0.25)",
    textColor: "#d0eaff",
    subColor: "#88b8d8",
    accent: "#60c8f8",
    blobColors: ["#93c5fd","#60c8f8","#a5f3fc"],
    particles: "rain",
    scene: "rain",
  },
  // 4 May – warm spring / flowers
  {
    label: "🌼 Full Bloom",
    bg: "linear-gradient(160deg,#f0fff4 0%,#dcfce7 50%,#bbf7d0 100%)",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "rgba(100,200,120,0.30)",
    textColor: "#14532d",
    subColor: "#4a9060",
    accent: "#22c55e",
    blobColors: ["#86efac","#fde68a","#f9a8d4"],
    particles: "petals",
    scene: "bloom",
  },
  // 5 June – early summer / sunny
  {
    label: "☀️ Early Summer",
    bg: "linear-gradient(160deg,#fff9c4 0%,#ffe082 50%,#ffcc02 100%)",
    cardBg: "rgba(255,255,255,0.68)",
    cardBorder: "rgba(255,200,0,0.30)",
    textColor: "#5a3200",
    subColor: "#9a6000",
    accent: "#f59e0b",
    blobColors: ["#fde68a","#fca5a5","#86efac"],
    particles: "sparkle",
    scene: "sunny",
  },
  // 6 July – peak summer / hot
  {
    label: "🌞 Peak Summer",
    bg: "linear-gradient(160deg,#7f1d1d 0%,#b91c1c 50%,#ef4444 100%)",
    cardBg: "rgba(255,255,255,0.11)",
    cardBorder: "rgba(255,150,100,0.28)",
    textColor: "#fff1e0",
    subColor: "#ffb890",
    accent: "#fb923c",
    blobColors: ["#fdba74","#fca5a5","#fde68a"],
    particles: "sparkle",
    scene: "hot",
  },
  // 7 August – late summer / tropical
  {
    label: "🏖️ Tropical Heat",
    bg: "linear-gradient(160deg,#0c4a6e 0%,#0369a1 40%,#38bdf8 100%)",
    cardBg: "rgba(255,255,255,0.14)",
    cardBorder: "rgba(100,220,255,0.28)",
    textColor: "#e0f7ff",
    subColor: "#80d0f0",
    accent: "#38bdf8",
    blobColors: ["#38bdf8","#fde68a","#86efac"],
    particles: "sparkle",
    scene: "tropical",
  },
  // 8 September – early autumn / golden
  {
    label: "🍂 Golden Autumn",
    bg: "linear-gradient(160deg,#431407 0%,#7c2d12 50%,#c2410c 100%)",
    cardBg: "rgba(255,255,255,0.11)",
    cardBorder: "rgba(255,160,80,0.28)",
    textColor: "#fff3e0",
    subColor: "#ffa060",
    accent: "#f97316",
    blobColors: ["#fdba74","#fca5a5","#fde68a"],
    particles: "leaves",
    scene: "autumn",
  },
  // 9 October – deep autumn / Halloween
  {
    label: "🎃 Deep Autumn",
    bg: "linear-gradient(160deg,#1c1917 0%,#292524 50%,#44403c 100%)",
    cardBg: "rgba(255,255,255,0.09)",
    cardBorder: "rgba(200,120,40,0.28)",
    textColor: "#fef3c7",
    subColor: "#d97706",
    accent: "#f59e0b",
    blobColors: ["#f59e0b","#ef4444","#a16207"],
    particles: "leaves",
    scene: "halloween",
  },
  // 10 November – foggy / grey
  {
    label: "🌫️ Misty November",
    bg: "linear-gradient(160deg,#1e293b 0%,#334155 50%,#475569 100%)",
    cardBg: "rgba(255,255,255,0.10)",
    cardBorder: "rgba(180,190,210,0.22)",
    textColor: "#e2e8f0",
    subColor: "#94a3b8",
    accent: "#94a3b8",
    blobColors: ["#cbd5e1","#94a3b8","#e2e8f0"],
    particles: "rain",
    scene: "fog",
  },
  // 11 December – festive winter
  {
    label: "🎄 Festive Winter",
    bg: "linear-gradient(160deg,#0f1f0f 0%,#14532d 50%,#166534 100%)",
    cardBg: "rgba(255,255,255,0.10)",
    cardBorder: "rgba(200,255,180,0.22)",
    textColor: "#f0fff4",
    subColor: "#86efac",
    accent: "#4ade80",
    blobColors: ["#4ade80","#fde68a","#f9a8d4"],
    particles: "snow",
    scene: "christmas",
  },
];

/* ─── SVG Scene renderer ─── */
function SceneLayer({ scene, theme }) {
  const scenes = {
    winter: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Mountains */}
        <polygon points="0,400 150,180 300,400" fill="rgba(255,255,255,0.06)" />
        <polygon points="100,400 300,120 500,400" fill="rgba(255,255,255,0.05)" />
        <polygon points="300,400 550,100 800,400" fill="rgba(255,255,255,0.07)" />
        {/* Snow caps */}
        <polygon points="150,180 120,230 180,230" fill="rgba(255,255,255,0.18)" />
        <polygon points="300,120 265,185 335,185" fill="rgba(255,255,255,0.20)" />
        <polygon points="550,100 510,175 590,175" fill="rgba(255,255,255,0.18)" />
        {/* Ground snow */}
        <ellipse cx="400" cy="400" rx="500" ry="40" fill="rgba(255,255,255,0.08)" />
        {/* Pine trees */}
        {[60,160,620,720].map((x,i) => (
          <g key={i}>
            <polygon points={`${x},320 ${x-18},360 ${x+18},360`} fill="rgba(100,160,80,0.35)" />
            <polygon points={`${x},290 ${x-22},340 ${x+22},340`} fill="rgba(80,140,60,0.30)" />
            <polygon points={`${x},260 ${x-26},315 ${x+26},315`} fill="rgba(60,120,50,0.28)" />
            <rect x={x-4} y="360" width="8" height="20" fill="rgba(100,70,40,0.30)" />
          </g>
        ))}
        {/* Moon */}
        <circle cx="680" cy="80" r="42" fill="rgba(200,230,255,0.12)" />
        <circle cx="668" cy="72" r="36" fill="rgba(200,230,255,0.10)" />
      </svg>
    ),
    february: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        <polygon points="0,400 180,160 360,400" fill="rgba(255,150,180,0.07)" />
        <polygon points="200,400 450,130 700,400" fill="rgba(255,180,200,0.06)" />
        <circle cx="650" cy="90" r="50" fill="rgba(255,200,220,0.10)" />
        {/* Hearts */}
        {[[120,80],[400,50],[630,140],[250,180],[550,200]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
            <path d="M0,-8 C0,-14 -10,-14 -10,-8 C-10,-2 0,6 0,10 C0,6 10,-2 10,-8 C10,-14 0,-14 0,-8Z" fill="#f9a8d4" />
          </g>
        ))}
        <ellipse cx="400" cy="400" rx="500" ry="30" fill="rgba(255,200,220,0.07)" />
      </svg>
    ),
    spring: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Rolling hills */}
        <ellipse cx="200" cy="420" rx="320" ry="120" fill="rgba(134,239,172,0.22)" />
        <ellipse cx="600" cy="430" rx="300" ry="110" fill="rgba(134,239,172,0.18)" />
        {/* Cherry blossom tree */}
        <rect x="395" y="220" width="10" height="120" fill="rgba(160,100,60,0.35)" />
        <rect x="380" y="260" width="8" height="60" rx="4" transform="rotate(-30 384 260)" fill="rgba(160,100,60,0.28)" />
        <rect x="405" y="255" width="8" height="60" rx="4" transform="rotate(25 409 255)" fill="rgba(160,100,60,0.28)" />
        <circle cx="400" cy="175" r="60" fill="rgba(249,168,212,0.28)" />
        <circle cx="360" cy="195" r="42" fill="rgba(249,168,212,0.22)" />
        <circle cx="440" cy="190" r="45" fill="rgba(249,168,212,0.24)" />
        {/* Flowers on ground */}
        {[80,180,550,680,300,500].map((x,i) => (
          <g key={i}>
            <circle cx={x} cy={350+i%2*20} r="6" fill="rgba(249,168,212,0.45)" />
            <circle cx={x} cy={350+i%2*20} r="3" fill="rgba(255,230,100,0.60)" />
          </g>
        ))}
        <circle cx="130" cy="70" r="55" fill="rgba(255,240,100,0.15)" />
      </svg>
    ),
    rain: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Storm clouds */}
        <ellipse cx="200" cy="80" rx="130" ry="55" fill="rgba(100,140,180,0.22)" />
        <ellipse cx="320" cy="60" rx="110" ry="50" fill="rgba(80,120,170,0.20)" />
        <ellipse cx="260" cy="90" rx="140" ry="45" fill="rgba(120,150,190,0.18)" />
        <ellipse cx="560" cy="100" rx="120" ry="50" fill="rgba(100,140,180,0.20)" />
        <ellipse cx="660" cy="80" rx="100" ry="45" fill="rgba(80,120,170,0.18)" />
        {/* Lightning */}
        <polyline points="400,120 388,170 400,170 385,230" stroke="rgba(255,240,100,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Ground puddle */}
        <ellipse cx="400" cy="390" rx="200" ry="18" fill="rgba(100,160,220,0.15)" />
        <ellipse cx="180" cy="385" rx="100" ry="10" fill="rgba(100,160,220,0.12)" />
      </svg>
    ),
    bloom: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        <ellipse cx="250" cy="430" rx="350" ry="130" fill="rgba(134,239,172,0.28)" />
        <ellipse cx="650" cy="440" rx="280" ry="120" fill="rgba(134,239,172,0.22)" />
        {/* Sun */}
        <circle cx="680" cy="80" r="48" fill="rgba(255,220,60,0.20)" />
        {[0,45,90,135,180,225,270,315].map((a,i) => (
          <line key={i} x1={680+Math.cos(a*Math.PI/180)*52} y1={80+Math.sin(a*Math.PI/180)*52}
            x2={680+Math.cos(a*Math.PI/180)*68} y2={80+Math.sin(a*Math.PI/180)*68}
            stroke="rgba(255,220,60,0.22)" strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* Flowers */}
        {[80,200,330,470,580,700].map((x,i) => (
          <g key={i} transform={`translate(${x},${340+i%3*20})`}>
            {[0,72,144,216,288].map((a,j) => (
              <ellipse key={j} cx={Math.cos(a*Math.PI/180)*9} cy={Math.sin(a*Math.PI/180)*9} rx="6" ry="4"
                fill={["rgba(249,168,212,0.55)","rgba(253,224,138,0.55)","rgba(167,243,208,0.55)"][i%3]} />
            ))}
            <circle cx="0" cy="0" r="4" fill="rgba(255,220,60,0.65)" />
          </g>
        ))}
        {/* Butterfly */}
        <ellipse cx="300" cy="150" rx="22" ry="12" fill="rgba(249,168,212,0.30)" transform="rotate(-20 300 150)" />
        <ellipse cx="322" cy="155" rx="22" ry="12" fill="rgba(200,140,255,0.28)" transform="rotate(20 322 155)" />
      </svg>
    ),
    sunny: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Big sun */}
        <circle cx="650" cy="90" r="70" fill="rgba(255,200,0,0.18)" />
        <circle cx="650" cy="90" r="52" fill="rgba(255,210,0,0.22)" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
          <line key={i} x1={650+Math.cos(a*Math.PI/180)*56} y1={90+Math.sin(a*Math.PI/180)*56}
            x2={650+Math.cos(a*Math.PI/180)*76} y2={90+Math.sin(a*Math.PI/180)*76}
            stroke="rgba(255,210,0,0.25)" strokeWidth="3.5" strokeLinecap="round" />
        ))}
        {/* Fluffy clouds */}
        {[[100,80],[300,60],[500,100]].map(([x,y],i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="70" ry="30" fill="rgba(255,255,255,0.18)" />
            <ellipse cx={x-30} cy={y+8} rx="45" ry="25" fill="rgba(255,255,255,0.16)" />
            <ellipse cx={x+35} cy={y+5} rx="50" ry="22" fill="rgba(255,255,255,0.15)" />
          </g>
        ))}
        {/* Green hills */}
        <ellipse cx="200" cy="440" rx="340" ry="120" fill="rgba(100,200,80,0.18)" />
        <ellipse cx="620" cy="450" rx="320" ry="110" fill="rgba(80,180,60,0.15)" />
      </svg>
    ),
    hot: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Blazing sun */}
        <circle cx="400" cy="-20" r="100" fill="rgba(255,100,0,0.18)" />
        <circle cx="400" cy="-20" r="70" fill="rgba(255,150,0,0.20)" />
        {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340].map((a,i) => (
          <line key={i} x1={400+Math.cos(a*Math.PI/180)*74} y1={-20+Math.sin(a*Math.PI/180)*74}
            x2={400+Math.cos(a*Math.PI/180)*100} y2={-20+Math.sin(a*Math.PI/180)*100}
            stroke="rgba(255,140,0,0.22)" strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* Heat haze lines */}
        {[0,1,2,3,4].map(i => (
          <path key={i} d={`M${100+i*150},350 Q${150+i*150},320 ${200+i*150},350 Q${250+i*150},380 ${300+i*150},350`}
            stroke="rgba(255,140,0,0.12)" strokeWidth="2" fill="none" />
        ))}
        {/* Sand dunes */}
        <ellipse cx="200" cy="430" rx="300" ry="90" fill="rgba(255,180,60,0.15)" />
        <ellipse cx="650" cy="440" rx="280" ry="85" fill="rgba(255,160,40,0.13)" />
        {/* Cactus */}
        <rect x="118" y="290" width="12" height="80" rx="6" fill="rgba(100,160,60,0.30)" />
        <rect x="112" y="320" width="30" height="10" rx="5" fill="rgba(100,160,60,0.28)" />
        <rect x="140" y="310" width="10" height="30" rx="5" fill="rgba(100,160,60,0.26)" />
      </svg>
    ),
    tropical: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Ocean */}
        <rect x="0" y="300" width="800" height="100" fill="rgba(14,165,233,0.18)" />
        <path d="M0,300 Q100,285 200,300 Q300,315 400,300 Q500,285 600,300 Q700,315 800,300 L800,400 L0,400Z" fill="rgba(14,165,233,0.15)" />
        {/* Beach */}
        <ellipse cx="400" cy="370" rx="500" ry="50" fill="rgba(255,210,120,0.18)" />
        {/* Palm tree */}
        <path d="M600,380 Q590,320 610,260 Q615,220 605,200" stroke="rgba(160,100,40,0.40)" strokeWidth="12" fill="none" strokeLinecap="round" />
        {[[-50,-20],[-20,-40],[10,-50],[40,-30],[60,-10],[-60,10]].map(([dx,dy],i) => (
          <ellipse key={i} cx={605+dx} cy={200+dy} rx="38" ry="10"
            fill="rgba(74,222,128,0.35)"
            transform={`rotate(${-30+i*20} ${605+dx} ${200+dy})`} />
        ))}
        {/* Sun */}
        <circle cx="680" cy="80" r="50" fill="rgba(255,210,0,0.18)" />
        <circle cx="680" cy="80" r="36" fill="rgba(255,220,0,0.20)" />
        {/* Seagulls */}
        {[[200,120],[280,100],[350,135]].map(([x,y],i) => (
          <path key={i} d={`M${x-12},${y} Q${x},${y-8} ${x+12},${y}`} stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" />
        ))}
      </svg>
    ),
    autumn: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Rolling hills */}
        <ellipse cx="250" cy="430" rx="380" ry="120" fill="rgba(180,80,20,0.18)" />
        <ellipse cx="650" cy="440" rx="320" ry="110" fill="rgba(160,60,10,0.15)" />
        {/* Tree trunk */}
        <rect x="390" y="220" width="20" height="130" fill="rgba(120,70,30,0.40)" rx="5" />
        <rect x="375" y="260" width="12" height="70" rx="5" transform="rotate(-40 381 260)" fill="rgba(120,70,30,0.32)" />
        <rect x="410" y="250" width="12" height="70" rx="5" transform="rotate(35 416 250)" fill="rgba(120,70,30,0.30)" />
        {/* Autumn canopy */}
        <circle cx="400" cy="170" r="72" fill="rgba(234,88,12,0.30)" />
        <circle cx="355" cy="195" r="50" fill="rgba(249,115,22,0.28)" />
        <circle cx="445" cy="188" r="54" fill="rgba(217,70,0,0.26)" />
        <circle cx="400" cy="148" r="38" fill="rgba(253,186,116,0.25)" />
        {/* Fallen leaves */}
        {[[80,330],[150,360],[530,340],[670,355],[750,320],[220,345]].map(([x,y],i) => (
          <ellipse key={i} cx={x} cy={y} rx="10" ry="6"
            fill={["rgba(234,88,12,0.45)","rgba(249,115,22,0.45)","rgba(220,38,38,0.40)"][i%3]}
            transform={`rotate(${i*35} ${x} ${y})`} />
        ))}
      </svg>
    ),
    halloween: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Dark sky */}
        <circle cx="650" cy="80" r="50" fill="rgba(250,240,100,0.14)" />
        {/* Spooky trees */}
        {[80,680].map((x,i) => (
          <g key={i}>
            <rect x={x-6} y="200" width="12" height="160" fill="rgba(30,20,10,0.45)" rx="3" />
            <path d={`M${x},220 Q${x-50},180 ${x-40},150`} stroke="rgba(30,20,10,0.40)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d={`M${x},240 Q${x+50},200 ${x+40},165`} stroke="rgba(30,20,10,0.38)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d={`M${x-40},150 Q${x-60},130 ${x-30},120`} stroke="rgba(30,20,10,0.35)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d={`M${x+40},165 Q${x+65},145 ${x+35},130`} stroke="rgba(30,20,10,0.33)" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* Pumpkins */}
        {[[280,360],[400,350],[520,365]].map(([x,y],i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="28" ry="24" fill="rgba(249,115,22,0.40)" />
            <rect x={x-2} y={y-28} width="4" height="12" fill="rgba(80,120,40,0.45)" rx="2" />
            <path d={`M${x-12},${y-4} L${x-7},${y-10} L${x-2},${y-4}`} stroke="rgba(250,240,100,0.50)" strokeWidth="1.5" fill="rgba(250,240,100,0.20)" />
            <path d={`M${x+2},${y-4} L${x+7},${y-10} L${x+12},${y-4}`} stroke="rgba(250,240,100,0.50)" strokeWidth="1.5" fill="rgba(250,240,100,0.20)" />
            <path d={`M${x-8},${y+8} Q${x},${y+14} ${x+8},${y+8}`} stroke="rgba(250,240,100,0.45)" strokeWidth="1.5" fill="none" />
          </g>
        ))}
        {/* Bats */}
        {[[300,80],[450,60],[550,100]].map(([x,y],i) => (
          <g key={i}>
            <path d={`M${x},${y} Q${x-20},${y-12} ${x-28},${y+2} Q${x-15},${y+5} ${x},${y}`} fill="rgba(60,20,80,0.40)" />
            <path d={`M${x},${y} Q${x+20},${y-12} ${x+28},${y+2} Q${x+15},${y+5} ${x},${y}`} fill="rgba(60,20,80,0.40)" />
          </g>
        ))}
      </svg>
    ),
    fog: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Fog layers */}
        {[0,1,2,3].map(i => (
          <rect key={i} x="-50" y={120+i*60} width="900" height="50" rx="25"
            fill={`rgba(180,190,210,${0.07+i*0.02})`} />
        ))}
        {/* Bare trees */}
        {[120,320,500,680].map((x,i) => (
          <g key={i}>
            <rect x={x-5} y="240" width="10" height="130" fill="rgba(120,130,150,0.30)" rx="3" />
            <path d={`M${x},260 Q${x-35},230 ${x-25},200`} stroke="rgba(120,130,150,0.25)" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d={`M${x},275 Q${x+35},245 ${x+28},210`} stroke="rgba(120,130,150,0.23)" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d={`M${x-25},200 Q${x-42},182 ${x-18},170`} stroke="rgba(120,130,150,0.20)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M${x+28},210 Q${x+46},190 ${x+22},178`} stroke="rgba(120,130,150,0.20)" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    ),
    christmas: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        {/* Stars */}
        {[[100,60],[250,30],[500,50],[680,40],[150,130],[600,100],[350,20]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={i%3===0?3:2} fill={`rgba(255,230,100,${0.35+i*0.05})`} />
        ))}
        {/* Snow ground */}
        <ellipse cx="400" cy="400" rx="520" ry="42" fill="rgba(255,255,255,0.10)" />
        {/* Christmas trees */}
        {[120,680].map((x,i) => (
          <g key={i}>
            <rect x={x-5} y="340" width="10" height="30" fill="rgba(120,70,30,0.35)" />
            <polygon points={`${x},240 ${x-35},320 ${x+35},320`} fill="rgba(34,197,94,0.32)" />
            <polygon points={`${x},200 ${x-28},270 ${x+28},270`} fill="rgba(74,222,128,0.30)" />
            <polygon points={`${x},170 ${x-20},225 ${x+20},225`} fill="rgba(134,239,172,0.28)" />
            {/* Ornaments */}
            {[[-18,300],[10,285],[18,305],[-10,268],[0,252]].map(([dx,dy],j) => (
              <circle key={j} cx={x+dx} cy={dy} r="5"
                fill={["rgba(239,68,68,0.60)","rgba(253,224,71,0.60)","rgba(59,130,246,0.55)"][j%3]} />
            ))}
            <circle cx={x} cy="168" r="6" fill="rgba(253,224,71,0.70)" />
          </g>
        ))}
        {/* Center star / comet */}
        <circle cx="400" cy="60" r="8" fill="rgba(255,230,100,0.35)" />
        <path d="M400,50 Q350,30 300,60" stroke="rgba(255,230,100,0.18)" strokeWidth="2" fill="none" />
        {/* Snowman */}
        <circle cx="400" cy="350" r="22" fill="rgba(255,255,255,0.12)" />
        <circle cx="400" cy="318" r="16" fill="rgba(255,255,255,0.14)" />
        <circle cx="400" cy="300" r="11" fill="rgba(255,255,255,0.14)" />
        <circle cx="396" cy="298" r="2" fill="rgba(50,50,50,0.50)" />
        <circle cx="404" cy="298" r="2" fill="rgba(50,50,50,0.50)" />
        <path d="M396,304 Q400,308 404,304" stroke="rgba(50,50,50,0.45)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  };
  return scenes[scene] || null;
}

const svgStyle = {
  position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
};

/* ─── Particle systems ─── */
function Particles({ type, count = 22 }) {
  const items = Array.from({ length: count }, (_, i) => i);
  if (type === "snow") return (
    <div style={particleContainer}>
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.7; }
          100% { transform: translateY(110vh) translateX(40px) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {items.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${(i/count)*100 + Math.random()*4}%`,
          top: `-${Math.random()*20}px`,
          width: `${4+Math.random()*5}px`,
          height: `${4+Math.random()*5}px`,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.80)",
          animation: `snowfall ${5+Math.random()*8}s ${Math.random()*10}s linear infinite`,
        }} />
      ))}
    </div>
  );

  if (type === "rain") return (
    <div style={particleContainer}>
      <style>{`
        @keyframes rainfall {
          0% { transform: translateY(-30px) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(60px); opacity: 0; }
        }
      `}</style>
      {items.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${(i/count)*100 + Math.random()*3}%`,
          top: `-${Math.random()*30}px`,
          width: "1.5px",
          height: `${14+Math.random()*10}px`,
          background: "rgba(150,200,255,0.55)",
          borderRadius: "2px",
          animation: `rainfall ${0.7+Math.random()*0.8}s ${Math.random()*2}s linear infinite`,
        }} />
      ))}
    </div>
  );

  if (type === "petals") return (
    <div style={particleContainer}>
      <style>{`
        @keyframes petalfall {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.65; }
          100% { transform: translateY(110vh) translateX(80px) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {items.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${(i/count)*100 + Math.random()*3}%`,
          top: `-${Math.random()*20}px`,
          width: `${8+Math.random()*7}px`,
          height: `${5+Math.random()*4}px`,
          borderRadius: "50% 50% 50% 0",
          background: i%3===0 ? "rgba(249,168,212,0.80)" : i%3===1 ? "rgba(253,224,138,0.70)" : "rgba(167,243,208,0.70)",
          animation: `petalfall ${6+Math.random()*6}s ${Math.random()*8}s ease-in infinite`,
        }} />
      ))}
    </div>
  );

  if (type === "leaves") return (
    <div style={particleContainer}>
      <style>{`
        @keyframes leaffall {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.80; }
          85% { opacity: 0.60; }
          100% { transform: translateY(110vh) translateX(100px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {items.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${(i/count)*100 + Math.random()*3}%`,
          top: `-${Math.random()*30}px`,
          width: `${10+Math.random()*8}px`,
          height: `${8+Math.random()*6}px`,
          borderRadius: "50% 0 50% 0",
          background: i%4===0 ? "rgba(234,88,12,0.75)" : i%4===1 ? "rgba(249,115,22,0.70)" : i%4===2 ? "rgba(220,38,38,0.65)" : "rgba(253,186,116,0.70)",
          animation: `leaffall ${5+Math.random()*7}s ${Math.random()*10}s ease-in infinite`,
        }} />
      ))}
    </div>
  );

  if (type === "sparkle") return (
    <div style={particleContainer}>
      <style>{`
        @keyframes sparkle {
          0%,100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      {items.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${Math.random()*100}%`,
          top:`${Math.random()*100}%`,
          width: `${3+Math.random()*4}px`,
          height: `${3+Math.random()*4}px`,
          borderRadius: "50%",
          background: i%3===0 ? "rgba(255,220,50,0.90)" : i%3===1 ? "rgba(255,200,100,0.80)" : "rgba(255,255,200,0.85)",
          animation: `sparkle ${1.5+Math.random()*2.5}s ${Math.random()*3}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );

  return null;
}

const particleContainer = {
  position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1,
};

/* ─── Calendar helpers ─── */
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return ((new Date(year, month, 1).getDay()) + 6) % 7; }
function buildCells(year, month) {
  const dim = getDaysInMonth(year, month);
  const first = getFirstDayOfMonth(year, month);
  const total = Math.ceil((first + dim) / 7) * 7;
  return Array.from({ length: total }, (_, i) => { const d = i - first + 1; return d >= 1 && d <= dim ? d : null; });
}

/* ─── Main Component ─── */
export default function CalendarApp() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [notes, setNotes] = useState(["", "", ""]);
  const [checked, setChecked] = useState([false, false, false]);
  const [anim, setAnim] = useState("idle");
  const [bgFade, setBgFade] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const wheelLock = useRef(false);

  const theme = THEMES[month];

  useEffect(() => {
    const k = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const handleWheel = (e) => {
    e.preventDefault();
    if (wheelLock.current) return;
    navigate(e.deltaY > 0 ? 1 : -1);
    wheelLock.current = true;
    setTimeout(() => { wheelLock.current = false; }, 700);
  };

  const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) navigate(diff > 0 ? 1 : -1);
    setTouchStartY(null);
  };

  const navigate = (dir) => {
    if (anim !== "idle") return;
    setBgFade(true);
    setAnim(dir === 1 ? "out-up" : "out-down");
    setTimeout(() => {
      setMonth(m => {
        let nm = m + dir, ny = year;
        if (nm > 11) { nm = 0; ny = year + 1; }
        else if (nm < 0) { nm = 11; ny = year - 1; }
        setYear(ny);
        return nm;
      });
      setSelectedDay(null);
      setAnim(dir === 1 ? "in-up" : "in-down");
      setTimeout(() => { setAnim("idle"); setBgFade(false); }, 300);
    }, 220);
  };

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells = buildCells(year, month);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const animStyle = {
    idle:      { opacity:1, transform:"translateY(0)",   transition:"opacity 0.28s ease, transform 0.28s ease" },
    "out-up":  { opacity:0, transform:"translateY(-22px)",transition:"opacity 0.22s ease, transform 0.22s ease" },
    "out-down":{ opacity:0, transform:"translateY(22px)", transition:"opacity 0.22s ease, transform 0.22s ease" },
    "in-up":   { opacity:0, transform:"translateY(22px)", transition:"none" },
    "in-down": { opacity:0, transform:"translateY(-22px)",transition:"none" },
  }[anim];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root {
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center;
          transition: background 1.2s ease;
        }
        .page-bg {
          position: fixed; inset: 0; z-index: 0;
          transition: opacity 0.8s ease;
        }
        .cal-outer {
          position: relative; z-index: 2;
          width: 92vw; max-width: 980px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14);
          outline: none;
          transition: box-shadow 0.6s ease;
        }
        .cal-card {
          display: flex;
          width: 100%;
          transition: background 0.9s ease, border-color 0.9s ease;
          border: 1.5px solid transparent;
        }
        /* LEFT */
        .cl {
          flex: 0 0 34%; position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 40px 34px 34px;
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(44px); pointer-events: none; transition: background 0.9s ease; }
        .season-badge {
          position: relative; z-index: 3;
          font-size: clamp(9px,0.85vw,11px);
          font-weight: 600; letter-spacing: 1.5px;
          padding: 4px 10px; border-radius: 20px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          display: inline-block; margin-bottom: 14px;
          transition: color 0.6s ease;
        }
        .month-name {
          position: relative; z-index: 2;
          font-size: clamp(26px,3.4vw,58px);
          font-weight: 800; letter-spacing: 2px; line-height: 1;
          user-select: none; transition: color 0.6s ease;
        }
        .year-txt {
          position: relative; z-index: 2;
          font-size: clamp(12px,1.1vw,16px);
          font-weight: 400; letter-spacing: 3px; margin-top: 6px;
          transition: color 0.6s ease;
        }
        .nav-row { position: relative; z-index: 2; display: flex; gap: 7px; margin-top: 18px; align-items: center; }
        .nb {
          background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.28);
          border-radius: 50%; width: 34px; height: 34px; font-size: 18px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.14s, transform 0.12s; user-select: none; line-height: 1;
        }
        .nb:hover { background: rgba(255,255,255,0.32); transform: scale(1.10); }
        .nb:active { transform: scale(0.92); }
        .hint { position: relative; z-index: 2; margin-top: 10px; font-size: 10px; letter-spacing: 0.8px; opacity: 0.45; }
        /* RIGHT */
        .cr {
          flex: 1; display: flex; flex-direction: column;
          padding: 26px 24px 22px 16px; overflow: hidden; user-select: none;
        }
        .dh-row { display: grid; grid-template-columns: repeat(7,1fr); }
        .dh { text-align: center; font-size: clamp(8px,0.82vw,10.5px); font-weight: 700; letter-spacing: 0.8px; padding: 3px 0 7px; border-bottom: 1.5px solid; }
        .wr { display: grid; grid-template-columns: repeat(7,1fr); border-bottom: 1px solid; }
        .wr:last-child { border-bottom: none; }
        .dc { min-height: clamp(34px,4.4vw,50px); display: flex; align-items: flex-start; justify-content: flex-end; padding: clamp(4px,0.5vw,7px) clamp(4px,0.6vw,8px) 3px; border-right: 1px solid; cursor: pointer; transition: background 0.12s; }
        .dc:last-child { border-right: none; }
        .dc.sel { background: rgba(255,255,255,0.14); }
        .dn { font-size: clamp(10px,0.95vw,12.5px); font-weight: 400; width: clamp(19px,1.85vw,25px); height: clamp(19px,1.85vw,25px); display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.13s, color 0.13s; line-height: 1; }
        .dn.td { font-weight: 700; box-shadow: 0 3px 12px rgba(0,0,0,0.25); }
        /* notes */
        .ns { margin-top: clamp(10px,1.5vw,18px); flex: 1; }
        .nt { font-size: clamp(11px,0.95vw,13.5px); font-weight: 600; letter-spacing: 0.3px; margin-bottom: 9px; }
        .nr { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 7px; }
        .nc { width: 17px; height: 17px; min-width: 17px; border: 1.5px solid; border-radius: 4px; margin-top: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; transition: background 0.18s, border-color 0.18s; flex-shrink: 0; }
        .nc.ck { border-color: transparent; }
        .cm { color: #fff; font-size: 10px; font-weight: 900; }
        .ni { flex: 1; font-family: 'Outfit',sans-serif; font-size: clamp(10px,0.92vw,12px); background: transparent; border: none; outline: none; resize: none; line-height: 1.55; padding: 0; transition: color 0.15s; }
        .ni.done { text-decoration: line-through; }
        .ni::placeholder { opacity: 0.35; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1200px) { .cal-outer { max-width: 840px; } }
        @media (max-width: 1080px) { .cal-outer { max-width: 740px; } .cl { flex: 0 0 33%; padding: 30px 26px 28px; } }
        @media (max-width: 800px) {
          .cal-card { flex-direction: column; }
          .cal-outer { max-width: 600px; border-radius: 22px; }
          .cl { flex: unset; min-height: 155px; padding: 22px 24px 18px; flex-direction: row; align-items: flex-end; justify-content: space-between; }
          .left-text { flex: 1; }
          .nav-row { flex-direction: column; gap: 5px; margin-top: 0; margin-left: 12px; }
          .cr { padding: 18px 18px 18px; }
          .hint { display: none; }
        }
        @media (max-width: 600px) { .cal-outer { width: 96vw; border-radius: 18px; } .cl { padding: 18px 18px 14px; min-height: 135px; } }
        @media (max-width: 400px) {
          .cal-outer { width: 98vw; border-radius: 14px; }
          .cl { padding: 13px 13px 10px; min-height: 110px; }
          .cr { padding: 11px 11px 13px; }
          .month-name { font-size: 22px; }
          .year-txt { font-size: 11px; }
          .dc { min-height: 27px; }
          .dn { width: 17px; height: 17px; font-size: 9px; }
          .nb { width: 28px; height: 28px; font-size: 14px; }
          .ns { margin-top: 8px; }
        }
      `}</style>

      {/* Full-page background */}
      <div className="page-bg" style={{ background: theme.bg, opacity: bgFade ? 0.7 : 1 }} />

      {/* Particles */}
      <Particles type={theme.particles} count={20} />

      <div
        className="cal-outer"
        tabIndex={0}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* SVG Scene in background of card */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden", opacity: bgFade ? 0.5 : 1, transition:"opacity 0.5s ease" }}>
          <SceneLayer scene={theme.scene} theme={theme} />
        </div>

        <div
          className="cal-card"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* ── LEFT PANEL ── */}
          <div className="cl">
            {/* Blobs */}
            {theme.blobColors.map((c, i) => (
              <div key={i} className="blob" style={{
                background: `radial-gradient(circle at 40% 40%, ${c}cc, ${theme.blobColors[(i+1)%3]}88)`,
                ...[
                  { top:"-70px", left:"-70px", width:"300px", height:"300px" },
                  { bottom:"10px", left:"5px", width:"180px", height:"180px" },
                  { top:"10px", right:"-25px", width:"160px", height:"160px" },
                ][i],
              }} />
            ))}

            <div className="left-text" style={animStyle}>
              <span className="season-badge" style={{ color: theme.textColor }}>{theme.label}</span>
              <div className="month-name" style={{ color: theme.textColor }}>{MONTHS[month]}</div>
              <div className="year-txt" style={{ color: theme.subColor }}>{year}</div>
            </div>

            <div className="nav-row">
              <button className="nb" onClick={() => navigate(-1)} style={{ color: theme.textColor }} title="Previous">‹</button>
              <button className="nb" onClick={() => navigate(1)} style={{ color: theme.textColor }} title="Next">›</button>
            </div>
            <div className="hint" style={{ color: theme.textColor }}>↕ scroll · swipe · arrow keys</div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="cr">
            <div style={animStyle}>
              {/* Headers */}
              <div className="dh-row">
                {DAYS.map((d, i) => (
                  <div key={d} className="dh" style={{
                    color: i===5 ? theme.accent : i===6 ? theme.accent : theme.subColor,
                    borderBottomColor: `${theme.subColor}40`,
                  }}>{d}</div>
                ))}
              </div>

              {/* Weeks */}
              {rows.map((row, ri) => (
                <div key={ri} className="wr" style={{ borderBottomColor:`${theme.subColor}25` }}>
                  {row.map((d, ci) => {
                    const todayCell = d && isToday(d);
                    const isSel = d && selectedDay === d && !todayCell;
                    const isSat = ci === 5;
                    const isSun = ci === 6;
                    return (
                      <div key={ci} className={`dc${isSel?" sel":""}`}
                        style={{ borderRightColor:`${theme.subColor}20` }}
                        onClick={() => d && setSelectedDay(d)}
                      >
                        {d && (
                          <span className={`dn${todayCell?" td":""}`} style={{
                            color: todayCell ? "#fff" : isSat||isSun ? theme.accent : theme.textColor,
                            background: todayCell
                              ? `linear-gradient(135deg, ${theme.accent}, ${theme.blobColors[2] || theme.accent})`
                              : "transparent",
                          }}>{d}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="ns">
              <div className="nt" style={{ color: theme.textColor }}>Notes:</div>
              {notes.map((note, i) => (
                <div key={i} className="nr">
                  <div
                    className={`nc${checked[i]?" ck":""}`}
                    style={{
                      borderColor: checked[i] ? "transparent" : `${theme.subColor}80`,
                      background: checked[i]
                        ? `linear-gradient(135deg, ${theme.accent}, ${theme.blobColors[2]||theme.accent})`
                        : "transparent",
                    }}
                    onClick={() => setChecked(c => c.map((v,j) => j===i?!v:v))}
                  >
                    {checked[i] && <span className="cm">✓</span>}
                  </div>
                  <textarea
                    className={`ni${checked[i]?" done":""}`}
                    value={note}
                    onChange={e => setNotes(n => n.map((v,j) => j===i?e.target.value:v))}
                    placeholder="Add a note…"
                    rows={2}
                    style={{ color: checked[i] ? theme.subColor : theme.textColor }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
