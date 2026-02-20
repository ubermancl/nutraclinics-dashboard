import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent opacity-50" />
      <div className="fixed inset-0 bg-gradient-radial from-accent-magenta/5 via-transparent to-transparent translate-x-1/2 opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 py-5 border-t border-dark-700/50 no-print">
        <p className="text-center text-xs text-gray-700">
          Dashboard diseñado y desarrollado por{' '}
          <a
            href="https://innovarketing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-accent-cyan transition-colors"
          >
            Javier Vrandečić
          </a>
          {' '}— Consultor en Automatización IA |{' '}
          <a
            href="https://innovarketing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-accent-cyan transition-colors"
          >
            Innovarketing
          </a>
        </p>
      </footer>

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
