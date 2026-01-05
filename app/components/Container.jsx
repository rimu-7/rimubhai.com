import { cn } from "@/lib/utils";

export default function Container({ children, className }) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
