import { useAuth, AuthProvider } from './hooks/useAuth';
import { useLeads } from './hooks/useLeads';
import { useStats } from './hooks/useStats';
import Layout from './components/Layout';
import Login from './components/Login';
import Header from './components/Header';
import Cards from './components/Cards';
import Alerts from './components/Alerts';
import Charts from './components/Charts';
import AdvancedMetrics from './components/AdvancedMetrics';
import Table from './components/Table';
import Insights from './components/Insights';
import { LoadingScreen } from './components/ui';
import { SkeletonCard, SkeletonChart, SkeletonTable } from './components/ui/Skeleton';

function Dashboard() {
  const { logout } = useAuth();
  const {
    filteredLeads,
    allLeads,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    isOnline,
    refresh,
    dateFilter,
    setDateFilter,
    customDateRange,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    districtFilter,
    setDistrictFilter,
    uniqueStatuses,
    uniqueDistricts,
  } = useLeads();

  const stats = useStats(allLeads, dateFilter, customDateRange.start, customDateRange.end);

  // Estado de carga inicial
  if (isLoading && allLeads.length === 0) {
    return <LoadingScreen message="Cargando datos del dashboard..." />;
  }

  return (
    <Layout>
      <Header
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        isOnline={isOnline}
        onLogout={logout}
      />

      <main className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-card text-red-700">
            <p className="font-medium">Error al cargar datos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Sin conexión */}
        {!isOnline && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-card text-amber-700 text-sm">
            Sin conexión a internet - Mostrando última información guardada
          </div>
        )}

        {/* Métricas principales */}
        {isRefreshing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Cards metrics={stats.metrics} />
        )}

        {/* Alertas */}
        <Alerts alerts={stats.alerts} />

        {/* Gráficos */}
        {isRefreshing ? (
          <SkeletonChart />
        ) : (
          <Charts
            funnelData={stats.funnelData}
            leadsByDay={stats.leadsByDay}
            appointmentsByDay={stats.appointmentsByDay}
            revenueByWeek={stats.revenueByWeek}
            statusDistribution={stats.statusDistribution}
            districtDistribution={stats.districtDistribution}
            originDistribution={stats.originDistribution}
            disqualificationReasons={stats.disqualificationReasons}
          />
        )}

        {/* Métricas avanzadas */}
        <AdvancedMetrics metrics={stats.advancedMetrics} />

        {/* Insights */}
        <Insights insights={stats.insights} />

        {/* Tabla de leads */}
        {isRefreshing ? (
          <SkeletonTable rows={5} />
        ) : (
          <Table
            leads={filteredLeads}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            districtFilter={districtFilter}
            onDistrictChange={setDistrictFilter}
            uniqueStatuses={uniqueStatuses}
            uniqueDistricts={uniqueDistricts}
          />
        )}
      </main>
    </Layout>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
