import { WORLD_3D } from "./ThreeGameEngine";

function ThreeMiniMap({ playerPos = { x: 0, z: 8 }, monsters = [], isEmbedded = false }) {
  const mapW = 140;
  const mapH = 140;
  const worldRadius = WORLD_3D.size / 2;

  // Convert 3D world (x, z) to 2D mini-map (px, py)
  const toMapCoord = (x, z) => {
    const nx = (x + worldRadius) / WORLD_3D.size;
    const ny = (z + worldRadius) / WORLD_3D.size;
    return {
      px: Math.max(8, Math.min(mapW - 8, nx * mapW)),
      py: Math.max(8, Math.min(mapH - 8, ny * mapH)),
    };
  };

  const pCoord = toMapCoord(playerPos.x || 0, playerPos.z || 0);

  return (
    <div className={`pointer-events-none z-30 hidden sm:block ${isEmbedded ? "absolute right-3 top-14 scale-90" : "fixed right-4 top-20"}`}>
      <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-2 border-gold-500/70 bg-slate-950/85 p-2 shadow-2xl backdrop-blur-md">
        {/* Radar scanline animation */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1)_0%,transparent_70%)]" />

        {/* Header */}
        <div className="absolute left-2 top-1 text-[9px] font-extrabold tracking-wider text-gold-400">
          CITADEL 3D RADAR
        </div>

        {/* Landmarks */}
        {Object.entries(WORLD_3D.landmarks).map(([key, val]) => {
          const coord = toMapCoord(val.x, val.z);
          return (
            <div
              key={key}
              style={{ left: `${coord.px}px`, top: `${coord.py}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px]"
              title={val.label}
            >
              {val.icon}
            </div>
          );
        })}

        {/* Monsters (Pulsing Red Dots) */}
        {monsters.map((m) => {
          if (m.isDead) return null;
          const coord = toMapCoord(m.x, m.z);
          return (
            <div
              key={m.id}
              style={{ left: `${coord.px}px`, top: `${coord.py}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm animate-ping" />
              <span className="absolute inset-0 block h-2.5 w-2.5 rounded-full bg-red-600 border border-white" />
            </div>
          );
        })}

        {/* Player Soldier (Bright Cyan Arrow Point) */}
        <div
          style={{ left: `${pCoord.px}px`, top: `${pCoord.py}px` }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-3 w-3 rounded-full border-2 border-white bg-sky-400 shadow-md ring-2 ring-sky-500/50" />
        </div>
      </div>
    </div>
  );
}

export default ThreeMiniMap;
