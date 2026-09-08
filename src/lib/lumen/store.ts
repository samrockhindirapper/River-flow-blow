import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { dateKey, yesterdayKey } from "./format";
import { nextSceneId, type SceneId } from "./scenes";

export type Mode = "focus" | "short" | "long";

export type SessionLog = {
  id: string;
  mode: Mode;
  minutes: number;
  intention: string;
  at: number;
};

export type Durations = {
  focus: number;
  short: number;
  long: number;
};

type Persisted = {
  hasBegun: boolean;
  mode: Mode;
  remainingMs: number;
  durations: Durations;
  sceneId: SceneId;
  soundOn: boolean;
  volume: number;
  intention: string;
  todayKey: string;
  todayMinutes: number;
  sessionsToday: number;
  streak: number;
  lastActiveDay: string | null;
  focusSinceLong: number;
  log: SessionLog[];
};

type LumenState = Persisted & {
  running: boolean;
  endsAt: number | null;
  completeKind: Mode | null;
  begin: () => void;
  setMode: (mode: Mode) => void;
  setScene: (id: SceneId) => void;
  cycleScene: (dir: 1 | -1) => void;
  setIntention: (value: string) => void;
  setSoundOn: (on: boolean) => void;
  toggleSound: () => void;
  setVolume: (v: number) => void;
  setDuration: (mode: Mode, minutes: number) => void;
  start: () => void;
  pause: () => void;
  toggleRun: () => void;
  reset: () => void;
  tick: () => void;
  skipComplete: (next: Mode) => void;
  dismissComplete: () => void;
  rollDay: () => void;
  clearStats: () => void;
};

const DEFAULT_DURATIONS: Durations = { focus: 25, short: 5, long: 15 };

function msFor(mode: Mode, durations: Durations) {
  return durations[mode] * 60 * 1000;
}

function clampMinutes(n: number) {
  return Math.min(90, Math.max(1, Math.round(n)));
}

export const MODE_LABEL: Record<Mode, string> = {
  focus: "Focus",
  short: "Short break",
  long: "Long break",
};

