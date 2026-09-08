import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatMinutes } from "@/lib/lumen/format";
import { MODE_LABEL, useLumen, type Mode } from "@/lib/lumen/store";
import { cn } from "@/lib/utils";

const DURATION_ROWS: Mode[] = ["focus", "short", "long"];

export function SettingsPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay-in fixed inset-0 z-50 bg-background/70" />
        <Dialog.Content
          className={cn(
            "panel-in settings-sheet fixed z-50 flex w-auto flex-col bg-elevated text-foreground shadow-[var(--shadow-border)]",
            "inset-x-3 bottom-3 rounded-xl",
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2",
          )}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <Dialog.Title className="font-display text-xl tracking-tight">
              Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="quiet" size="icon" aria-label="Close settings">
                <X className="size-5" strokeWidth={1.75} />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Timer lengths, sound, and today's session history
          </Dialog.Description>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
            <section className="space-y-3">
              <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
                Interval
              </h3>
              <div className="space-y-2">
                {DURATION_ROWS.map((mode) => (
                  <div
                    key={mode}
                    className="flex h-12 items-center justify-between gap-3 rounded-md bg-background px-3"
                  >
                    <span className="text-sm">{MODE_LABEL[mode]}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="quiet"
                        size="icon"
                        className="size-10"
                        aria-label={`Decrease ${MODE_LABEL[mode]}`}
                        onClick={() => setDuration(mode, durations[mode] - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-10 text-center text-sm tabular-nums">
                        {durations[mode]}m
                      </span>
                      <Button
                        variant="quiet"
                        size="icon"
                        className="size-10"
                        aria-label={`Increase ${MODE_LABEL[mode]}`}
                        onClick={() => setDuration(mode, durations[mode] + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
                  Sound
                </h3>
                <button
                  type="button"
                  className="text-sm text-muted hover:text-foreground"
                  onClick={() => setSoundOn(!soundOn)}
                >
                  {soundOn ? "On" : "Off"}
                </button>
              </div>
              <Slider
                label="Volume"
                value={volume}
                onValueChange={setVolume}
                className={!soundOn ? "opacity-40" : undefined}
              />
            </section>

            <section className="space-y-3">
              <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
                Today
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Focused" value={formatMinutes(todayMinutes)} />
                <Stat label="Sessions" value={String(sessionsToday)} />
                <Stat label="Streak" value={`${streak}d`} />
              </div>
              {log.length > 0 ? (
                <ul className="divide-y divide-border">
                  {log.slice(0, 6).map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-baseline justify-between gap-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate text-muted">
                        {entry.intention || MODE_LABEL[entry.mode]}
                      </span>
                      <span className="shrink-0 tabular-nums text-subtle">
                        {entry.minutes}m
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-subtle">No sessions yet today.</p>
              )}
              <button
                type="button"
                className="text-xs text-subtle hover:text-muted"
                onClick={clearStats}
              >
                Clear stats
              </button>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background px-3 py-3">
      <div className="font-display text-lg tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-xs text-subtle">{label}</div>
    </div>
  );
}
