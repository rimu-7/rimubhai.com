import Image from "next/image";
import {
  Trophy,
  Award,
  FileText,
  GraduationCap,
  Medal,
  Briefcase,
  Plane,
  Home,
  Flag,
  MapPin,
  Sparkles,
  Calendar,
  ExternalLink,
  Github,
  Lock,
  Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const formatMonthYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export const formatYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
};

const awardTypeStyles = {
  publication: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  sports: {
    icon: Medal,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  education: {
    icon: GraduationCap,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  certification: {
    icon: Award,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  default: {
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

const lifeEventTypeStyles = {
  travel: {
    icon: Plane,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  education: {
    icon: GraduationCap,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  career: {
    icon: MapPin,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  personal: {
    icon: Home,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  milestone: {
    icon: Flag,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  default: {
    icon: Sparkles,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

const experienceTypeStyle = {
  icon: Briefcase,
  color: "text-cyan-500",
  bg: "bg-cyan-500/10",
  border: "border-cyan-500/20",
};

export const getTypeConfig = (variant, type) => {
  const normalized = String(type || "").toLowerCase();

  if (variant === "awards") {
    return awardTypeStyles[normalized] || awardTypeStyles.default;
  }

  if (variant === "life-events") {
    return lifeEventTypeStyles[normalized] || lifeEventTypeStyles.default;
  }

  return experienceTypeStyle;
};

function CurrentIndicator() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

function ProjectActionLink({ href, icon, label, className }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className={`h-8 w-8 rounded text-muted-foreground transition-colors ${className}`}
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {icon}
      </a>
    </Button>
  );
}

function ProjectPrivateRepo() {
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground/40"
      aria-label="Private repository"
      title="Private repository"
    >
      <Lock className="h-3.5 w-3.5" />
    </div>
  );
}

export const TIMELINE_PRESETS = {
  awards: {
    endpoint: "/api/awards",
    editPath: "/admin/awards",
    itemName: "award",
    listLabel: "Accomplishments",
    archiveLabel: "Archive",
    archiveButtonLabel: "View Archive",
    emptyIcon: Trophy,
    emptyMessage: "No awards added.",
    loadError: "Failed to load awards",
    deleteConfirm: "Are you sure you want to delete this award?",
    deleteSuccess: "Award deleted",
    deleteError: "Delete failed",

    sortItems(items) {
      return [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },

    getTitle(item) {
      return item.title;
    },

    getSubtitle() {
      return "";
    },

    renderDesktopMeta(item) {
      return (
        <span className="text-sm font-mono text-muted-foreground">
          {formatYear(item.date)}
        </span>
      );
    },

    renderMobileMeta(item) {
      return (
        <div className="flex items-center gap-2 border-l-2 border-border pl-3 text-xs font-mono text-muted-foreground md:hidden">
          <Calendar className="h-3.5 w-3.5" />
          {formatMonthYear(item.date)}
        </div>
      );
    },

    renderBody(item, typeConfig) {
      return (
        <>
          {item.issuer ? (
            <div
              className={`inline-flex w-fit rounded border px-3 py-1 text-xs font-medium ${typeConfig.color} ${typeConfig.bg} ${typeConfig.border}`}
            >
              @{item.issuer}
            </div>
          ) : null}

          <div className="space-y-2">
            {item.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.description}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground/50">
                No additional details.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Badge
              variant="outline"
              className={`rounded border px-2.5 py-0.5 text-xs font-medium capitalize ${typeConfig.color} ${typeConfig.bg} ${typeConfig.border}`}
            >
              {item.type || "award"}
            </Badge>

            {item.link ? (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 rounded border-dashed text-xs"
              >
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  View Credential
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            ) : null}
          </div>
        </>
      );
    },
  },

  experience: {
    endpoint: "/api/experience",
    editPath: "/admin/experience",
    itemName: "experience",
    listLabel: "Work History",
    archiveLabel: "Previous Roles",
    archiveButtonLabel: "View Older Roles",
    emptyIcon: Briefcase,
    emptyMessage: "No experience added.",
    loadError: "Failed to load experience",
    deleteConfirm: "Are you sure you want to delete this experience?",
    deleteSuccess: "Experience deleted",
    deleteError: "Delete failed",

    sortItems(items) {
      return [...items].sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;

        const aDate = new Date(a.endDate || a.startDate).getTime();
        const bDate = new Date(b.endDate || b.startDate).getTime();
        return bDate - aDate;
      });
    },

    getTitle(item) {
      return item.role;
    },

    getSubtitle(item) {
      return item.company ? `@ ${item.company}` : "";
    },

    renderDesktopMeta(item) {
      return (
        <div className="hidden items-end text-right md:flex md:flex-col">
          <span
            className={`flex items-center gap-2 text-sm font-mono ${
              item.current ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            {item.current ? <CurrentIndicator /> : null}
            {item.current ? "Present" : formatMonthYear(item.endDate)}
          </span>
        </div>
      );
    },

    renderMobileMeta(item) {
      return (
        <div className="flex items-center gap-2 border-l-2 border-border pl-3 text-xs font-mono text-muted-foreground md:hidden">
          <Calendar className="h-3.5 w-3.5" />
          {formatMonthYear(item.startDate)} —{" "}
          {item.current ? "Present" : formatMonthYear(item.endDate)}
        </div>
      );
    },

    renderBody(item) {
      return (
        <>
          <div className="space-y-2">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
              {item.description || "No details provided."}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {Array.isArray(item.skills) && item.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="outline"
                    className="rounded border-border/60 bg-transparent px-2.5 py-0.5 text-xs font-normal text-muted-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden font-mono opacity-60 md:inline-block">
                Started {formatMonthYear(item.startDate)}
              </span>

              {item.type ? (
                <Badge
                  variant="secondary"
                  className="rounded bg-secondary/60 font-normal text-foreground/80"
                >
                  {item.type}
                </Badge>
              ) : null}
            </div>
          </div>
        </>
      );
    },
  },

  "life-events": {
    endpoint: "/api/life-events",
    editPath: "/admin/life-events",
    itemName: "event",
    listLabel: "Timeline",
    archiveLabel: "Past Events",
    archiveButtonLabel: "View Older Events",
    emptyIcon: LayersFallback,
    emptyMessage: "No life events added.",
    loadError: "Failed to load events",
    deleteConfirm: "Are you sure you want to delete this event?",
    deleteSuccess: "Event deleted",
    deleteError: "Delete failed",

    sortItems(items) {
      return [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },

    getTitle(item) {
      return item.title;
    },

    getSubtitle() {
      return "";
    },

    renderDesktopMeta(item) {
      return (
        <span className="text-sm font-mono text-muted-foreground">
          {formatMonthYear(item.date)}
        </span>
      );
    },

    renderMobileMeta(item) {
      return (
        <div className="flex items-center gap-2 border-l-2 border-border pl-3 text-xs font-mono text-muted-foreground md:hidden">
          <Calendar className="h-3.5 w-3.5" />
          {formatMonthYear(item.date)}
        </div>
      );
    },

    renderBody(item, typeConfig) {
      return (
        <>
          <div className="space-y-2">
            {item.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.description}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground/50">
                No details provided.
              </p>
            )}
          </div>

          <div className="flex items-center pt-2">
            <Badge
              variant="outline"
              className={`rounded border px-2.5 py-0.5 text-xs font-medium capitalize ${typeConfig.color} ${typeConfig.bg} ${typeConfig.border}`}
            >
              {item.type || "event"}
            </Badge>
          </div>
        </>
      );
    },
  },

  projects: {
    endpoint: "/api/projects",
    editPath: "/admin/projects",
    itemName: "project",
    listLabel: "Featured Work",
    archiveLabel: "Archive",
    archiveButtonLabel: "View Archive",
    emptyIcon: Code,
    emptyMessage: "No projects found.",
    loadError: "Failed to load projects",
    deleteConfirm: "Are you sure you want to delete this project?",
    deleteSuccess: "Project deleted",
    deleteError: "Delete failed",

    sortItems(items) {
      return [...items];
    },

    partitionItems(items) {
      return {
        primaryItems: items.filter((item) => item.featured),
        secondaryItems: items.filter((item) => !item.featured),
      };
    },

    getVisualConfig(item) {
      if (item.featured) {
        return {
          icon: Code,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "border-primary/20",
        };
      }

      return {
        icon: Code,
        color: "text-muted-foreground",
        bg: "bg-secondary/50",
        border: "border-border",
      };
    },

    getTitle(item) {
      return item.title;
    },

    getSubtitle(item) {
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        return item.tags.slice(0, 3).join(" • ");
      }

      return item.description || "";
    },

    renderDesktopMeta() {
      return null;
    },

    renderMobileMeta() {
      return null;
    },

    renderRowMetaExtras(item) {
      return (
        <>
          {item.liveUrl ? (
            <ProjectActionLink
              href={item.liveUrl}
              label="Visit live site"
              icon={<ExternalLink className="h-4 w-4" />}
              className="hover:bg-primary/10 hover:text-primary"
            />
          ) : null}

          {item.repoUrl ? (
            <ProjectActionLink
              href={item.repoUrl}
              label="View source code"
              icon={<Github className="h-4 w-4" />}
              className="hover:bg-muted hover:text-foreground"
            />
          ) : (
            <ProjectPrivateRepo />
          )}
        </>
      );
    },

    renderBody(item) {
      return (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(260px,36%)_1fr]">
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded border border-border/60 bg-muted/30">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No Preview
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                About Project
              </h4>

              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.description || "No description provided."}
              </p>
            </div>

            {Array.isArray(item.tags) && item.tags.length > 0 ? (
              <div className="space-y-3">
                <div className="h-px w-full bg-border/50" />
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded border border-transparent bg-secondary/50 px-2.5 py-0.5 text-xs font-normal text-muted-foreground transition-colors hover:border-border/50 hover:bg-secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex gap-3 md:hidden">
              {item.liveUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full rounded"
                >
                  <a href={item.liveUrl} target="_blank" rel="noreferrer">
                    Live Site
                  </a>
                </Button>
              ) : null}

              {item.repoUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full rounded"
                >
                  <a href={item.repoUrl} target="_blank" rel="noreferrer">
                    Code
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      );
    },
  },
};

function LayersFallback(props) {
  return <Sparkles {...props} />;
}