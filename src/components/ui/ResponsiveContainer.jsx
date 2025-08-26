import { memo } from 'react';
import styles from './ResponsiveContainer.module.css';

const ResponsiveContainer = memo(({ 
  children, 
  minItemWidth = '280px',
  gap = 'var(--space-6)',
  className = '',
  columns,
  breakpoints = {},
  ...props 
}) => {
  const defaultBreakpoints = {
    xxl: '1400px',
    xl: '1200px',
    lg: '1000px',
    md: '768px',
    sm: '600px',
    xs: '480px',
    ...breakpoints
  };

  const gridStyle = {
    '--min-item-width': minItemWidth,
    '--grid-gap': gap,
    '--columns': columns || 'auto-fill',
    ...Object.entries(defaultBreakpoints).reduce((acc, [key, value]) => {
      acc[`--bp-${key}`] = value;
      return acc;
    }, {})
  };

  return (
    <div 
      className={`${styles.container} ${className}`}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
});

ResponsiveContainer.displayName = 'ResponsiveContainer';

export default ResponsiveContainer;