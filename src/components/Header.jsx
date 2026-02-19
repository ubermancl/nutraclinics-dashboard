import { useState, useRef } from 'react';
import { RefreshCw, LogOut, Wifi, WifiOff, Calendar, X } from 'lucide-react';
import { Button, Select } from './ui';
import { formatDateTime } from '../utils/formatters';

const DateInput = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  const formatDisplay = (isoDate) => {
    if (!isoDate) return placeholder || 'DD/MM/AAAA';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="relative flex items-center gap-1.5 bg-dark-700 border border-dark-600 rounded px-2 py-1.5 cursor-pointer hover:border-dark-500 transition-colors min-w-[120px]"
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <Calendar className="w-3 h-3 text-accent-cyan shrink-0" />
      <span className="text-sm text-gray-200 select-none">{formatDisplay(value)}</span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
    </div>
  );
};

const DATE_FILTERS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'custom', label: 'Personalizado' },
];

export default function Header({
  dateFilter,
  onDateFilterChange,
  customDateRange,
  onCustomDateChange,
  onRefresh,
  isRefreshing,
  lastUpdated,
  isOnline,
  onLogout,
}) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const handleDateFilterChange = (value) => {
    if (value === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      onDateFilterChange(value);
    }
  };

  const applyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      onCustomDateChange({
        start: new Date(tempStartDate),
        end: new Date(tempEndDate),
      });
      onDateFilterChange('custom');
      setShowCustomPicker(false);
    }
  };

  return (
    <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-40">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-2xl">
              🥗
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">
                NutraClínics
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {/* Indicador de conexión */}
                {isOnline ? (
                  <span className="flex items-center gap-1 text-accent-green">
                    <Wifi className="w-3 h-3" />
                    <span className="hidden sm:inline">Online</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-error">
                    <WifiOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Offline</span>
                  </span>
                )}
                {lastUpdated && (
                  <>
                    <span className="text-dark-500">•</span>
                    <span className="hidden sm:inline">{formatDateTime(lastUpdated)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filtro de fecha */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                options={DATE_FILTERS}
                className="w-40"
              />
            </div>

            {/* Selector de rango personalizado */}
            {showCustomPicker && (
              <div className="flex items-center gap-2 glass-card p-2">
                <DateInput
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  placeholder="Desde"
                />
                <span className="text-gray-500 text-sm">→</span>
                <DateInput
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  placeholder="Hasta"
                />
                <Button size="sm" onClick={applyCustomRange}>
                  Aplicar
                </Button>
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="p-1 hover:bg-dark-600 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {/* Botón actualizar */}
            <Button
              variant="secondary"
              onClick={onRefresh}
              loading={isRefreshing}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>

            {/* Botón cerrar sesión */}
            <Button
              variant="ghost"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
