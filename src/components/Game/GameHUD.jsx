import { useState } from "react";
import { FaVolumeMute, FaVolumeUp, FaExpand, FaCompress, FaGlobe, FaTrophy, FaCompass } from "react-icons/fa";
import { sound } from "./soundEngine";

function GameHUD({
  collectedCount = 0,
  totalCollectibles = 5,
  monstersSlain = 0,
  totalMonsters = 2,
  onToggleViewMode,
  houseTheme = "stark",
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuestInfo, setShowQuestInfo] = useState(false);

  const toggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playInteract();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <>
      {/* Top HUD Bar */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          
          {/* Player Identity Pill */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-gold-500/40 bg-slate-950/85 p-2 px-3 shadow-xl backdrop-blur-md">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-gold-500/60 shadow">
              <img
                src="/photo.jpeg"
                alt="Sarthak"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/sarthak-photo.png";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-wide text-slate-100 font-heading">
                  Soldier Sarthak
                </span>
                <span className="rounded bg-brand-900/90 px-1.5 py-0.2 text-[10px] font-bold text-gold-400">
                  WARRIOR
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                {/* HP Bar */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-red-400">HP</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-full bg-gradient-to-r from-red-600 to-emerald-500" />
                  </div>
                </div>
                {/* Attack Hint */}
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                  <span>⚔️ [Space/J]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monsters Hunt Status */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-2.5 rounded-2xl border border-red-500/40 bg-slate-950/85 px-4 py-2 text-xs shadow-xl backdrop-blur-md">
            <span className="flex items-center gap-1.5 font-bold text-red-400">
              <span>👾</span> Skill Beasts Slain: <strong className="text-white">{monstersSlain}</strong> / {totalMonsters}
            </span>
            {monstersSlain >= totalMonsters ? (
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                ✓ Skills Unlocked!
              </span>
            ) : (
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 animate-pulse">
                ⚔️ Fight 2 Beasts!
              </span>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={toggleAudio}
              aria-label="Toggle Sound"
              className="rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-gold-500 hover:text-gold-300 backdrop-blur-md transition"
            >
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>

            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="hidden sm:block rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-gold-500 hover:text-gold-300 backdrop-blur-md transition"
            >
              {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
            </button>

            <button
              onClick={onToggleViewMode}
              type="button"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-gold-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition duration-200 hover:scale-105"
            >
              <FaGlobe size={13} />
              <span>Classic Website</span>
            </button>
          </div>
        </div>

        {/* Bottom controls reminder */}
        <div className="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="rounded-full border border-slate-800 bg-slate-950/85 px-5 py-1.5 text-[11px] font-medium text-slate-300 shadow-md backdrop-blur-md">
            <span className="text-red-400 font-bold">⚔️ [Space] or [J]</span> to Slash Sword • <span className="text-gold-400 font-bold">WASD / Arrows</span> to move • <span className="text-gold-400 font-bold">[E]</span> to inspect
          </div>
        </div>
      </header>

      {/* Quest Modal */}
      {showQuestInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-gold-500/50 bg-slate-950 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-gold-400 flex items-center gap-2">
                <FaCompass /> Quest of the Citadel Runes
              </h3>
              <button
                onClick={() => setShowQuestInfo(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Explore the citadel to collect 5 hidden ancient runes scattered around the landmarks:
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span>❄️</span> <span>Frost Rune: Near Citadel Courtyard fountain</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🔥</span> <span>Dragonfire Rune: War Council armory</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⚔️</span> <span>Relic of the Forge: Above the Arcane Forge</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💎</span> <span>Crystal of Wisdom: Beside the Spire of Skills</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📜</span> <span>Golden Quill: Hidden in the Grand Archive</span>
              </li>
            </ul>
            <button
              onClick={() => setShowQuestInfo(false)}
              className="mt-5 w-full rounded-xl bg-brand-600 py-2 text-xs font-bold text-white hover:bg-brand-500"
            >
              Back to Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GameHUD;
