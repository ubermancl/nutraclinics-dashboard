const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'rounded',
    circle: 'rounded-full',
    card: 'rounded-card',
  };

  return (
    <div
      className={`
        animate-pulse bg-gray-200
        ${variants[variant]}
        ${className}
      `}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-card p-4 md:p-6 shadow-card">
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-card shadow-card overflow-hidden">
    <div className="p-4 border-b">
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded-card p-4 md:p-6 shadow-card">
    <Skeleton className="h-6 w-40 mb-4" />
    <Skeleton className="h-64 w-full" variant="card" />
  </div>
);

export default Skeleton;
