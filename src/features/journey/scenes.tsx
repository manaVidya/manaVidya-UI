/**
 * Each scene is a self-contained inline SVG component built from primitive
 * shapes — zero external image requests — matching the rural Andhra Pradesh
 * Zilla Parishad government-school reference described in spec §3.1/§3.3.
 *
 * These lean toward a detailed, painterly "flat design 2.0" look (layered
 * gradients, real kid figures mid-play) rather than flat geometric blocks —
 * true photorealism would mean sourcing photographs, which conflicts with
 * the zero-image-request performance budget these scenes are built around.
 */

interface KidProps {
  x: number;
  y: number;
  shirt: string;
  skin?: string;
  hair?: string;
  pose?: 'stand' | 'walk' | 'swing' | 'slide' | 'seesawUp' | 'seesawDown' | 'sit';
  scale?: number;
  flip?: boolean;
}

/** A small stylised child figure — reused across the playground and classroom scenes. */
function Kid({
  x,
  y,
  shirt,
  skin = '#C68642',
  hair = '#2B1B0E',
  pose = 'stand',
  scale = 1,
  flip = false,
}: KidProps) {
  let leftArm = 'M 0 -6 L -11 6';
  let rightArm = 'M 0 -6 L 11 6';
  let leftLeg = 'M -4 20 L -6 34';
  let rightLeg = 'M 4 20 L 6 34';
  let bodyRotate = 0;

  if (pose === 'swing') {
    leftArm = 'M 0 -6 L -9 -20';
    rightArm = 'M 0 -6 L 9 -20';
    leftLeg = 'M -4 20 L -12 16';
    rightLeg = 'M 4 20 L 12 16';
    bodyRotate = -8;
  } else if (pose === 'slide') {
    leftArm = 'M 0 -6 L -10 2';
    rightArm = 'M 0 -6 L 10 2';
    leftLeg = 'M -4 20 L -18 22';
    rightLeg = 'M 4 20 L 18 22';
    bodyRotate = 10;
  } else if (pose === 'seesawUp' || pose === 'seesawDown') {
    leftArm = 'M 0 -6 L -12 -2';
    rightArm = 'M 0 -6 L 12 -2';
    leftLeg = 'M -4 20 L -10 30';
    rightLeg = 'M 4 20 L 10 30';
  } else if (pose === 'walk') {
    leftArm = 'M 0 -6 L -10 8';
    rightArm = 'M 0 -6 L 10 -4';
    leftLeg = 'M -4 20 L -10 34';
    rightLeg = 'M 4 20 L 8 32';
  } else if (pose === 'sit') {
    leftArm = 'M 0 -6 L -10 4';
    rightArm = 'M 0 -6 L 10 4';
    leftLeg = 'M -4 18 L -14 18';
    rightLeg = 'M 4 18 L 14 18';
  }

  return (
    <g
      transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale}) rotate(${bodyRotate})`}
    >
      <path d={leftLeg} stroke={skin} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={rightLeg} stroke={skin} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={leftArm} stroke={skin} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d={rightArm} stroke={skin} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <rect x="-9" y="-8" width="18" height="24" rx="7" fill={shirt} />
      <circle cx="0" cy="-18" r="10" fill={skin} />
      <path d="M -10 -22 Q 0 -32 10 -22 Q 8 -26 0 -27 Q -8 -26 -10 -22 Z" fill={hair} />
    </g>
  );
}

export function SkyLayer() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="journeySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7EC0EE" />
          <stop offset="55%" stopColor="#A9D8F2" />
          <stop offset="100%" stopColor="#FDE6C4" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#journeySky)" />
      <circle cx="1180" cy="150" r="60" fill="#FFF6E0" opacity="0.9" />
      {[
        [220, 130, 60],
        [320, 150, 40],
        [900, 90, 50],
        [1000, 110, 34],
      ].map(([cx, cy, r], i) => (
        <g key={i} opacity="0.8">
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.55} fill="#FFFFFF" />
          <ellipse cx={cx + r * 0.6} cy={cy + 6} rx={r * 0.7} ry={r * 0.4} fill="#FFFFFF" />
          <ellipse cx={cx - r * 0.6} cy={cy + 8} rx={r * 0.6} ry={r * 0.35} fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  );
}

function TreeCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx="0" cy="118" rx="40" ry="10" fill="#00000022" />
      <rect x="-7" y="30" width="14" height="88" rx="4" fill="#8A5A34" />
      <rect x="-7" y="30" width="6" height="88" rx="3" fill="#734A2C" />
      <circle cx="-24" cy="14" r="34" fill="#4F8F41" />
      <circle cx="26" cy="10" r="38" fill="#5FA34C" />
      <circle cx="0" cy="-24" r="36" fill="#6BB558" />
      <circle cx="-10" cy="-6" r="20" fill="#7CC469" opacity="0.6" />
    </g>
  );
}

export function GateScene() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="gateWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5EFDF" />
          <stop offset="100%" stopColor="#E8DEC6" />
        </linearGradient>
        <linearGradient id="gatePillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBF7EC" />
          <stop offset="100%" stopColor="#E3D8BC" />
        </linearGradient>
        <linearGradient id="groundGate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6C7A1" />
          <stop offset="100%" stopColor="#C3B187" />
        </linearGradient>
      </defs>

      <rect x="0" y="716" width="1440" height="184" fill="url(#groundGate)" />
      {[80, 220, 1220, 1360].map((gx, i) => (
        <ellipse key={i} cx={gx} cy={790 + (i % 2) * 20} rx="26" ry="6" fill="#00000015" />
      ))}

      <rect x="0" y="596" width="410" height="140" fill="url(#gateWall)" />
      <rect x="0" y="576" width="410" height="24" fill="#2E6DA4" />
      <rect x="1030" y="596" width="410" height="140" fill="url(#gateWall)" />
      <rect x="1030" y="576" width="410" height="24" fill="#2E6DA4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={i}
          x1={i * 60}
          y1="596"
          x2={i * 60}
          y2="736"
          stroke="#00000010"
          strokeWidth="2"
        />
      ))}

      <rect
        x="410"
        y="396"
        width="76"
        height="336"
        fill="url(#gatePillar)"
        stroke="#D8CFB8"
        strokeWidth="4"
      />
      <rect
        x="954"
        y="396"
        width="76"
        height="336"
        fill="url(#gatePillar)"
        stroke="#D8CFB8"
        strokeWidth="4"
      />
      <rect x="402" y="388" width="92" height="14" rx="3" fill="#2E6DA4" />
      <rect x="946" y="388" width="92" height="14" rx="3" fill="#2E6DA4" />

      <path
        d="M 410 396 Q 720 264 1030 396 L 1030 320 Q 720 200 410 320 Z"
        fill="url(#gatePillar)"
        stroke="#2E6DA4"
        strokeWidth="8"
      />
      <text
        x="720"
        y="326"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="46"
        fontWeight={700}
        fill="#1C4E75"
      >
        Z.P. HIGH SCHOOL
      </text>

      <g transform="translate(230,760)">
        <rect x="-4" y="-140" width="8" height="140" fill="#8A8A8A" />
        <path d="M 4 -140 L 74 -122 L 4 -104 Z" fill="#FF8A3D" />
        <path d="M 4 -104 L 60 -90 L 4 -78 Z" fill="#3D8DBF" />
      </g>

      <TreeCluster x={140} y={636} scale={0.95} />
      <TreeCluster x={1310} y={636} scale={1.05} />

      <Kid x={640} y={782} shirt="#3D8DBF" hair="#1A1210" pose="walk" scale={1.1} />
      <Kid x={690} y={786} shirt="#E86A6A" hair="#2B1B0E" pose="walk" scale={0.95} flip />
    </svg>
  );
}

export function GateLeafLeft() {
  return (
    <svg viewBox="0 0 200 300" style={{ width: 200, height: 300 }}>
      <defs>
        <linearGradient id="gateLeaf" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3A4E63" />
          <stop offset="100%" stopColor="#25313F" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="180" height="300" fill="url(#gateLeaf)" />
      <line x1="24" y1="16" x2="24" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="64" y1="16" x2="64" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="104" y1="16" x2="104" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="144" y1="16" x2="144" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
    </svg>
  );
}

export function GateLeafRight() {
  return (
    <svg viewBox="0 0 200 300" style={{ width: 200, height: 300, transform: 'scaleX(-1)' }}>
      <rect x="0" y="0" width="180" height="300" fill="#2C3E50" />
      <line x1="24" y1="16" x2="24" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="64" y1="16" x2="64" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="104" y1="16" x2="104" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
      <line x1="144" y1="16" x2="144" y2="284" stroke="#7FB8CC" strokeWidth="4" opacity="0.55" />
    </svg>
  );
}

export function PlaygroundScene() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="playGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCCB9E" />
          <stop offset="100%" stopColor="#C7B383" />
        </linearGradient>
        <linearGradient id="playBuilding" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F2E2" />
          <stop offset="100%" stopColor="#ECE4CE" />
        </linearGradient>
      </defs>

      <rect x="0" y="660" width="1440" height="240" fill="url(#playGround)" />
      <rect x="108" y="300" width="1224" height="333" fill="url(#playBuilding)" />
      <rect x="108" y="280" width="1224" height="24" fill="#3D8DBF" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={198 + i * 198}
          y="360"
          width="108"
          height="144"
          fill="#3D8DBF"
          opacity="0.85"
        />
      ))}

      {/* Hopscotch grid, hand-painted look */}
      <g transform="translate(150,760)" stroke="#B5472F" strokeWidth="4" fill="none" opacity="0.75">
        <rect x="0" y="0" width="60" height="60" />
        <rect x="0" y="60" width="60" height="60" />
        <rect x="0" y="120" width="30" height="60" />
        <rect x="30" y="120" width="30" height="60" />
        <rect x="0" y="180" width="60" height="60" />
      </g>

      {/* Flagpole */}
      <g transform="translate(1080,660)">
        <rect x="-4" y="-180" width="8" height="180" fill="#8A8A8A" />
        <path d="M 4 -180 L 80 -160 L 4 -140 Z" fill="#FF8A3D" />
        <path d="M 4 -140 L 64 -124 L 4 -110 Z" fill="#3D8DBF" />
      </g>

      {/* Swing set */}
      <g transform="translate(330,540)">
        <path
          d="M -70 160 L -20 0 L 20 0 L 70 160"
          fill="none"
          stroke="#7A5230"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#7A5230" strokeWidth="10" />
        <line x1="-10" y1="0" x2="-16" y2="86" stroke="#9AA0A6" strokeWidth="3" />
        <line x1="2" y1="0" x2="-4" y2="86" stroke="#9AA0A6" strokeWidth="3" />
        <rect x="-22" y="86" width="24" height="8" rx="3" fill="#4A6FA5" />
        <Kid x={-10} y={78} shirt="#F2B84B" hair="#241A12" pose="swing" scale={1.05} />

        <line x1="10" y1="0" x2="6" y2="70" stroke="#9AA0A6" strokeWidth="3" />
        <line x1="22" y1="0" x2="18" y2="70" stroke="#9AA0A6" strokeWidth="3" />
        <rect x="4" y="70" width="20" height="7" rx="3" fill="#4A6FA5" />
      </g>

      {/* Slide */}
      <g transform="translate(700,540)">
        <path
          d="M -50 160 L -50 40 L 40 -10"
          fill="none"
          stroke="#8A5A34"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M -50 40 L 40 -10 L 52 8 L -38 58 Z"
          fill="#5FA3C4"
          stroke="#3D7FA0"
          strokeWidth="3"
        />
        <path d="M -50 40 L -38 58 L -38 150 L -50 150 Z" fill="#4A6FA5" />
        <line x1="-46" y1="130" x2="-46" y2="20" stroke="#6B4423" strokeWidth="6" />
        <line x1="-30" y1="130" x2="-30" y2="46" stroke="#6B4423" strokeWidth="6" />
        <Kid x={-6} y={44} shirt="#5FA34C" hair="#1A1210" pose="slide" scale={1} />
      </g>

      {/* Seesaw */}
      <g transform="translate(1030,700)">
        <path d="M -18 0 L 18 0 L 10 -18 L -10 -18 Z" fill="#7A5230" />
        <g transform="rotate(-12)">
          <rect x="-90" y="-8" width="180" height="12" rx="4" fill="#D9772E" />
          <Kid x={-72} y={-18} shirt="#E86A6A" hair="#2B1B0E" pose="seesawDown" scale={0.95} />
          <Kid x={72} y={-40} shirt="#3D8DBF" hair="#1A1210" pose="seesawUp" scale={0.95} flip />
        </g>
      </g>

      {/* Kids running with a ball */}
      <Kid x={880} y={800} shirt="#F2B84B" hair="#2B1B0E" pose="walk" scale={1.1} />
      <circle cx="920" cy="812" r="9" fill="#E8E8E8" stroke="#B5472F" strokeWidth="2" />
      <Kid x={960} y={796} shirt="#8B5FBF" hair="#241A12" pose="walk" scale={1} flip />

      <TreeCluster x={90} y={706} scale={0.85} />
      <TreeCluster x={1370} y={700} scale={0.9} />
    </svg>
  );
}

export function VerandaScene() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="verandaFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C67C4E" />
          <stop offset="100%" stopColor="#A9633A" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="#E4D9BE" />
      <rect x="0" y="760" width="1440" height="140" fill="url(#verandaFloor)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={126 + i * 234}
          y={280 + i * 8}
          width={65 - i * 8}
          height={480 - i * 16}
          fill="#F2EEE0"
          stroke="#D8CFB8"
          strokeWidth="4"
        />
      ))}
      <rect
        x="620"
        y="420"
        width="120"
        height="90"
        rx="4"
        fill="#F7F2E4"
        stroke="#8A5A34"
        strokeWidth="4"
      />
      <line x1="632" y1="440" x2="728" y2="440" stroke="#8A5A34" strokeWidth="2" opacity="0.6" />
      <line x1="632" y1="460" x2="728" y2="460" stroke="#8A5A34" strokeWidth="2" opacity="0.6" />
      <g transform="translate(920,700)">
        <ellipse cx="0" cy="90" rx="26" ry="8" fill="#00000018" />
        <rect x="-6" y="10" width="12" height="80" fill="#7A5230" />
        <circle cx="-14" cy="4" r="18" fill="#4F8F41" />
        <circle cx="12" cy="0" r="20" fill="#5FA34C" />
      </g>
    </svg>
  );
}

export function ClassroomDoor() {
  return (
    <svg viewBox="0 0 280 420" style={{ width: 280, height: 420 }}>
      <defs>
        <linearGradient id="doorWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9C6A42" />
          <stop offset="100%" stopColor="#7A4E2E" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="280"
        height="215"
        fill="url(#doorWood)"
        stroke="#6B4423"
        strokeWidth="6"
      />
      <rect x="18" y="16" width="108" height="90" fill="#734A2C" stroke="#6B4423" strokeWidth="3" />
      <rect
        x="154"
        y="16"
        width="108"
        height="90"
        fill="#734A2C"
        stroke="#6B4423"
        strokeWidth="3"
      />
      <rect
        x="18"
        y="118"
        width="108"
        height="80"
        fill="#734A2C"
        stroke="#6B4423"
        strokeWidth="3"
      />
      <rect
        x="154"
        y="118"
        width="108"
        height="80"
        fill="#734A2C"
        stroke="#6B4423"
        strokeWidth="3"
      />
      <circle cx="255" cy="112" r="8" fill="#D9B45C" />
    </svg>
  );
}

/**
 * Bilingual class/section board — Telugu line rendered via Noto Sans Telugu.
 * Per spec §3.1's honest caveat: this wording is a transliteration reference,
 * not a native-speaker-verified translation — flag for content sign-off
 * before this ships beyond a dev build.
 */
export function ClassSignboard() {
  return (
    <svg viewBox="0 0 340 76" style={{ width: 340, height: 76 }}>
      <rect
        x="0"
        y="0"
        width="340"
        height="76"
        rx="4"
        fill="#F7F2E4"
        stroke="#2E6DA4"
        strokeWidth="3"
      />
      <text
        x="170"
        y="30"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="20"
        fontWeight={700}
        fill="#1C4E75"
      >
        CLASS 5 · SECTION A
      </text>
      <text
        x="170"
        y="56"
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize="17"
        fontWeight={600}
        fill="#4A3420"
      >
        5వ తరగతి — A విభాగం
      </text>
    </svg>
  );
}

export function ClassroomInterior() {
  const rowA: Array<[number, number, string, string]> = [
    [180, 300, '#3D8DBF', '#241A12'],
    [270, 300, '#E86A6A', '#1A1210'],
    [360, 300, '#F2B84B', '#2B1B0E'],
    [540, 320, '#5FA34C', '#241A12'],
    [630, 320, '#8B5FBF', '#1A1210'],
    [720, 320, '#3D8DBF', '#2B1B0E'],
  ];
  const rowB: Array<[number, number, string, string]> = [
    [162, 440, '#E86A6A', '#241A12'],
    [270, 440, '#F2B84B', '#1A1210'],
    [378, 440, '#5FA34C', '#2B1B0E'],
    [540, 462, '#8B5FBF', '#241A12'],
    [648, 462, '#3D8DBF', '#1A1210'],
    [756, 462, '#E86A6A', '#2B1B0E'],
  ];

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="classroomFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3EEDF" />
          <stop offset="100%" stopColor="#E8DFC6" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#classroomFloor)" />
      <rect x="0" y="0" width="1440" height="234" fill="#E7DFC8" />

      <rect
        x="108"
        y="54"
        width="540"
        height="144"
        rx="6"
        fill="#1F5E3C"
        stroke="#164329"
        strokeWidth="6"
      />
      <path
        d="M 140 90 Q 250 70 340 100"
        stroke="#F3EEDF"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 380 130 L 430 90 L 480 150 Z"
        stroke="#F3EEDF"
        strokeWidth="2.5"
        fill="none"
        opacity="0.6"
      />
      <rect x="118" y="64" width="200" height="6" fill="#F3EEDF" opacity="0.5" />

      <rect
        x="720"
        y="36"
        width="162"
        height="126"
        rx="4"
        fill="#F7F2E4"
        stroke="#C9B98C"
        strokeWidth="3"
      />
      <path d="M 736 60 L 866 60 L 866 90 L 736 90 Z" fill="#8FCBEA" opacity="0.6" />
      <path d="M 736 100 L 800 100 L 800 140 L 736 140 Z" fill="#5FA34C" opacity="0.5" />

      {/* Teacher at the board */}
      <g transform="translate(660,150)">
        <ellipse cx="0" cy="46" rx="16" ry="5" fill="#00000018" />
        <rect x="-11" y="0" width="22" height="34" rx="8" fill="#B5472F" />
        <circle cx="0" cy="-12" r="12" fill="#C68642" />
        <path d="M -12 -16 Q 0 -26 12 -16 Q 10 -20 0 -21 Q -10 -20 -12 -16 Z" fill="#2B1B0E" />
        <path d="M -11 4 L -22 24" stroke="#B5472F" strokeWidth="5" strokeLinecap="round" />
        <path d="M 11 4 L 20 -2" stroke="#B5472F" strokeWidth="5" strokeLinecap="round" />
      </g>

      <g transform="translate(1260,99)">
        <ellipse cx="0" cy="0" rx="108" ry="18" fill="#B8B8B8" opacity="0.75" />
        <ellipse cx="0" cy="0" rx="18" ry="108" fill="#B8B8B8" opacity="0.55" />
      </g>

      {[
        [126, 288, 324, 32],
        [486, 306, 324, 32],
        [846, 320, 306, 30],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#8A5A34" />
          <rect x={x + 4} y={y + h} width={w - 8} height={68} fill="#734A2C" />
        </g>
      ))}
      {[
        [108, 424, 360, 34],
        [486, 446, 360, 34],
        [864, 464, 342, 33],
      ].map(([x, y, w, h], i) => (
        <g key={`row2-${i}`}>
          <rect x={x} y={y} width={w} height={h} fill="#8A5A34" />
          <rect x={x + 4} y={y + h} width={w - 8} height={68} fill="#734A2C" />
        </g>
      ))}

      {rowA.map(([sx, sy, shirt, hair], i) => (
        <Kid key={`a-${i}`} x={sx} y={sy} shirt={shirt} hair={hair} pose="sit" scale={0.85} />
      ))}
      {rowB.map(([sx, sy, shirt, hair], i) => (
        <Kid key={`b-${i}`} x={sx} y={sy} shirt={shirt} hair={hair} pose="sit" scale={0.85} />
      ))}

      <rect x="200" y="500" width="26" height="20" rx="3" fill="#B5472F" opacity="0.85" />
      <rect x="700" y="524" width="26" height="20" rx="3" fill="#3D8DBF" opacity="0.85" />
    </svg>
  );
}

export function AboutSection() {
  return (
    <div style={{ maxWidth: 900, padding: '0 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 40, fontWeight: 700, color: '#E8E9F3', marginBottom: 16 }}>
        Every school record, in one place
      </h2>
      <p style={{ fontSize: 18, color: '#9A9BBF', lineHeight: 1.7, marginBottom: 32 }}>
        ManaVidya replaces scattered paper files with one connected system for admins, teachers,
        parents, and students — built for schools where a phone, not a laptop, is how families stay
        in touch with the classroom.
      </p>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Attendance', value: 'Marked daily' },
          { label: 'Hall Tickets', value: 'QR-verified' },
          { label: 'Report Cards', value: 'Never lost' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '20px 28px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              minWidth: 160,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: '#5C5D7A' }}>{stat.label}</p>
            <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: '#E8E9F3' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
