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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md" padding="lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥗</div>
          <h1 className="text-2xl font-bold text-text-primary">
            NutraClínics
          </h1>
          <p className="text-text-secondary mt-1">
            Dashboard de Gestión
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-button text-red-700 text-sm">
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
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
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
        <p className="text-center text-xs text-text-secondary mt-8">
          Clínica nutricional en Lima, Perú
        </p>
      </Card>
    </div>
  );
}
