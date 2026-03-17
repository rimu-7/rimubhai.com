export default function TimelinePageShell({ title, description, children }) {
  return (
    <section>
      <div className="mb-12 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}