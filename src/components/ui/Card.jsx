const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  glow = null,
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const glowStyles = {
    cyan: 'hover:shadow-glow-cyan',
    magenta: 'hover:shadow-glow-magenta',
    green: 'hover:shadow-glow-green',
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass-card
        ${hover ? 'hover:border-dark-500 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? glowStyles[glow] : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export default Card;
