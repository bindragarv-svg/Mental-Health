import { Loader2 } from 'lucide-react';

export const Spinner = ({ className = 'h-4 w-4' }) => <Loader2 className={`animate-spin ${className}`} />;

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
);

export const ResultSkeleton = () => (
  <div className="card space-y-4 p-6" aria-busy="true">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-16 w-1/2" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-32 w-full" />
  </div>
);

export default Spinner;
