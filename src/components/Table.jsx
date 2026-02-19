import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, ChevronUp, ChevronDown, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Card, Button, Input, Select, CRMBadge, Modal } from './ui';
import { formatDate, formatPhone, formatName, formatCurrency, formatDateTime } from '../utils/formatters';

// Modal de detalles del lead
function LeadDetailModal({ lead, isOpen, onClose }) {
  if (!lead) return null;

  const sections = [
    {
      title: 'Información Personal',
      fields: [
        { label: 'Nombre', value: formatName(lead.Nombre) },
        { label: 'Teléfono', value: formatPhone(lead.Phone) },
        { label: 'Email', value: lead.Email },
        { label: 'Contact ID', value: lead['Contact ID'] },
      ],
    },
    {
      title: 'Estado',
      fields: [
        { label: 'Estado CRM', value: lead['Estado CRM'], badge: true },
        { label: 'Estado Agendamiento', value: lead['Estado Agendamiento'] },
        { label: '¿Calificado?', value: lead['¿Calificado?'] ? 'Sí' : 'No' },
        { label: 'Requiere Revisión', value: lead['Requiere revisión manual'] ? 'Sí' : 'No' },
      ],
    },
    {
      title: 'Ubicación',
      fields: [
        { label: 'Distrito Residencia', value: lead['Distrito Residencia'] },
        { label: 'Distrito Trabajo', value: lead['Distrito Trabajo'] },
        { label: 'Distrito Calificación', value: lead['Distrito Usado Para Calificar'] },
      ],
    },
    {
      title: 'Citas',
      fields: [
        { label: 'Fecha Agendamiento', value: formatDate(lead['Fecha de agendamiento']) },
        { label: 'Hora Cita', value: lead['Hora Cita'] },
        { label: 'Confirmó Cita', value: lead['Confirmo Cita'] ? 'Sí' : 'No' },
        { label: 'Recordatorio 24h', value: lead['Recordatorio 24h Enviado'] ? 'Enviado' : 'No' },
        { label: 'Recordatorio 4h', value: lead['Recordatorio 4h Enviado'] ? 'Enviado' : 'No' },
      ],
    },
    {
      title: 'Historial',
      fields: [
        { label: 'No-Shows', value: lead['N° No-Shows'] || 0 },
        { label: 'Cancelaciones', value: lead['N° Cancelaciones'] || 0 },
        { label: 'Reprogramaciones', value: lead['N° Reprogramaciones'] || 0 },
        { label: 'Usó Diagnóstico Gratis', value: lead['Ya Usó Diagnóstico Gratis'] ? 'Sí' : 'No' },
      ],
    },
    {
      title: 'Ventas',
      fields: [
        { label: 'Monto Venta', value: formatCurrency(lead['Monto Venta Cerrada']) },
        { label: 'Plan Adquirido', value: lead['Plan Adquirido'] },
      ],
    },
    {
      title: 'Seguimiento',
      fields: [
        { label: 'Intentos Seguimiento', value: lead['Intentos seguimiento'] || 0 },
        { label: 'Último Retargeting', value: formatDate(lead['Fecha de último retargeting']) },
        { label: 'Origen', value: lead['Origen del Lead'] },
      ],
    },
    {
      title: 'Razones',
      fields: [
        { label: 'Razón Calificación', value: lead['Razón Calificación'] },
        { label: 'Razón Descalificación', value: lead['Razón Descalificación'] },
      ],
    },
    {
      title: 'Fechas',
      fields: [
        { label: 'Creado', value: formatDateTime(lead['CreatedAt']) },
        { label: 'Última Modificación', value: formatDateTime(lead['Última Modificación']) },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Lead" size="lg">
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-text-primary mb-2">{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {section.fields.map((field) => (
                <div key={field.label} className="text-sm">
                  <span className="text-text-secondary">{field.label}: </span>
                  {field.badge && field.value ? (
                    <CRMBadge state={field.value} size="sm" />
                  ) : (
                    <span className="text-text-primary font-medium">{field.value || '-'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default function Table({
  leads,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  districtFilter,
  onDistrictChange,
  uniqueStatuses,
  uniqueDistricts,
}) {
  const [sorting, setSorting] = useState([{ id: 'CreatedAt', desc: true }]);
  const [selectedLead, setSelectedLead] = useState(null);

  // Columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'Nombre',
      header: 'Nombre',
      cell: ({ getValue }) => (
        <span className="font-medium">{formatName(getValue())}</span>
      ),
    },
    {
      accessorKey: 'Phone',
      header: 'Teléfono',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{formatPhone(getValue())}</span>
      ),
    },
    {
      accessorKey: 'Estado CRM',
      header: 'Estado',
      cell: ({ getValue }) => <CRMBadge state={getValue()} size="sm" />,
    },
    {
      accessorKey: 'Distrito Usado Para Calificar',
      header: 'Distrito',
      cell: ({ getValue, row }) => getValue() || row.original['Distrito Residencia'] || '-',
    },
    {
      accessorKey: 'CreatedAt',
      header: 'Fecha',
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLead(row.original);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ], []);

  // Configuración de la tabla
  const table = useReactTable({
    data: leads,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Nombre', 'Teléfono', 'Email', 'Estado CRM', 'Distrito', 'Fecha Creación', 'Monto Venta'];
    const rows = leads.map(lead => [
      lead.Nombre || '',
      lead.Phone || '',
      lead.Email || '',
      lead['Estado CRM'] || '',
      lead['Distrito Usado Para Calificar'] || lead['Distrito Residencia'] || '',
      lead.CreatedAt || '',
      lead['Monto Venta Cerrada'] || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_nutraclinics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card padding="none">
        {/* Header */}
        <div className="p-4 border-b space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Leads ({leads.length})
            </h3>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              options={[
                { value: '', label: 'Todos los estados' },
                ...uniqueStatuses.map(s => ({ value: s, label: s }))
              ]}
              className="w-full sm:w-48"
            />
            <Select
              value={districtFilter}
              onChange={(e) => onDistrictChange(e.target.value)}
              options={[
                { value: '', label: 'Todos los distritos' },
                ...uniqueDistricts.map(d => ({ value: d, label: d }))
              ]}
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronUp className="w-4 h-4" />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown className="w-4 h-4" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLead(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Mostrar:</span>
            <Select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de detalles */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </>
  );
}
