import { useEffect, useRef, useState } from "react";
import { RageRoomEngine, WEAPONS } from "./RageRoomEngine";
import { rageSound } from "./rageAudio";
import VirtualJoystick from "../Game/VirtualJoystick";
import {
  FaVolumeMute,
  FaVolumeUp,
  FaMusic,
  FaExpand,
  FaCompress,
  FaRedo,
  FaQuestionCircle,
  FaTimes,
  FaPlay,
  FaGlobe,
  FaGamepad,
} from "react-icons/fa";

function RageRoomView({
  onToggleViewMode,
  onSwitchGame,
  isEmbedded = false,
  onOpenFullscreen,
}) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  const [activeWeapon, setActiveWeapon] = useState(WEAPONS[0]);
  const [activeWeaponIndex, setActiveWeaponIndex] = useState(0);
  const [stats, setStats] = useState({
    mode: "free",
    timeRemaining: 60,
    score: 0,
    rage: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    targetZone: null,
    isPaused: false,
    isGameOver: false,
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [endStats, setEndStats] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new RageRoomEngine(container, {
      mode: "free",
      onStatsChange: (newStats) => {
        setStats(newStats);
        if (newStats.activeWeapon) {
          setActiveWeapon(newStats.activeWeapon);
        }
      },
      onModeEnd: (finalStats) => {
        setEndStats(finalStats);
        setShowGameOverModal(true);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      rageSound.stopBgm();
    };
  }, []);

  const handleWeaponSelect = (index) => {
    setActiveWeaponIndex(index);
    setActiveWeapon(WEAPONS[index]);
    if (engineRef.current) {
      engineRef.current.selectWeapon(index);
    }
  };

  const handleModeSelect = (mode) => {
    setShowGameOverModal(false);
    if (engineRef.current) {
      engineRef.current.setMode(mode);
    }
  };

  const handleAttack = () => {
    if (engineRef.current) {
      engineRef.current.attack();
    }
  };

  const handleResetDummy = () => {
    if (engineRef.current) {
      engineRef.current.resetDummy();
      rageSound.playSwing();
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    rageSound.setMuted(next);
    if (!next) rageSound.playFoamBonk();
  };

  const toggleBgm = () => {
    const next = !isBgmOn;
    setIsBgmOn(next);
    rageSound.toggleBgm();
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

  // Embedded Mini-Mode (on website home page)
  if (isEmbedded) {
    return (
      <div className="relative w-full h-[550px] sm:h-[650px] overflow-hidden rounded-[2rem] border-2 border-rose-500/60 bg-slate-950 shadow-2xl select-none">
        <div
          ref={containerRef}
          className="relative h-full w-full touch-none cursor-crosshair active:cursor-grabbing"
        />

        {/* Center Crosshair */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-rose-400/80 bg-rose-500/20" />
            <div className="absolute h-1 w-1 rounded-full bg-white shadow-lg" />
          </div>
        </div>

        {/* Top Embedded Bar */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3 sm:p-4 z-30">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-rose-500/50 bg-slate-950/90 px-3.5 py-1.5 text-xs text-rose-300 shadow backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">RAGE ROOM 3D</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-bold">Score: {stats.score}</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300 font-bold">Rage: {stats.rage}%</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {onSwitchGame && (
              <button
                onClick={onSwitchGame}
                type="button"
                className="flex items-center gap-1 rounded-full border border-gold-500/60 bg-brand-950/80 px-3 py-1.5 text-xs font-bold text-gold-300 shadow hover:bg-brand-900 transition"
                title="Switch to Citadel 3D RPG Realm"
              >
                <span>🏰</span>
                <span className="hidden sm:inline">Citadel 3D</span>
              </button>
            )}
            <button
              onClick={toggleSound}
              type="button"
              className="rounded-full border border-slate-700 bg-slate-950/85 p-2 text-slate-300 shadow hover:border-rose-500 hover:text-rose-300 backdrop-blur-md transition"
              title="Toggle Audio"
            >
              {isMuted ? <FaVolumeMute size={12} /> : <FaVolumeUp size={12} />}
            </button>
            <button
              onClick={onOpenFullscreen}
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-rose-500/70 bg-gradient-to-r from-rose-600 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:scale-105 transition"
            >
              <FaExpand size={11} />
              <span>Fullscreen 3D</span>
            </button>
          </div>
        </div>

        {/* Embedded Bottom Weapon Switcher */}
        <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-2xl border border-rose-500/40 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-md z-20 max-w-full overflow-x-auto">
          {WEAPONS.slice(0, 5).map((w, idx) => (
            <button
              key={w.id}
              onClick={() => handleWeaponSelect(idx)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                activeWeaponIndex === idx
                  ? "bg-rose-600 text-white shadow"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{w.icon}</span>
              <span className="hidden md:inline">{w.name}</span>
            </button>
          ))}
        </div>

        {/* Mobile touch controls */}
        <VirtualJoystick
          onMove={(dx, dy) => engineRef.current?.setJoystickInput(dx, dy)}
          onAttack={handleAttack}
          onAction={handleResetDummy}
        />
      </div>
    );
  }

  // Fullscreen Immersive Mode
  return (
    <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="relative h-full w-full touch-none cursor-crosshair active:cursor-grabbing"
      />

      {/* Center Screen Crosshair */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-30">
        <div className="relative flex items-center justify-center">
          <div
            className={`h-5 w-5 rounded-full border-2 transition-transform duration-100 ${
              stats.combo > 0
                ? "border-amber-400 scale-125 bg-amber-400/20"
                : "border-rose-400/80 bg-rose-500/15"
            }`}
          />
          <div className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-lg" />
        </div>
      </div>

      {/* Combo Floating Badge */}
      {stats.combo > 1 && (
        <div className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-slate-950/95 px-5 py-2 text-sm sm:text-base font-black text-amber-300 shadow-2xl backdrop-blur-md">
            <span className="text-xl">🔥</span>
            <span>{stats.combo}x COMBO!</span>
            {stats.combo >= 10 && <span className="text-rose-400 animate-pulse">FRENZY!</span>}
          </div>
        </div>
      )}

      {/* Target Practice Banner */}
      {stats.targetZone && (
        <div className="pointer-events-none fixed top-36 left-1/2 -translate-x-1/2 z-30 animate-pulse">
          <div className="flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-yellow-950/90 px-4 py-1.5 text-xs font-black text-yellow-300 shadow-xl backdrop-blur-md">
            <span>🎯</span>
            <span>AIM FOR: {stats.targetZone.toUpperCase()} (+250% BONUS)</span>
          </div>
        </div>
      )}

      {/* TOP HEADER HUD */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 p-2.5 sm:p-4">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-2 sm:gap-3">
          
          {/* Left: Game Identity & Score Badge */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-rose-500/60 bg-slate-950/95 p-2.5 px-4 shadow-2xl backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-2xl shadow-lg">
              🥊
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wide text-white font-heading">
                  RAGE ROOM 3D
                </span>
                <span className="rounded-full border border-rose-500/60 bg-rose-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-rose-300">
                  {stats.mode}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs mt-0.5 font-bold">
                <span className="text-amber-300">Score: {stats.score}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Hits: {stats.hits}</span>
              </div>
            </div>
          </div>

          {/* Center: Large Dynamic Rage Meter */}
          <div className="pointer-events-auto hidden md:flex flex-col items-center gap-1 rounded-2xl border border-rose-500/50 bg-slate-950/90 px-6 py-2 shadow-2xl backdrop-blur-md min-w-[280px]">
            <div className="flex items-center justify-between w-full text-xs font-black">
              <span className="text-rose-400 flex items-center gap-1">
                <span>⚡</span>
                <span>RAGE METER</span>
              </span>
              <span className={`text-xs ${stats.rage >= 90 ? "text-rose-400 animate-ping" : "text-amber-300"}`}>
                {stats.rage}% {stats.rage >= 100 && "MAX FRENZY!"}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full border border-rose-800 bg-slate-900">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-200"
                style={{ width: `${stats.rage}%` }}
              />
            </div>
            {/* Timed Mode Remaining Countdown */}
            {stats.mode === "timed" && (
              <span className="text-[11px] font-black text-rose-400 mt-0.5">
                ⏱️ Time Left: {stats.timeRemaining}s
              </span>
            )}
          </div>

          {/* Right: Actions & Switchers */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Reset Dummy */}
            <button
              onClick={handleResetDummy}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs font-bold text-slate-300 shadow hover:border-amber-500 hover:text-amber-300 backdrop-blur-md transition"
              title="Reset Dummy and Props [R]"
            >
              <FaRedo size={12} />
              <span className="hidden lg:inline">Reset</span>
            </button>

            {/* Instructions Help */}
            <button
              onClick={() => setShowInstructions(true)}
              className="rounded-xl border border-rose-500/60 bg-slate-950/85 p-2.5 text-rose-300 shadow hover:scale-105 backdrop-blur-md transition"
              title="How to Play"
            >
              <FaQuestionCircle size={15} />
            </button>

            {/* Lo-fi / Arcade Synth BGM Toggle */}
            <button
              onClick={toggleBgm}
              className={`rounded-xl border p-2.5 shadow backdrop-blur-md transition ${
                isBgmOn
                  ? "border-emerald-500 bg-emerald-950/70 text-emerald-300"
                  : "border-slate-700 bg-slate-950/85 text-slate-400 hover:border-slate-500"
              }`}
              title="Toggle Arcade Synth Music"
            >
              <FaMusic size={13} />
            </button>

            {/* Sound FX Audio Toggle */}
            <button
              onClick={toggleSound}
              className="rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-rose-500 hover:text-rose-300 backdrop-blur-md transition"
              title="Toggle Sound Effects"
            >
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:block rounded-xl border border-slate-700 bg-slate-950/85 p-2.5 text-slate-300 shadow hover:border-rose-500 hover:text-rose-300 backdrop-blur-md transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
            </button>

            {/* Switch Game Button: back to Citadel 3D RPG Realm */}
            {onSwitchGame && (
              <button
                onClick={onSwitchGame}
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-gold-500/80 bg-gradient-to-r from-brand-700 to-gold-600 px-3.5 py-2 text-xs font-black text-white shadow-xl transition hover:scale-105"
                title="Switch to Citadel 3D Portfolio Adventure"
              >
                <FaGamepad size={13} />
                <span className="font-extrabold hidden md:inline">Citadel 3D RPG</span>
              </button>
            )}

            {/* Switch to Classic Website */}
            <button
              onClick={onToggleViewMode}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-black text-slate-200 shadow-xl transition hover:border-slate-500 hover:text-white"
              title="Return to traditional portfolio view"
            >
              <FaGlobe size={13} />
              <span className="font-extrabold hidden sm:inline">Classic Website</span>
            </button>
          </div>
        </div>

        {/* Game Mode Selector Bar (Top Sub-Bar) */}
        <div className="pointer-events-auto mx-auto mt-2 flex max-w-xl items-center justify-center gap-1 sm:gap-2 rounded-2xl border border-rose-500/40 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-md">
          {[
            { id: "free", label: "Free Rage", icon: "♾️" },
            { id: "timed", label: "60s Blitz", icon: "⏱️" },
            { id: "combo", label: "Combo Streak", icon: "🔥" },
            { id: "target", label: "Target Practice", icon: "🎯" },
            { id: "zen", label: "Zen Reset", icon: "🧘" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeSelect(m.id)}
              className={`flex items-center gap-1 rounded-xl px-2.5 sm:px-3 py-1 text-xs font-bold transition ${
                stats.mode === m.id
                  ? "bg-rose-600 text-white shadow"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span>{m.icon}</span>
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* BOTTOM WEAPON SELECTOR HOTBAR */}
      <div className="pointer-events-auto fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-[95vw]">
        {/* Controls Quick Hint */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/80 px-4 py-0.5 text-[11px] text-slate-400 shadow backdrop-blur-md">
          <span>Click / Space: <strong className="text-rose-400">Strike</strong></span>
          <span>•</span>
          <span>Keys [1-8]: <strong className="text-amber-300">Equip</strong></span>
          <span>•</span>
          <span>[R]: <strong className="text-cyan-300">Reset Dummy</strong></span>
          <span>•</span>
          <span>WASD: <strong className="text-white">Walk</strong></span>
        </div>

        {/* 8 Equipment Cards */}
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-3xl border-2 border-rose-500/50 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl overflow-x-auto max-w-full">
          {WEAPONS.map((w, idx) => {
            const isSelected = activeWeaponIndex === idx;
            return (
              <button
                key={w.id}
                onClick={() => handleWeaponSelect(idx)}
                className={`relative flex flex-col items-center justify-center rounded-2xl p-2 sm:p-2.5 transition duration-150 min-w-[56px] sm:min-w-[72px] ${
                  isSelected
                    ? "border-2 border-rose-400 bg-gradient-to-b from-rose-600/60 to-rose-950/80 text-white scale-105 shadow-xl"
                    : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-rose-500/50 hover:bg-slate-800"
                }`}
                title={`${w.name}: ${w.desc} [Key ${idx + 1}]`}
              >
                <div className="absolute top-1 right-1.5 text-[9px] font-mono font-black text-slate-500">
                  {idx + 1}
                </div>
                <span className="text-xl sm:text-2xl mt-1">{w.icon}</span>
                <span className="text-[10px] sm:text-[11px] font-bold mt-1 truncate max-w-[62px]">
                  {w.name.split(" ")[0]}
                </span>
                {isSelected && (
                  <div className="absolute -bottom-1 h-1 w-6 rounded-full bg-rose-400 shadow-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Virtual Joystick & Action Buttons */}
      <VirtualJoystick
        onMove={(dx, dy) => engineRef.current?.setJoystickInput(dx, dy)}
        onAttack={handleAttack}
        onAction={handleResetDummy}
      />

      {/* 🌟 INSTRUCTIONS & CONTROLS MODAL 🌟 */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-rose-500/70 bg-slate-950/95 p-6 text-slate-100 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-lg font-black text-rose-400 font-heading">
                <span>🥊</span>
                <span>RAGE ROOM 3D • ARCADE RULES</span>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="rounded-full border border-slate-700 p-1.5 text-slate-400 hover:text-white"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300">
              <p>
                Release your stress and frustration in this arcade-style 3D room by hitting the funny spring dummy with 8 fictional cartoon weapons!
              </p>

              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-3 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-rose-300 font-bold">Left Click / Space:</span>
                  <span>Strike / Shoot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-300 font-bold">Mouse Drag:</span>
                  <span>Look around 360°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-300 font-bold">WASD / Arrow Keys:</span>
                  <span>Walk around the room</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-300 font-bold">Number Keys [1-8]:</span>
                  <span>Quick switch equipment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-300 font-bold">[R] Key:</span>
                  <span>Reset dummy & props</span>
                </div>
              </div>

              <h4 className="text-xs font-black uppercase text-amber-300 pt-1">
                Fictional Equipment Arsenal:
              </h4>
              <ul className="grid grid-cols-2 gap-1.5 text-xs">
                <li>🏏 <strong>Foam Bat:</strong> Fast boing swing</li>
                <li>🥊 <strong>Boxing Glove:</strong> Heavy spring punch</li>
                <li>🔨 <strong>Rubber Hammer:</strong> Cartoon squash & squeak</li>
                <li>⚡ <strong>Energy Hammer:</strong> Cyan plasma blast</li>
                <li>🎾 <strong>Tennis Launcher:</strong> Bouncing balls</li>
                <li>🎨 <strong>Paint Blaster:</strong> Colorful splatters</li>
                <li>🎉 <strong>Confetti Cannon:</strong> Paper party storm</li>
                <li>🌀 <strong>Shockwave:</strong> Radial concussive wave</li>
              </ul>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 text-xs font-black text-white shadow-xl hover:scale-105 transition"
            >
              GOT IT • LET&apos;S SMASH!
            </button>
          </div>
        </div>
      )}

      {/* 🌟 60s BLITZ END-OF-ROUND MODAL 🌟 */}
      {showGameOverModal && endStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-rose-500 bg-slate-950/95 p-6 text-center text-slate-100 shadow-2xl backdrop-blur-xl">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-2xl font-black text-white font-heading">
              TIME&apos;S UP!
            </h3>
            <p className="text-xs text-rose-400 font-bold mt-0.5">
              60-Second Challenge Complete
            </p>

            <div className="my-5 grid grid-cols-3 gap-2 rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Score</p>
                <p className="text-xl font-black text-amber-300">{endStats.score}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Max Combo</p>
                <p className="text-xl font-black text-rose-400">{endStats.maxCombo}x</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Hits</p>
                <p className="text-xl font-black text-emerald-400">{endStats.hits}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleModeSelect("timed")}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 text-xs font-black text-white shadow-xl hover:scale-105 transition"
              >
                Play Again (60s)
              </button>
              <button
                onClick={() => handleModeSelect("free")}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-black text-slate-200 hover:bg-slate-800 transition"
              >
                Free Rage Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RageRoomView;
