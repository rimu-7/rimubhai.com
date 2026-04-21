import { cn } from "@/lib/utils";

export function HoverUnderline({ children, className, textClassName }) {
  return (
    <span className={cn("relative inline-block max-w-full", className)}>
      <span
        className={cn(
          "inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-top",
          textClassName,
        )}
      >
        <div className="flex items-center gap-2">{children}</div>
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-[-3px] h-[1.5px] w-full origin-left scale-x-0 rounded-full bg-current/90 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </span>
  );
}
