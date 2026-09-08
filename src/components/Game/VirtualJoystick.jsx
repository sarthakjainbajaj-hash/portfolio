import { useEffect, useRef } from "react";

function VirtualJoystick({ onMove, onAction, onAttack }) {
  const stickRef = useRef(null);
  const baseRef = useRef(null);
  const touchIdRef = useRef(null);

  useEffect(() => {
    const base = baseRef.current;
    const stick = stickRef.current;
    if (!base || !stick) return;

    const baseRadius = 50;
    let baseCenter = { x: 0, y: 0 };

    const updateBaseCenter = () => {
      const rect = base.getBoundingClientRect();
      baseCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const handleTouchStart = (e) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      updateBaseCenter();
      handleTouchMove(e);
    };

    const handleTouchMove = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          const dx = touch.clientX - baseCenter.x;
          const dy = touch.clientY - baseCenter.y;
          const dist = Math.hypot(dx, dy);

          const angle = Math.atan2(dy, dx);
          const clampedDist = Math.min(dist, baseRadius);

          const stickX = Math.cos(angle) * clampedDist;
          const stickY = Math.sin(angle) * clampedDist;

          stick.style.transform = `translate(${stickX}px, ${stickY}px)`;
          onMove(stickX / baseRadius, stickY / baseRadius);
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          stick.style.transform = "translate(0px, 0px)";
          onMove(0, 0);
          break;
        }
      }
    };

    base.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      base.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [onMove]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex items-end justify-between px-6 md:hidden">
      {/* Virtual D-Pad */}
      <div
        ref={baseRef}
        className="pointer-events-auto relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-500/40 bg-slate-950/70 shadow-2xl backdrop-blur-md"
      >
        <div
          ref={stickRef}
          className="h-12 w-12 rounded-full border-2 border-gold-400 bg-gradient-to-tr from-brand-600 to-gold-500 shadow-md"
        />
      </div>

      {/* Action & Attack Buttons */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Sword Attack Button */}
        <button
          onClick={onAttack}
          type="button"
          aria-label="Attack with sword"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-gradient-to-br from-red-600 to-amber-600 text-lg font-extrabold text-white shadow-2xl active:scale-90"
        >
          ⚔️
        </button>

        {/* Interact Button */}
        <button
          onClick={onAction}
          type="button"
          aria-label="Interact"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500 bg-gradient-to-br from-brand-600 to-gold-600 text-xs font-extrabold text-white shadow-xl active:scale-90"
        >
          [E]
        </button>
      </div>
    </div>
  );
}

export default VirtualJoystick;
