import { memo, useMemo, useCallback } from 'react';

// Higher-order component for memoizing components
export function withMemo(Component, areEqual) {
  return memo(Component, areEqual);
}

// Hook for memoizing expensive calculations
export function useMemoizedValue(factory, deps) {
  return useMemo(factory, deps);
}

// Hook for memoizing callback functions
export function useMemoizedCallback(callback, deps) {
  return useCallback(callback, deps);
}

// Component for lazy loading images with intersection observer
export const LazyImage = memo(({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          {...props}
        />
      )}
    </div>
  );
});

// Virtual scrolling component for large lists
export const VirtualList = memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  className 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return (
    <div
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div
              key={item.index}
              style={{
                height: itemHeight,
                overflow: 'hidden'
              }}
            >
              {renderItem(item, item.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Debounced input component
export const DebouncedInput = memo(({ 
  value, 
  onChange, 
  delay = 300, 
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState(value);
  
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [internalValue, onChange, delay, value]);

  return (
    <input
      {...props}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
});

// Performance monitoring hook
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Longer than 1 frame (60fps)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}

// Bundle size optimizer - code splitting utilities
export const loadChartLibrary = () => {
  return import('chart.js').then(module => module.default);
};

export const loadDateLibrary = () => {
  return import('date-fns').then(module => module);
};