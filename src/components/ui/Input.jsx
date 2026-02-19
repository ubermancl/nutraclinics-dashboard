import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2
          bg-dark-800 border border-dark-600 rounded-input
          text-gray-100 placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan
          disabled:bg-dark-700 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
