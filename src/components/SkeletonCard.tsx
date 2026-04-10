import { cn } from "@/lib/utils";

const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent";

const Bone = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg bg-muted", shimmer, className)} />
);

/** Skeleton for league/team cards */
const SkeletonCard = () => (
  <div className="glass-card p-8 space-y-4">
    <Bone className="w-16 h-16 rounded-xl mx-auto" />
    <Bone className="h-4 w-3/4 mx-auto" />
    <Bone className="h-3 w-1/2 mx-auto" />
  </div>
);

/** Skeleton for team detail banner */
export const SkeletonBanner = () => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/20" />
    <div className="content-container py-12 sm:py-20">
      <Bone className="h-8 w-24 mb-6" />
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <Bone className="w-28 h-28 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4 w-full max-w-xl">
          <Bone className="h-8 w-3/4" />
          <div className="flex gap-4">
            <Bone className="h-4 w-28" />
            <Bone className="h-4 w-28" />
            <Bone className="h-4 w-36" />
          </div>
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
          <Bone className="h-10 w-44 mt-2" />
        </div>
      </div>
    </div>
  </div>
);

/** Skeleton for match list */
export const SkeletonMatches = () => (
  <div className="space-y-3">
    <Bone className="h-6 w-52 mb-6" />
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex items-center justify-between gap-4">
        <Bone className="h-4 flex-1" />
        <Bone className="h-8 w-20 rounded-lg" />
        <Bone className="h-4 flex-1" />
        <Bone className="h-3 w-32 hidden sm:block" />
      </div>
    ))}
  </div>
);

/** Skeleton for standings table */
export const SkeletonStandings = () => (
  <div>
    <Bone className="h-6 w-40 mb-6" />
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 border-b border-border">
        <Bone className="h-3 w-6" />
        <Bone className="h-3 w-32" />
        <div className="flex-1" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-3 w-8" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border-b border-border/50">
          <Bone className="h-4 w-6" />
          <Bone className="h-4 w-36" />
          <div className="flex-1" />
          {Array.from({ length: 5 }).map((_, j) => (
            <Bone key={j} className="h-4 w-8" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonCard;
