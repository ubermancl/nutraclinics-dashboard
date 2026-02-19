import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card } from './ui';

export default function Login() {
  const { login, isLoading, error, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    await login(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-accent-magenta/5 via-transparent to-transparent translate-x-1/2" />

      <Card className="w-full max-w-md relative" padding="lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-4xl mb-4 shadow-glow-cyan">
            🥗
          </div>
          <h1 className="text-2xl font-bold text-gray-100">
            NutraClínics
          </h1>
          <p className="text-gray-400 mt-1">
            Dashboard de Gestión
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-button text-error text-sm">
              {error}
            </div>
          )}

          {/* Campo contraseña */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Botón */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            disabled={!password.trim()}
          >
            <Lock className="w-4 h-4" />
            Ingresar al Dashboard
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Clínica nutricional • Lima, Perú
        </p>
      </Card>
    </div>
  );
}
