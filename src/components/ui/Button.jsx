import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-dark-900 font-semibold',
  secondary: 'bg-dark-700 hover:bg-dark-600 text-gray-100 border border-dark-600',
  outline: 'border border-dark-500 hover:bg-dark-700 text-gray-300',
  ghost: 'hover:bg-dark-700 text-gray-400 hover:text-gray-100',
  danger: 'bg-error hover:bg-red-600 text-white',
  success: 'bg-success hover:bg-emerald-600 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-button
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-dark-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
