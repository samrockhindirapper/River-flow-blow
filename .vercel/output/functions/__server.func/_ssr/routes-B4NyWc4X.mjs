import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Settings2, c as Play, l as Pause, n as VolumeX, o as RotateCcw, r as Volume2, s as Plus, t as X, u as Minus } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B4NyWc4X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[transform,opacity,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-foreground text-background shadow-[var(--shadow-border)] hover:opacity-90",
			ghost: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-foreground/10",
			quiet: "bg-transparent text-muted hover:text-foreground"
		},
		size: {
			md: "h-11 px-5 text-sm rounded-md",
			lg: "h-12 px-6 text-sm rounded-lg",
			icon: "size-11 rounded-full p-0"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(function Button({ className, variant, size, type = "button", ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
function Slider({ value, onValueChange, min = 0, max = 1, step = .01, label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		value: [value],
		min,
		max,
		step,
		onValueChange: (v) => onValueChange(v[0] ?? min),
		"aria-label": label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow rounded-full bg-foreground/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-foreground" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-foreground shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50" })]
	});
}
function dateKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function yesterdayKey() {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - 1);
	return dateKey(d);
}
function formatClock(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function formatMinutes(mins) {
	if (mins < 60) return `${mins}m`;
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return m ? `${h}h ${m}m` : `${h}h`;
}
var SCENES = [
	{
		id: "rain",
		name: "Loft rain",
		sound: "Rain on glass",
		src: "/scenes/rain.jpg",
		fallback: "linear-gradient(180deg, #1a2230 0%, #0c0d10 55%, #14110e 100%)"
	},
	{
		id: "forest",
		name: "Pine dusk",
		sound: "Wind in pines",
		src: "/scenes/forest.jpg",
		fallback: "linear-gradient(180deg, #6a7a72 0%, #243028 50%, #101412 100%)"
	},
	{
		id: "cafe",
		name: "Night cafe",
		sound: "Quiet room",
		src: "/scenes/cafe.jpg",
		fallback: "linear-gradient(180deg, #2a241c 0%, #161310 55%, #0c0b0a 100%)"
	},
	{
		id: "coast",
		name: "Sea fog",
		sound: "Low tide",
		src: "/scenes/coast.jpg",
		fallback: "linear-gradient(180deg, #8a939c 0%, #4a5560 40%, #1a1e24 100%)"
	}
];
function sceneById(id) {
	return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
function nextSceneId(id, dir) {
	const i = SCENES.findIndex((s) => s.id === id);
	const n = SCENES.length;
	return SCENES[(i + dir + n) % n].id;
}
var DEFAULT_DURATIONS = {
	focus: 25,
	short: 5,
	long: 15
};
function msFor(mode, durations) {
	return durations[mode] * 60 * 1e3;
}
function clampMinutes(n) {
	return Math.min(90, Math.max(1, Math.round(n)));
}
var MODE_LABEL = {
	focus: "Focus",
	short: "Short break",
	long: "Long break"
};
var useLumen = create()(persist((set, get) => ({
	hasBegun: false,
	mode: "focus",
	remainingMs: msFor("focus", DEFAULT_DURATIONS),
	running: false,
	endsAt: null,
	completeKind: null,
	durations: DEFAULT_DURATIONS,
	sceneId: "rain",
	soundOn: true,
	volume: .42,
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
			completeKind: null
		});
	},
	setScene: (sceneId) => set({ sceneId }),
	cycleScene: (dir) => set({ sceneId: nextSceneId(get().sceneId, dir) }),
	setIntention: (intention) => set({ intention }),
	setSoundOn: (soundOn) => set({ soundOn }),
	toggleSound: () => set({ soundOn: !get().soundOn }),
	setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
	setDuration: (mode, minutes) => {
		const durations = {
			...get().durations,
			[mode]: clampMinutes(minutes)
		};
		const patch = { durations };
		if (!get().running && get().mode === mode) patch.remainingMs = msFor(mode, durations);
		set(patch);
	},
	start: () => {
		const { remainingMs, running } = get();
		if (running || remainingMs <= 0) return;
		set({
			running: true,
			endsAt: Date.now() + remainingMs,
			completeKind: null
		});
	},
	pause: () => {
		const { running, endsAt } = get();
		if (!running) return;
		set({
			running: false,
			endsAt: null,
			remainingMs: Math.max(0, (endsAt ?? Date.now()) - Date.now())
		});
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
			completeKind: null
		});
	},
	tick: () => {
		const { running, endsAt } = get();
		if (!running || endsAt == null) return;
		const remainingMs = Math.max(0, endsAt - Date.now());
		if (remainingMs <= 0) completeSession(set, get);
		else set({ remainingMs });
	},
	skipComplete: (next) => {
		const { durations } = get();
		set({
			completeKind: null,
			mode: next,
			remainingMs: msFor(next, durations),
			running: false,
			endsAt: null
		});
	},
	dismissComplete: () => {
		const { mode, durations } = get();
		set({
			completeKind: null,
			remainingMs: msFor(mode, durations),
			running: false,
			endsAt: null
		});
	},
	rollDay: () => {
		const key = dateKey();
		const s = get();
		if (s.todayKey === key) return;
		set({
			todayKey: key,
			todayMinutes: 0,
			sessionsToday: 0,
			streak: s.lastActiveDay === key || s.lastActiveDay === yesterdayKey() ? s.streak : 0,
			log: s.log.filter((entry) => dateKey(new Date(entry.at)) === key)
		});
	},
	clearStats: () => set({
		todayMinutes: 0,
		sessionsToday: 0,
		streak: 0,
		lastActiveDay: null,
		focusSinceLong: 0,
		log: []
	})
}), {
	name: "lumen-studio",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (s) => ({
		hasBegun: s.hasBegun,
		mode: s.mode,
		remainingMs: s.running && s.endsAt ? Math.max(0, s.endsAt - Date.now()) : s.remainingMs,
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
		log: s.log.slice(0, 20)
	})
}));
function completeSession(set, get) {
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
	} else if (s.mode === "long") focusSinceLong = 0;
	const entry = {
		id: crypto.randomUUID(),
		mode: s.mode,
		minutes: planned,
		intention: isFocus ? s.intention.trim() : "",
		at: Date.now()
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
		log: [entry, ...s.log].slice(0, 20)
	});
}
var DURATION_ROWS = [
	"focus",
	"short",
	"long"
];
function SettingsPanel({ open, onOpenChange }) {
	const durations = useLumen((s) => s.durations);
	const setDuration = useLumen((s) => s.setDuration);
	const volume = useLumen((s) => s.volume);
	const setVolume = useLumen((s) => s.setVolume);
	const soundOn = useLumen((s) => s.soundOn);
	const setSoundOn = useLumen((s) => s.setSoundOn);
	const todayMinutes = useLumen((s) => s.todayMinutes);
	const sessionsToday = useLumen((s) => s.sessionsToday);
	const streak = useLumen((s) => s.streak);
	const log = useLumen((s) => s.log);
	const clearStats = useLumen((s) => s.clearStats);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "overlay-in fixed inset-0 z-50 bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("panel-in settings-sheet fixed z-50 flex w-auto flex-col bg-elevated text-foreground shadow-[var(--shadow-border)]", "inset-x-3 bottom-3 rounded-xl", "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 pt-5 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-xl tracking-tight",
						children: "Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "icon",
							"aria-label": "Close settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-5",
								strokeWidth: 1.75
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Timer lengths, sound, and today's session history"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 overflow-y-auto px-5 pb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-medium tracking-wide text-muted uppercase",
								children: "Interval"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: DURATION_ROWS.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-12 items-center justify-between gap-3 rounded-md bg-background px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: MODE_LABEL[mode]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "quiet",
												size: "icon",
												className: "size-10",
												"aria-label": `Decrease ${MODE_LABEL[mode]}`,
												onClick: () => setDuration(mode, durations[mode] - 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "w-10 text-center text-sm tabular-nums",
												children: [durations[mode], "m"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "quiet",
												size: "icon",
												className: "size-10",
												"aria-label": `Increase ${MODE_LABEL[mode]}`,
												onClick: () => setDuration(mode, durations[mode] + 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
											})
										]
									})]
								}, mode))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium tracking-wide text-muted uppercase",
									children: "Sound"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-muted hover:text-foreground",
									onClick: () => setSoundOn(!soundOn),
									children: soundOn ? "On" : "Off"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: "Volume",
								value: volume,
								onValueChange: setVolume,
								className: !soundOn ? "opacity-40" : void 0
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium tracking-wide text-muted uppercase",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Focused",
											value: formatMinutes(todayMinutes)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Sessions",
											value: String(sessionsToday)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Streak",
											value: `${streak}d`
										})
									]
								}),
								log.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-border",
									children: log.slice(0, 6).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-baseline justify-between gap-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 truncate text-muted",
											children: entry.intention || MODE_LABEL[entry.mode]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "shrink-0 tabular-nums text-subtle",
											children: [entry.minutes, "m"]
										})]
									}, entry.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-subtle",
									children: "No sessions yet today."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-subtle hover:text-muted",
									onClick: clearStats,
									children: "Clear stats"
								})
							]
						})
					]
				})
			]
		})] })
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-background px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-lg tabular-nums tracking-tight",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-subtle",
			children: label
		})]
	});
}
function noiseBuffer(ctx, kind, seconds = 4) {
	const length = Math.floor(ctx.sampleRate * seconds);
	const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
	for (let ch = 0; ch < 2; ch++) {
		const data = buffer.getChannelData(ch);
		let last = 0;
		for (let i = 0; i < length; i++) {
			const white = Math.random() * 2 - 1;
			if (kind === "white") data[i] = white;
			else {
				last = (last + .02 * white) / 1.02;
				data[i] = last * 3.5;
			}
		}
	}
	return buffer;
}
var Soundscape = class {
	ctx = null;
	master = null;
	nodes = [];
	sources = [];
	oscillators = [];
	chirpTimer = null;
	scene = "rain";
	volume = .42;
	playing = false;
	ensure() {
		if (this.ctx) return;
		const ctx = new AudioContext();
		const master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);
		this.ctx = ctx;
		this.master = master;
	}
	async resume() {
		this.ensure();
		if (this.ctx?.state === "suspended") await this.ctx.resume();
	}
	setVolume(v) {
		this.volume = Math.max(0, Math.min(1, v));
		if (this.playing) this.fadeTo(this.volume, .25);
	}
	async play(scene) {
		await this.resume();
		if (this.playing && this.scene === scene) {
			this.fadeTo(this.volume, .5);
			return;
		}
		this.rebuild(scene);
		this.playing = true;
		this.fadeTo(this.volume, .8);
	}
	duck() {
		if (!this.playing) return;
		this.fadeTo(this.volume * .18, .6);
	}
	stop() {
		if (!this.playing) return;
		this.fadeTo(0, .5);
		window.setTimeout(() => {
			if (this.playing) return;
			this.teardownGraph();
		}, 520);
		this.playing = false;
	}
	chime() {
		this.ensure();
		this.resume();
		const ctx = this.ctx;
		if (!ctx) return;
		const now = ctx.currentTime;
		[
			523.25,
			659.25,
			783.99
		].forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = freq;
			gain.gain.setValueAtTime(1e-4, now);
			gain.gain.exponentialRampToValueAtTime(.07 / (i + 1), now + .03);
			gain.gain.exponentialRampToValueAtTime(1e-4, now + 2.4);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + i * .11);
			osc.stop(now + 2.5);
		});
	}
	fadeTo(value, seconds) {
		if (!this.ctx || !this.master) return;
		const g = this.master.gain;
		const now = this.ctx.currentTime;
		g.cancelScheduledValues(now);
		g.setValueAtTime(Math.max(1e-4, g.value), now);
		g.linearRampToValueAtTime(Math.max(1e-4, value), now + seconds);
	}
	rebuild(scene) {
		this.teardownGraph();
		this.ensure();
		const ctx = this.ctx;
		const master = this.master;
		if (!ctx || !master) return;
		this.scene = scene;
		const source = ctx.createBufferSource();
		source.buffer = noiseBuffer(ctx, scene === "rain" ? "white" : "brown");
		source.loop = true;
		const filter = ctx.createBiquadFilter();
		const gain = ctx.createGain();
		if (scene === "rain") {
			filter.type = "bandpass";
			filter.frequency.value = 1800;
			filter.Q.value = .7;
			gain.gain.value = .55;
		} else if (scene === "forest") {
			filter.type = "lowpass";
			filter.frequency.value = 420;
			filter.Q.value = .5;
			gain.gain.value = .7;
			this.startChirps();
		} else if (scene === "cafe") {
			filter.type = "bandpass";
			filter.frequency.value = 380;
			filter.Q.value = .55;
			gain.gain.value = .45;
			this.startClinks();
		} else {
			filter.type = "lowpass";
			filter.frequency.value = 280;
			filter.Q.value = .4;
			gain.gain.value = .8;
			const lfo = ctx.createOscillator();
			const lfoGain = ctx.createGain();
			lfo.type = "sine";
			lfo.frequency.value = .07;
			lfoGain.gain.value = 160;
			lfo.connect(lfoGain);
			lfoGain.connect(filter.frequency);
			lfo.start();
			this.oscillators.push(lfo);
		}
		source.connect(filter);
		filter.connect(gain);
		gain.connect(master);
		source.start();
		this.sources.push(source);
		this.nodes.push(filter, gain);
	}
	startChirps() {
		const sing = () => {
			const ctx = this.ctx;
			const master = this.master;
			if (!ctx || !master || !this.playing || this.scene !== "forest") return;
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			const freq = 1600 + Math.random() * 2400;
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(freq * 1.22, ctx.currentTime + .14);
			g.gain.setValueAtTime(1e-4, ctx.currentTime);
			g.gain.exponentialRampToValueAtTime(.028, ctx.currentTime + .03);
			g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .2);
			osc.connect(g);
			g.connect(master);
			osc.start();
			osc.stop(ctx.currentTime + .22);
			this.chirpTimer = setTimeout(sing, 3500 + Math.random() * 7e3);
		};
		this.chirpTimer = setTimeout(sing, 1800);
	}
	startClinks() {
		const clink = () => {
			const ctx = this.ctx;
			const master = this.master;
			if (!ctx || !master || !this.playing || this.scene !== "cafe") return;
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "triangle";
			osc.frequency.value = 1200 + Math.random() * 900;
			g.gain.setValueAtTime(1e-4, ctx.currentTime);
			g.gain.exponentialRampToValueAtTime(.02, ctx.currentTime + .01);
			g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .35);
			osc.connect(g);
			g.connect(master);
			osc.start();
			osc.stop(ctx.currentTime + .4);
			this.chirpTimer = setTimeout(clink, 5e3 + Math.random() * 9e3);
		};
		this.chirpTimer = setTimeout(clink, 2400);
	}
	teardownGraph() {
		if (this.chirpTimer) {
			clearTimeout(this.chirpTimer);
			this.chirpTimer = null;
		}
		for (const src of this.sources) try {
			src.stop();
			src.disconnect();
		} catch {}
		for (const osc of this.oscillators) try {
			osc.stop();
			osc.disconnect();
		} catch {}
		for (const node of this.nodes) try {
			node.disconnect();
		} catch {}
		this.sources = [];
		this.oscillators = [];
		this.nodes = [];
	}
};
var soundscape = new Soundscape();
var MODES = [
	"focus",
	"short",
	"long"
];
function Studio() {
	const hasBegun = useLumen((s) => s.hasBegun);
	const begin = useLumen((s) => s.begin);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const go = async () => {
			await Promise.resolve(useLumen.persist.rehydrate());
			if (cancelled) return;
			useLumen.getState().rollDay();
		};
		go();
		return () => {
			cancelled = true;
		};
	}, []);
	if (!hasBegun) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, { onBegin: begin });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Session, {});
}
function Shell({ children }) {
	const scene = sceneById(useLumen((s) => s.sceneId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh min-h-dvh overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: scene.fallback },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene.src,
				alt: "",
				className: "scene-ken absolute inset-0 size-full object-cover",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain absolute inset-0" }),
			children
		]
	});
}
function StartScreen({ onBegin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe relative z-10 flex h-full flex-col items-center justify-center px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stagger-in text-xs font-medium tracking-[0.22em] text-muted uppercase",
				children: "Focus studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "stagger-in font-display mt-4 text-6xl tracking-tight italic sm:text-7xl",
				children: "Lumen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stagger-in mt-4 max-w-xs text-pretty text-base text-muted",
				children: "A quieter way to work. One interval, one scene, nothing else."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stagger-in mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					onClick: () => {
						soundscape.resume();
						onBegin();
					},
					children: "Begin"
				})
			})
		]
	}) });
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
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [chrome, setChrome] = (0, import_react.useState)(true);
	const prevComplete = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!running) return;
		const id = window.setInterval(tick, 200);
		const onVis = () => tick();
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [running, tick]);
	(0, import_react.useEffect)(() => {
		if (completeKind && prevComplete.current !== completeKind && soundOn) soundscape.chime();
		prevComplete.current = completeKind;
	}, [completeKind, soundOn]);
	(0, import_react.useEffect)(() => {
		if (!soundOn) {
			soundscape.stop();
			return;
		}
		soundscape.setVolume(volume);
		if (running) soundscape.play(sceneId);
		else if (completeKind) soundscape.duck();
		else soundscape.duck();
	}, [
		soundOn,
		running,
		sceneId,
		volume,
		completeKind
	]);
	(0, import_react.useEffect)(() => {
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
	}, [
		running,
		settingsOpen,
		completeKind
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
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
	}, [
		toggleRun,
		setMode,
		cycleScene,
		toggleSound,
		reset
	]);
	const totalMs = durations[mode] * 60 * 1e3;
	const progress = totalMs === 0 ? 0 : 1 - remainingMs / totalMs;
	const next = completeKind === "focus" ? focusSinceLong >= 4 ? "long" : "short" : "focus";
	const scene = sceneById(sceneId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe relative z-10 flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("flex items-center justify-between gap-3 transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)]", chrome ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-1"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl tracking-tight italic",
						children: "Lumen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted tabular-nums",
						children: [
							formatMinutes(todayMinutes),
							" today",
							streak > 0 ? ` · ${streak}d streak` : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "icon",
						"aria-label": soundOn ? "Mute soundscape" : "Unmute soundscape",
						onClick: toggleSound,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative block size-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]", soundOn ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
								className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]", !soundOn ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
								strokeWidth: 1.75
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "icon",
						"aria-label": "Open settings",
						onClick: () => setSettingsOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, {
							className: "size-5",
							strokeWidth: 1.75
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col items-center justify-center px-4",
				children: completeKind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteCard, {
					kind: completeKind,
					next,
					intention,
					onNext: (m) => skipComplete(m)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mb-8 flex gap-1 rounded-full bg-background/30 p-1 shadow-[var(--shadow-border)] transition-opacity duration-[var(--motion-fast)]", chrome ? "opacity-100" : "opacity-0"),
						role: "tablist",
						"aria-label": "Interval type",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": mode === m,
							disabled: running,
							onClick: () => setMode(m),
							className: cn("h-9 rounded-full px-3.5 text-xs font-medium tracking-wide uppercase transition-colors duration-[var(--motion-quick)]", mode === m ? "bg-foreground text-background" : "text-muted hover:text-foreground"),
							children: m === "focus" ? "Focus" : m === "short" ? "Short" : "Long"
						}, m))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.22em] text-muted uppercase",
						"aria-live": "polite",
						children: MODE_LABEL[mode]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-timer mt-2 tabular-nums tracking-tight",
						"aria-label": `${formatClock(remainingMs)} remaining`,
						children: formatClock(remainingMs)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 h-px w-44 overflow-hidden bg-foreground/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full origin-left bg-foreground/70 transition-transform duration-[var(--motion-quick)] ease-linear",
							style: { transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Reset interval",
								onClick: reset,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-5",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								className: "size-16",
								"aria-label": running ? "Pause" : "Start",
								onClick: () => {
									soundscape.resume();
									if (running) pause();
									else start();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative block size-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
										className: cn("absolute inset-0 size-6 transition-[opacity,transform,filter] duration-[var(--motion-fast)]", running ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: cn("absolute inset-0 size-6 translate-x-px transition-[opacity,transform,filter] duration-[var(--motion-fast)]", !running ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
										strokeWidth: 1.75
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-11",
								"aria-hidden": true
							})
						]
					}),
					mode === "focus" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: cn("mt-8 w-full max-w-sm transition-opacity duration-[var(--motion-fast)]", chrome ? "opacity-100" : "opacity-0"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "What are you focusing on"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: intention,
							onChange: (e) => setIntention(e.target.value),
							placeholder: "What are you focusing on?",
							maxLength: 80,
							className: "h-11 w-full border-0 border-b border-border bg-transparent text-center text-sm text-foreground outline-none placeholder:text-subtle focus:border-line"
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: cn("transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)]", chrome ? "opacity-100" : "pointer-events-none opacity-0 translate-y-1"),
				"aria-label": "Scenes",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 px-1 text-xs text-muted",
					children: scene.sound
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 flex gap-2 overflow-x-auto pb-1",
					children: SCENES.map((item) => {
						const selected = item.id === sceneId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setScene(item.id),
							className: cn("relative h-16 w-20 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-28", selected ? "shadow-[var(--shadow-border-hover)] ring-1 ring-foreground" : "shadow-[var(--shadow-border)] opacity-80 hover:opacity-100"),
							"aria-pressed": selected,
							"aria-label": item.name,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.src,
								alt: "",
								className: "size-full object-cover",
								crossOrigin: "anonymous"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-x-0 bottom-0 bg-background/55 px-1.5 py-1 text-xs leading-none text-foreground",
								children: item.name
							})]
						}, item.id);
					})
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {
		open: settingsOpen,
		onOpenChange: setSettingsOpen
	})] });
}
function CompleteCard({ kind, next, intention, onNext }) {
	const focusDone = kind === "focus";
	const title = focusDone ? "That's a full interval." : "Break's over.";
	const body = focusDone ? intention.trim() || "Ready for a short rest, or keep going." : "Whenever you are.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in max-w-sm text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl tracking-tight text-balance sm:text-4xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-pretty text-muted",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					onClick: () => onNext(next),
					children: next === "focus" ? "Start focusing" : next === "long" ? "Take a longer break" : "Take a short break"
				}), focusDone && next !== "focus" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "lg",
					onClick: () => onNext("focus"),
					children: "Keep going"
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
