import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  className?: string;
};

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  className,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-11 w-full touch-none items-center select-none",
        className,
      )}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onValueChange(v[0] ?? min)}
      aria-label={label}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-foreground/15">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-foreground" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full bg-foreground shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50" />
    </SliderPrimitive.Root>
  );
}
