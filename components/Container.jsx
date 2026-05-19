import { cn } from "@/lib/utils";

export default function Container({ children, className }) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8 py-10", className)}>
      {children}
    </div>
  );
}
