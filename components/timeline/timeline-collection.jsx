"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TIMELINE_PRESETS, getTypeConfig } from "./timeline-presets";
import { HoverUnderline } from "../HoverUnderline";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function TimelineCollection({
  variant,
  canManage = false,
  maxVisible = 5,
}) {
  const router = useRouter();
  const preset = TIMELINE_PRESETS[variant];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);

  const loadItems = useCallback(
    async (signal) => {
      try {
        const res = await fetch(preset.endpoint, {
          method: "GET",
          signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();

        if (!signal.aborted) {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
      } catch (error) {
        if (signal?.aborted) return;
        console.error(error);
        toast.error(preset.loadError);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [preset],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal);
    return () => controller.abort();
  }, [loadItems]);

  const sortedItems = useMemo(() => preset.sortItems(items), [items, preset]);

  const { primaryItems, secondaryItems } = useMemo(() => {
    if (preset.partitionItems) {
      return preset.partitionItems(sortedItems, maxVisible);
    }

    return {
      primaryItems: sortedItems.slice(0, maxVisible),
      secondaryItems: sortedItems.slice(maxVisible),
    };
  }, [sortedItems, preset, maxVisible]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!confirm(preset.deleteConfirm)) return;

    const previous = [...items];
    setItems((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await fetch(`${preset.endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success(preset.deleteSuccess);
    } catch (error) {
      console.error(error);
      setItems(previous);
      toast.error(preset.deleteError);
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    router.push(`${preset.editPath}?edit=${id}`);
  };

  if (loading) {
    return <TimelineSkeleton />;
  }

  if (sortedItems.length === 0) {
    const EmptyIcon = preset.emptyIcon;

    return (
      <div className="rounded-3xl border border-dashed border-border/70 bg-background/60 px-6 py-24 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-muted/30">
            <EmptyIcon className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground/80">
            {preset.emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {primaryItems.length > 0 && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <SectionDivider label={preset.listLabel} />

          <TimelineGroup
            variant={variant}
            preset={preset}
            items={primaryItems}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            // defaultOpen={primaryItems[0]?._id}
          />
        </motion.section>
      )}

      {secondaryItems.length > 0 && (
        <section className="space-y-8">
          <AnimatePresence initial={false} mode="wait">
            {!showArchive ? (
              <motion.div
                key="archive-closed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex justify-center"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowArchive(true)}
                  className="group rounded border-dashed px-8 text-sm transition-all duration-200 hover:border-foreground/30 hover:bg-muted/40"
                >
                  {preset.archiveButtonLabel} ({secondaryItems.length})
                  <div className="relative flex h-5 w-5 items-center justify-center text-muted-foreground">
                    <ChevronsUpDown className="absolute h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-75 group-data-[state=open]:opacity-0" />
                    <ChevronsDownUp className="absolute h-4 w-4 scale-75 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
                  </div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="archive-open"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <SectionDivider label={preset.archiveLabel} />

                <TimelineGroup
                  variant={variant}
                  preset={preset}
                  items={secondaryItems}
                  canManage={canManage}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowArchive(false)}
                    className="rounded text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Show Less
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-3">
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 px-4 py-5">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="hidden h-4 w-20 rounded md:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="h-px flex-1 bg-border/70" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/70" />
    </div>
  );
}

function TimelineGroup({
  variant,
  preset,
  items,
  canManage,
  onEdit,
  onDelete,
  defaultOpen,
}) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen}
      className="w-full"
    >
      {items.map((item) => {
        const typeConfig =
          preset.getVisualConfig?.(item) ?? getTypeConfig(variant, item.type);
        const Icon = typeConfig.icon;
        const title = preset.getTitle(item);
        const subtitle = preset.getSubtitle(item);

        return (
          <motion.div key={item._id} variants={itemVariants}>
            <AccordionItem
              value={item._id}
              className={cn(
                "group px-0 transition-colors duration-300",
                "data-[state=open]:border-border",
              )}
            >
              <AccordionTrigger
                indicator="plus-minus"
                className="rounded-none px-0 py-5 hover:no-underline"
                meta={
                  <RowMeta
                    item={item}
                    preset={preset}
                    canManage={canManage}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                }
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                      "transition-all duration-300 ease-out",
                      "group-hover:-translate-y-0.5 group-hover:scale-[1.03]",
                      "group-hover:shadow-sm",
                      typeConfig.bg,
                      typeConfig.border,
                      typeConfig.color,
                      "group-hover:brightness-110",
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-[1.15rem]">
                      <HoverUnderline>{title}</HoverUnderline>
                    </h3>

                    {subtitle ? (
                      <p className="mt-1 truncate text-sm text-muted-foreground md:text-[15px]">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[56px_1fr]">
                  <div className="hidden md:block" />
                  <div className="space-y-5">
                    {preset.renderMobileMeta?.(item)}
                    {preset.renderBody(item, typeConfig)}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}

function RowMeta({ item, preset, canManage, onEdit, onDelete }) {
  const desktopMeta = preset.renderDesktopMeta?.(item);
  const extras = preset.renderRowMetaExtras?.(item);
  const hasLeftSide = Boolean(desktopMeta) || Boolean(extras);

  return (
    <div className="flex items-center gap-3">
      {extras ? (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {extras}
        </div>
      ) : null}

      {desktopMeta ? (
        <div className="hidden md:flex items-center">{desktopMeta}</div>
      ) : null}

      {canManage ? (
        <div
          className={cn(
            "flex items-center gap-1 pl-3",
            hasLeftSide && "border-l border-border/50",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
            onClick={(e) => onEdit(item._id, e)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => onDelete(item._id, e)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
