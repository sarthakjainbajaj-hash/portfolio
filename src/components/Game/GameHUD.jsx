import { useState } from "react";
import { FaVolumeMute, FaVolumeUp, FaExpand, FaCompress, FaGlobe, FaCompass } from "react-icons/fa";
import { sound } from "./soundEngine";

function GameHUD({
  collectedCount = 0,
  totalCollectibles = 5,
  monstersSlain = 0,
  totalMonsters = 26,
  onToggleViewMode,
  houseTheme = "stark",
  playerHp = 100,
  playerMaxHp = 100,
  playerMana = 60,
  playerMaxMana = 60,
  playerExp = 0,
  playerMaxExp = 100,
  playerLevel = 1,
  playerGold = 0,
  boss = null,
  onAttack,
  onSpinAttack,
  onCastFireball,
  onDash,
  onInteract,
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

  const hpPercent = Math.max(0, Math.min(100, (playerHp / (playerMaxHp || 100)) * 100));
  const manaPercent = Math.max(0, Math.min(100, (playerMana / (playerMaxMana || 60)) * 100));
  const expPercent = Math.max(0, Math.min(100, (playerExp / (playerMaxExp || 100)) * 100));

  const roleTitle =
    playerLevel >= 5
      ? "ARCHMAGE"
      : playerLevel >= 3
      ? "SPELLBLADE"
      : "WARRIOR";

  return (
    <>
      {/* Top HUD Bar */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 p-3 sm:p-4">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-3">
          
          {/* Player Identity & RPG Resource Card */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-gold-500/50 bg-slate-950/90 p-2.5 px-3.5 shadow-2xl backdrop-blur-md transition">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-gold-500/70 shadow">
              <img
                src="/photo.jpeg"
                alt="Sarthak"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/sarthak-photo.png";
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 py-0.5 text-center text-[9px] font-black text-amber-300">
                Lv.{playerLevel}
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-[130px] sm:min-w-[170px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold tracking-wide text-slate-100 font-heading">
                  Soldier Sarthak
                </span>
                <span className="rounded bg-brand-900/90 px-1.5 py-0.2 text-[9px] font-black tracking-wider text-gold-400">
                  {roleTitle}
                </span>
              </div>

              {/* HP Bar */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-red-400 w-4">HP</span>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80 border border-red-950">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-300 w-8 text-right">
                  {Math.round(playerHp)}
                </span>
              </div>

              {/* Mana Bar */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-cyan-400 w-4">MP</span>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80 border border-blue-950">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${manaPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-cyan-300 w-8 text-right">
                  {Math.round(playerMana)}
                </span>
              </div>

              {/* EXP Bar & Gold Counter */}
              <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-800/80">
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-[8px] font-black text-amber-400">EXP</span>
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                      style={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                  <span>🪙</span>
                  <span>{playerGold}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center: Boss Encounter Bar OR Hostiles Quest Bar */}
          {boss ? (
            <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border-2 border-red-500/80 bg-slate-950/95 px-5 py-2.5 shadow-2xl backdrop-blur-lg animate-pulse">
              <div className="flex items-center gap-2 text-xs font-black tracking-wider text-red-400">
                <span className="text-base">🐲</span>
                <span>{boss.name.toUpperCase()}</span>
                <span className="rounded bg-red-900/80 px-2 py-0.5 text-[9px] font-bold text-red-200">
                  GRAND BOSS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-3 w-48 sm:w-72 overflow-hidden rounded-full border border-red-700 bg-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 transition-all duration-200"
                    style={{ width: `${Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-red-200">
                  {Math.round(boss.hp)} / {boss.maxHp}
                </span>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-2xl border border-red-500/40 bg-slate-950/85 px-4 py-2 text-xs shadow-xl backdrop-blur-md">
              <span className="flex items-center gap-1.5 font-bold text-red-400">
                <span>⚔️</span> Beasts Slain: <strong className="text-white">{monstersSlain}</strong> / {totalMonsters}
              </span>
              {monstersSlain >= 2 ? (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  ✓ Skills Unlocked!
                </span>
              ) : (
                <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 animate-pulse">
                  ⚔️ Slay 2 to Unlock Skills!
                </span>
              )}
            </div>
          )}

          {/* Right Action Tools */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setShowQuestInfo(true)}
              aria-label="Citadel Quest Log"
              className="rounded-xl border border-gold-500/40 bg-slate-950/85 p-2.5 text-gold-300 shadow hover:border-gold-400 hover:text-gold-200 backdrop-blur-md transition"
              title="Quest Log"
            >
              <FaCompass size={14} />
            </button>

            <button
              onClick={toggleAudio}
              aria-label="Toggle Sound"
              className="rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-gold-500 hover:text-gold-300 backdrop-blur-md transition"
              title="Toggle Audio"
            >
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>

            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="hidden sm:block rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-gold-500 hover:text-gold-300 backdrop-blur-md transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
            </button>

            <button
              onClick={onToggleViewMode}
              type="button"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-gold-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg transition duration-200 hover:scale-105"
            >
              <FaGlobe size={13} />
              <span className="hidden sm:inline">Classic Website</span>
            </button>
          </div>
        </div>

        {/* Bottom Ability Hotbar (Desktop & Tablet) */}
        <div className="pointer-events-auto fixed bottom-5 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 rounded-2xl border border-gold-500/40 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-md">
          {/* Attack */}
          <button
            onClick={onAttack}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900/60 hover:border-red-400 transition"
            title="Sword Attack Combo [Space or J]"
          >
            <span className="text-base">⚔️</span>
            <span className="hidden lg:inline">Slash</span>
            <span className="rounded bg-black/50 px-1 py-0.2 text-[9px] font-mono text-slate-400">[Space/J]</span>
          </button>

          {/* Whirlwind */}
          <button
            onClick={onSpinAttack}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 hover:border-amber-400 transition"
            title="Whirlwind Spin Attack [Q or K]"
          >
            <span className="text-base">💥</span>
            <span className="hidden lg:inline">Whirlwind</span>
            <span className="rounded bg-black/50 px-1 py-0.2 text-[9px] font-mono text-slate-400">[Q/K]</span>
          </button>

          {/* Fireball */}
          <button
            onClick={onCastFireball}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-950/40 px-3 py-1.5 text-xs font-bold text-orange-300 hover:bg-orange-900/60 hover:border-orange-400 transition"
            title="Cast Fireball Spell (18 MP) [R or F]"
          >
            <span className="text-base">🔥</span>
            <span className="hidden lg:inline">Fireball</span>
            <span className="rounded bg-black/50 px-1 py-0.2 text-[9px] font-mono text-slate-400">[R/F]</span>
          </button>

          {/* Dash */}
          <button
            onClick={onDash}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition"
            title="Dragon Dash / Dodge Roll (12 MP) [Shift]"
          >
            <span className="text-base">💨</span>
            <span className="hidden lg:inline">Dash</span>
            <span className="rounded bg-black/50 px-1 py-0.2 text-[9px] font-mono text-slate-400">[Shift]</span>
          </button>

          {/* Interact */}
          <button
            onClick={onInteract}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-brand-950/40 px-3 py-1.5 text-xs font-bold text-gold-300 hover:bg-brand-900/60 hover:border-gold-400 transition"
            title="Interact [E]"
          >
            <span className="text-base">📜</span>
            <span className="hidden lg:inline">Inspect</span>
            <span className="rounded bg-black/50 px-1 py-0.2 text-[9px] font-mono text-slate-400">[E]</span>
          </button>
        </div>
      </header>

      {/* Quest Modal */}
      {showQuestInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-gold-500/60 bg-slate-950 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-gold-400 flex items-center gap-2 font-heading tracking-wide">
                <FaCompass /> Quest of Citadel Champions
              </h3>
              <button
                onClick={() => setShowQuestInfo(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <span>🐲</span> Chapter I: The North Dragon Glacial Arena
                </div>
                <p>
                  Journey far North to coordinates (0, -115) to confront <strong>Viserion the Glacial Scourge</strong>. Defeat the dragon to earn massive gold & EXP!
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-3">
                <div className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
                  <span>💀</span> Chapter II: Altar of Technical Skills
                </div>
                <p>
                  Slay at least <strong>2 Skill Beasts</strong> roaming near the central citadel to break the seal on Sarthak&apos;s technical mastery shrine.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <span>✨</span> Combat Mechanics
                </div>
                <p>
                  • <strong>Melee Combo:</strong> Chain 3 sword strikes for critical finishes.<br />
                  • <strong>Fireball [R/F]:</strong> High-damage ranged magic.<br />
                  • <strong>Whirlwind [Q/K]:</strong> 360° AOE sweep.<br />
                  • <strong>Dragon Dash [Shift]:</strong> Invulnerable quick dodge roll.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQuestInfo(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand-600 to-gold-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110"
            >
              Return to Citadel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GameHUD;
