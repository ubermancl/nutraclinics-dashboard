import { CRM_STATES, SCHEDULING_STATES } from '../../utils/constants';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Badge específico para estados CRM
export const CRMBadge = ({ state, size = 'md' }) => {
  const stateConfig = CRM_STATES[state] || { color: 'bg-gray-100 text-gray-800' };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${stateConfig.color}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
      `}
    >
      {state}
    </span>
  );
};

// Badge específico para estados de agendamiento
export const SchedulingBadge = ({ state, size = 'md' }) => {
  const stateConfig = SCHEDULING_STATES[state] || { color: 'bg-gray-100 text-gray-800' };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${stateConfig.color}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
      `}
    >
      {state}
    </span>
  );
};

export default Badge;
