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
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
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
      <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-6 py-20 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-muted/30">
            <EmptyIcon className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground/70">
            {preset.emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {primaryItems.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
          className="space-y-2"
        >
          <SectionDivider label={preset.listLabel} />

          <TimelineGroup
            variant={variant}
            preset={preset}
            items={primaryItems}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.section>
      )}

      {secondaryItems.length > 0 && (
        <section className="space-y-6">
          <AnimatePresence initial={false} mode="wait">
            {!showArchive ? (
              <motion.div
                key="archive-closed"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowArchive(true)}
                  className="group rounded border-dashed px-6 text-sm transition-all duration-200 hover:border-foreground/30 hover:bg-muted/40"
                >
                  {preset.archiveButtonLabel} ({secondaryItems.length})
                  <div className="relative flex h-4 w-4 items-center justify-center text-muted-foreground ml-1.5">
                    <ChevronsUpDown className="absolute h-3.5 w-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-75 group-data-[state=open]:opacity-0" />
                    <ChevronsDownUp className="absolute h-3.5 w-3.5 scale-75 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
                  </div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="archive-open"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
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
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-2.5">
          <div className="flex items-center gap-3.5 rounded-xl border border-border/40 px-4 py-4">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <Skeleton className="hidden h-3.5 w-16 rounded md:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="mb-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-border/60" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/60" />
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
                className="rounded-none px-0 py-4 hover:no-underline"
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
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      "transition-all duration-200 ease-out",
                      "group-hover:-translate-y-0.5 group-hover:scale-[1.03]",
                      "group-hover:shadow-sm",
                      typeConfig.bg,
                      typeConfig.border,
                      typeConfig.color,
                      "group-hover:brightness-110",
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-200 ease-out group-hover:scale-105" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                      <HoverUnderline>{title}</HoverUnderline>
                    </h3>

                    {subtitle ? (
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[48px_1fr]">
                  <div className="hidden md:block" />
                  <div className="space-y-4">
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
    <div className="flex items-center gap-2">
      {extras ? (
        <div
          className="flex items-center gap-0.5"
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
            "flex items-center gap-0.5 pl-2",
            hasLeftSide && "border-l border-border/50",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
            onClick={(e) => onEdit(item._id, e)}
          >
            <Pencil className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => onDelete(item._id, e)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
