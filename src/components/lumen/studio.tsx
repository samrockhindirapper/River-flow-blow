import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/lumen/settings-panel";
import { soundscape } from "@/lib/lumen/audio";
import { formatClock, formatMinutes } from "@/lib/lumen/format";
import { SCENES, sceneById } from "@/lib/lumen/scenes";
import {
  MODE_LABEL,
  useLumen,
  type Mode,
} from "@/lib/lumen/store";
import { cn } from "@/lib/utils";

const MODES: Mode[] = ["focus", "short", "long"];

export function Studio() {
  const hasBegun = useLumen((s) => s.hasBegun);
  const begin = useLumen((s) => s.begin);

  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      await Promise.resolve(useLumen.persist.rehydrate());
      if (cancelled) return;
      useLumen.getState().rollDay();
    };
    void go();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasBegun) {
    return <StartScreen onBegin={begin} />;
  }

  return <Session />;
}

function Shell({ children }: { children?: ReactNode }) {
  const sceneId = useLumen((s) => s.sceneId);
  const scene = sceneById(sceneId);

  return (
    <main className="relative h-dvh min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        className="absolute inset-0"
        style={{ background: scene.fallback }}
        aria-hidden
      />
      <img
        src={scene.src}
        alt=""
        className="scene-ken absolute inset-0 size-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="vignette absolute inset-0" />
      <div className="grain absolute inset-0" />
      {children}
    </main>
  );
}

function StartScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <Shell>
      <div className="pad-safe relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="stagger-in text-xs font-medium tracking-[0.22em] text-muted uppercase">
          Focus studio
        </p>
        <h1 className="stagger-in font-display mt-4 text-6xl tracking-tight italic sm:text-7xl">
          Lumen
        </h1>
        <p className="stagger-in mt-4 max-w-xs text-pretty text-base text-muted">
          A quieter way to work. One interval, one scene, nothing else.
        </p>
        <div className="stagger-in mt-10">
          <Button
            size="lg"
            onClick={() => {
              void soundscape.resume();
              onBegin();
            }}
          >
            Begin
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Session() {
  const mode = useLumen((s) => s.mode);
  const remainingMs = useLumen((s) => s.remainingMs);
  const running = useLumen((s) => s.running);
  const completeKind = useLumen((s) => s.completeKind);
  const durations = useLumen((s) => s.durations);
  const sceneId = useLumen((s) => s.sceneId);
  const soundOn = useLumen((s) => s.soundOn);
  const volume = useLumen((s) => s.volume);
  const intention = useLumen((s) => s.intention);
  const todayMinutes = useLumen((s) => s.todayMinutes);
  const streak = useLumen((s) => s.streak);
  const start = useLumen((s) => s.start);
  const pause = useLumen((s) => s.pause);
  const toggleRun = useLumen((s) => s.toggleRun);
  const reset = useLumen((s) => s.reset);
  const tick = useLumen((s) => s.tick);
  const setMode = useLumen((s) => s.setMode);
  const setScene = useLumen((s) => s.setScene);
  const cycleScene = useLumen((s) => s.cycleScene);
  const setIntention = useLumen((s) => s.setIntention);
  const toggleSound = useLumen((s) => s.toggleSound);
  const skipComplete = useLumen((s) => s.skipComplete);
  const focusSinceLong = useLumen((s) => s.focusSinceLong);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chrome, setChrome] = useState(true);
  const prevComplete = useRef<Mode | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(tick, 200);
    const onVis = () => tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running, tick]);

  useEffect(() => {
    if (completeKind && prevComplete.current !== completeKind && soundOn) {
      soundscape.chime();
    }
    prevComplete.current = completeKind;
  }, [completeKind, soundOn]);

  useEffect(() => {
    if (!soundOn) {
      soundscape.stop();
      return;
    }
    soundscape.setVolume(volume);
    if (running) void soundscape.play(sceneId);
    else if (completeKind) soundscape.duck();
    else soundscape.duck();
  }, [soundOn, running, sceneId, volume, completeKind]);

  useEffect(() => {
    if (!running || settingsOpen || completeKind) {
      setChrome(true);
      return;
    }
    let hide = window.setTimeout(() => setChrome(false), 4200);
    const bump = () => {
      setChrome(true);
      window.clearTimeout(hide);
      hide = window.setTimeout(() => setChrome(false), 4200);
    };
    window.addEventListener("pointermove", bump);
    window.addEventListener("touchstart", bump);
    return () => {
      window.clearTimeout(hide);
      window.removeEventListener("pointermove", bump);
      window.removeEventListener("touchstart", bump);
    };
  }, [running, settingsOpen, completeKind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.code === "Space" && !typing) {
        e.preventDefault();
        toggleRun();
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "1") setMode("focus");
      if (e.key === "2") setMode("short");
      if (e.key === "3") setMode("long");
      if (e.key === "[") cycleScene(-1);
      if (e.key === "]") cycleScene(1);
      if (e.key === "m" || e.key === "M") toggleSound();
      if (e.key === "r" || e.key === "R") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleRun, setMode, cycleScene, toggleSound, reset]);

  const totalMs = durations[mode] * 60 * 1000;
  const progress = totalMs === 0 ? 0 : 1 - remainingMs / totalMs;
  const next: Mode =
    completeKind === "focus"
      ? focusSinceLong >= 4
        ? "long"
        : "short"
      : "focus";
  const scene = sceneById(sceneId);

  return (
    <Shell>
      <div className="pad-safe relative z-10 flex h-full flex-col">
        <header
          className={cn(
            "flex items-center justify-between gap-3 transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            chrome
              ? "opacity-100"
              : "pointer-events-none opacity-0 -translate-y-1",
          )}
        >
          <div className="min-w-0">
            <p className="font-display text-xl tracking-tight italic">Lumen</p>
            <p className="truncate text-xs text-muted tabular-nums">
              {formatMinutes(todayMinutes)} today
              {streak > 0 ? ` · ${streak}d streak` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="quiet"
              size="icon"
              aria-label={soundOn ? "Mute soundscape" : "Unmute soundscape"}
              onClick={toggleSound}
            >
              <span className="relative block size-5">
                <Volume2
                  className={cn(
                    "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                    soundOn
                      ? "scale-100 opacity-100 blur-none"
                      : "scale-[0.25] opacity-0 blur-[4px]",
                  )}
                  strokeWidth={1.75}
                />
                <VolumeX
                  className={cn(
                    "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                    !soundOn
                      ? "scale-100 opacity-100 blur-none"
                      : "scale-[0.25] opacity-0 blur-[4px]",
                  )}
                  strokeWidth={1.75}
                />
              </span>
            </Button>
            <Button
              variant="quiet"
              size="icon"
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="size-5" strokeWidth={1.75} />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-4">
          {completeKind ? (
            <CompleteCard
              kind={completeKind}
              next={next}
              intention={intention}
              onNext={(m) => skipComplete(m)}
            />
          ) : (
            <>
              <div
                className={cn(
                  "mb-8 flex gap-1 rounded-full bg-background/30 p-1 shadow-[var(--shadow-border)] transition-opacity duration-[var(--motion-fast)]",
                  chrome ? "opacity-100" : "opacity-0",
                )}
                role="tablist"
                aria-label="Interval type"
              >
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    disabled={running}
                    onClick={() => setMode(m)}
                    className={cn(
                      "h-9 rounded-full px-3.5 text-xs font-medium tracking-wide uppercase transition-colors duration-[var(--motion-quick)]",
                      mode === m
                        ? "bg-foreground text-background"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {m === "focus" ? "Focus" : m === "short" ? "Short" : "Long"}
                  </button>
                ))}
              </div>

              <p
                className="text-xs font-medium tracking-[0.22em] text-muted uppercase"
                aria-live="polite"
              >
                {MODE_LABEL[mode]}
              </p>
              <p
                className="font-display text-timer mt-2 tabular-nums tracking-tight"
                aria-label={`${formatClock(remainingMs)} remaining`}
              >
                {formatClock(remainingMs)}
              </p>
              <div className="mt-5 h-px w-44 overflow-hidden bg-foreground/15">
                <div
                  className="h-full origin-left bg-foreground/70 transition-transform duration-[var(--motion-quick)] ease-linear"
                  style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }}
                />
              </div>

              <div className="mt-10 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Reset interval"
                  onClick={reset}
                >
                  <RotateCcw className="size-5" strokeWidth={1.75} />
                </Button>
                <Button
                  size="icon"
                  className="size-16"
                  aria-label={running ? "Pause" : "Start"}
                  onClick={() => {
                    void soundscape.resume();
                    if (running) pause();
                    else start();
                  }}
                >
                  <span className="relative block size-6">
                    <Pause
                      className={cn(
                        "absolute inset-0 size-6 transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                        running
                          ? "scale-100 opacity-100 blur-none"
                          : "scale-[0.25] opacity-0 blur-[4px]",
                      )}
                      strokeWidth={1.75}
                    />
                    <Play
                      className={cn(
                        "absolute inset-0 size-6 translate-x-px transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                        !running
                          ? "scale-100 opacity-100 blur-none"
                          : "scale-[0.25] opacity-0 blur-[4px]",
                      )}
                      strokeWidth={1.75}
                    />
                  </span>
                </Button>
                <span className="size-11" aria-hidden />
              </div>

              {mode === "focus" && (
                <label
                  className={cn(
                    "mt-8 w-full max-w-sm transition-opacity duration-[var(--motion-fast)]",
                    chrome ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="sr-only">What are you focusing on</span>
                  <input
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="What are you focusing on?"
                    maxLength={80}
                    className="h-11 w-full border-0 border-b border-border bg-transparent text-center text-sm text-foreground outline-none placeholder:text-subtle focus:border-line"
                  />
                </label>
              )}
            </>
          )}
        </div>

        <nav
          className={cn(
            "transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            chrome
              ? "opacity-100"
              : "pointer-events-none opacity-0 translate-y-1",
          )}
          aria-label="Scenes"
        >
          <p className="mb-2 px-1 text-xs text-muted">{scene.sound}</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
            {SCENES.map((item) => {
              const selected = item.id === sceneId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScene(item.id)}
                  className={cn(
                    "relative h-16 w-20 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-28",
                    selected
                      ? "shadow-[var(--shadow-border-hover)] ring-1 ring-foreground"
                      : "shadow-[var(--shadow-border)] opacity-80 hover:opacity-100",
                  )}
                  aria-pressed={selected}
                  aria-label={item.name}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="size-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-background/55 px-1.5 py-1 text-xs leading-none text-foreground">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Shell>
  );
}

function CompleteCard({
  kind,
  next,
  intention,
  onNext,
}: {
  kind: Mode;
  next: Mode;
  intention: string;
  onNext: (mode: Mode) => void;
}) {
  const focusDone = kind === "focus";
  const title = focusDone
    ? "That's a full interval."
    : "Break's over.";
  const body = focusDone
    ? intention.trim() || "Ready for a short rest, or keep going."
    : "Whenever you are.";

  return (
    <div className="stagger-in max-w-sm text-center">
      <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty text-muted">{body}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={() => onNext(next)}>
          {next === "focus"
            ? "Start focusing"
            : next === "long"
              ? "Take a longer break"
              : "Take a short break"}
        </Button>
        {focusDone && next !== "focus" && (
          <Button variant="ghost" size="lg" onClick={() => onNext("focus")}>
            Keep going
          </Button>
        )}
      </div>
    </div>
  );
}
