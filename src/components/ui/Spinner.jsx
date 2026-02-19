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
      className={`animate-spin text-accent-cyan ${sizes[size]} ${className}`}
    />
  );
};

export const LoadingScreen = ({ message = 'Cargando datos...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
    <div className="text-6xl mb-6">🥗</div>
    <div className="relative">
      <Spinner size="xl" />
      <div className="absolute inset-0 animate-ping">
        <Spinner size="xl" className="opacity-30" />
      </div>
    </div>
    <p className="mt-6 text-gray-400">{message}</p>
  </div>
);

export const LoadingOverlay = ({ message }) => (
  <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-card">
    <div className="flex flex-col items-center">
      <Spinner size="lg" />
      {message && <p className="mt-3 text-sm text-gray-400">{message}</p>}
    </div>
  </div>
);

export default Spinner;