export const useLumen = create<LumenState>()(
  persist(
    (set, get) => ({
      hasBegun: false,
      mode: "focus",
      remainingMs: msFor("focus", DEFAULT_DURATIONS),
      running: false,
      endsAt: null,
      completeKind: null,
      durations: DEFAULT_DURATIONS,
      sceneId: "rain",
      soundOn: true,
      volume: 0.42,
      intention: "",
      todayKey: dateKey(),
      todayMinutes: 0,
      sessionsToday: 0,
      streak: 0,
      lastActiveDay: null,
      focusSinceLong: 0,
      log: [],

      begin: () => set({ hasBegun: true }),

      setMode: (mode) => {
        const { running, durations } = get();
        if (running) return;
        set({
          mode,
          remainingMs: msFor(mode, durations),
          completeKind: null,
        });
      },

      setScene: (sceneId) => set({ sceneId }),

      cycleScene: (dir) => set({ sceneId: nextSceneId(get().sceneId, dir) }),

      setIntention: (intention) => set({ intention }),

      setSoundOn: (soundOn) => set({ soundOn }),

      toggleSound: () => set({ soundOn: !get().soundOn }),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      setDuration: (mode, minutes) => {
        const durations = { ...get().durations, [mode]: clampMinutes(minutes) };
        const patch: Partial<LumenState> = { durations };
        if (!get().running && get().mode === mode) {
          patch.remainingMs = msFor(mode, durations);
        }
        set(patch);
      },

      start: () => {
        const { remainingMs, running } = get();
        if (running || remainingMs <= 0) return;
        set({
          running: true,
          endsAt: Date.now() + remainingMs,
          completeKind: null,
        });
      },

      pause: () => {
        const { running, endsAt } = get();
        if (!running) return;
        const remainingMs = Math.max(0, (endsAt ?? Date.now()) - Date.now());
        set({ running: false, endsAt: null, remainingMs });
      },

      toggleRun: () => {
        const { running, completeKind } = get();
        if (completeKind) return;
        if (running) get().pause();
        else get().start();
      },

      reset: () => {
        const { mode, durations } = get();
        set({
          running: false,
          endsAt: null,
          remainingMs: msFor(mode, durations),
          completeKind: null,
        });
      },

      tick: () => {
        const { running, endsAt } = get();
        if (!running || endsAt == null) return;
        const remainingMs = Math.max(0, endsAt - Date.now());
        if (remainingMs <= 0) {
          completeSession(set, get);
        } else {
          set({ remainingMs });
        }
      },

      skipComplete: (next) => {
        const { durations } = get();
        set({
          completeKind: null,
          mode: next,
          remainingMs: msFor(next, durations),
          running: false,
          endsAt: null,
        });
      },

      dismissComplete: () => {
        const { mode, durations } = get();
        set({
          completeKind: null,
          remainingMs: msFor(mode, durations),
          running: false,
          endsAt: null,
        });
      },

      rollDay: () => {
        const key = dateKey();
        const s = get();
        if (s.todayKey === key) return;
        const keepStreak =
          s.lastActiveDay === key || s.lastActiveDay === yesterdayKey();
        set({
          todayKey: key,
          todayMinutes: 0,
          sessionsToday: 0,
          streak: keepStreak ? s.streak : 0,
          log: s.log.filter((entry) => dateKey(new Date(entry.at)) === key),
        });
      },

      clearStats: () =>
        set({
          todayMinutes: 0,
          sessionsToday: 0,
          streak: 0,
          lastActiveDay: null,
          focusSinceLong: 0,
          log: [],
        }),
    }),
    {
      name: "lumen-studio",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): Persisted => ({
        hasBegun: s.hasBegun,
        mode: s.mode,
        remainingMs:
          s.running && s.endsAt
            ? Math.max(0, s.endsAt - Date.now())
            : s.remainingMs,
        durations: s.durations,
        sceneId: s.sceneId,
        soundOn: s.soundOn,
        volume: s.volume,
        intention: s.intention,
        todayKey: s.todayKey,
        todayMinutes: s.todayMinutes,
        sessionsToday: s.sessionsToday,
        streak: s.streak,
        lastActiveDay: s.lastActiveDay,
        focusSinceLong: s.focusSinceLong,
        log: s.log.slice(0, 20),
      }),
    },
  ),
);

type SetFn = {
  (partial: Partial<LumenState>): void;
};

function completeSession(
  set: SetFn,
  get: () => LumenState,
) {
  const s = get();
  if (s.completeKind) return;
  const planned = s.durations[s.mode];
  const today = dateKey();
  const isFocus = s.mode === "focus";
  let streak = s.streak;
  let lastActiveDay = s.lastActiveDay;
  let sessionsToday = s.sessionsToday;
  let todayMinutes = s.todayMinutes;
  let focusSinceLong = s.focusSinceLong;

  if (isFocus) {
    todayMinutes += planned;
    sessionsToday += 1;
    focusSinceLong += 1;
    if (lastActiveDay !== today) {
      streak = lastActiveDay === yesterdayKey() ? streak + 1 : 1;
      lastActiveDay = today;
    }
  } else if (s.mode === "long") {
    focusSinceLong = 0;
  }

  const entry: SessionLog = {
    id: crypto.randomUUID(),
    mode: s.mode,
    minutes: planned,
    intention: isFocus ? s.intention.trim() : "",
    at: Date.now(),
  };

  set({
    running: false,
    endsAt: null,
    remainingMs: 0,
    completeKind: s.mode,
    todayKey: today,
    todayMinutes,
    sessionsToday,
    streak,
    lastActiveDay,
    focusSinceLong,
    log: [entry, ...s.log].slice(0, 20),
  });
}

export function suggestedNext(state: LumenState): Mode {
  if (state.completeKind === "focus") {
    return state.focusSinceLong >= 4 ? "long" : "short";
  }
  return "focus";
}
