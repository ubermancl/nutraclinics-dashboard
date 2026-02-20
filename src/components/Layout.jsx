import { Toaster } from 'react-hot-toast';
import { CLIENT_CONFIG } from '../config/client';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent opacity-50 no-print" />
      <div className="fixed inset-0 bg-gradient-radial from-accent-magenta/5 via-transparent to-transparent translate-x-1/2 opacity-50 no-print" />

      {/* Content */}
      <div className="relative z-10" id="dashboard-print-root">
        {children}

        {/* Footer */}
        <footer className="mt-8 py-5 border-t border-dark-700/50">
          {/* Versión pantalla */}
          <div className="footer-screen text-center">
            <p className="text-xs text-gray-700">
              Dashboard elaborado por{' '}
              <a
                href="https://innovarketing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-accent-cyan transition-colors"
              >
                Innovarketing.com
              </a>
            </p>
          </div>
          {/* Versión PDF — oculta en pantalla, activada por onclone al exportar */}
          <div className="footer-pdf hidden text-center space-y-1">
            <p className="text-xs text-gray-500">
              Informe elaborado por{' '}
              <a href="https://innovarketing.com" className="text-accent-cyan/70">
                Innovarketing.com
              </a>
              {' '}para{' '}
              <span className="text-gray-400 font-medium">{CLIENT_CONFIG.name}</span>
            </p>
            <p className="text-xs text-gray-600">
              Javier Vrandečić — Consultor en Automatización IA
            </p>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#161B22',
            color: '#F3F4F6',
            border: '1px solid #30363D',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#161B22',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#161B22',
            },
          },
        }}
      />
    </div>
  );
}
