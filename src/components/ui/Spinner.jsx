import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2
      className={`animate-spin text-primary-600 ${sizes[size]} ${className}`}
    />
  );
};

export const LoadingScreen = ({ message = 'Cargando datos...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <div className="text-6xl mb-4">🥗</div>
    <Spinner size="lg" />
    <p className="mt-4 text-text-secondary">{message}</p>
  </div>
);

export const LoadingOverlay = ({ message }) => (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-card">
    <div className="flex flex-col items-center">
      <Spinner size="lg" />
      {message && <p className="mt-2 text-sm text-text-secondary">{message}</p>}
    </div>
  </div>
);

export default Spinner;
