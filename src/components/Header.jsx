import { RefreshCw, LogOut, Wifi, WifiOff, Calendar } from 'lucide-react';
import { Button, Select } from './ui';
import { formatDateTime } from '../utils/formatters';
import { DATE_FILTERS } from '../utils/constants';

export default function Header({
  dateFilter,
  onDateFilterChange,
  onRefresh,
  isRefreshing,
  lastUpdated,
  isOnline,
  onLogout,
}) {
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥗</span>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                NutraClínics Dashboard
              </h1>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                {/* Indicador de conexión */}
                {isOnline ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3 h-3" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <WifiOff className="w-3 h-3" />
                    Sin conexión
                  </span>
                )}
                {lastUpdated && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>Actualizado: {formatDateTime(lastUpdated)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filtro de fecha */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Select
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                options={DATE_FILTERS}
                className="w-40"
              />
            </div>

            {/* Botón actualizar */}
            <Button
              variant="outline"
              onClick={onRefresh}
              loading={isRefreshing}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>

            {/* Botón cerrar sesión */}
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600"
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
