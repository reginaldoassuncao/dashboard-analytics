import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, options = {}) {
  const {
    duration = 2000,
    startValue = 0,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    easingFunction = easeOutCubic,
    delay = 0
  } = options;

  const [current, setCurrent] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const startValueRef = useRef(startValue);

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp + delay;
      startValueRef.current = current;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    if (progress > 0) {
      const easedProgress = easingFunction(progress);
      const currentValue = startValueRef.current + (target - startValueRef.current) * easedProgress;
      setCurrent(currentValue);
    }

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setCurrent(target);
    }
  };

  const start = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setCurrent(startValue);
    setIsAnimating(false);
    startTimeRef.current = null;
  };

  useEffect(() => {
    if (target !== null && target !== undefined) {
      start();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target]);

  const formatValue = (value) => {
    let formattedValue = parseFloat(value.toFixed(decimals));
    
    if (separator && formattedValue >= 1000) {
      formattedValue = formattedValue.toLocaleString('pt-BR');
    }
    
    return `${prefix}${formattedValue}${suffix}`;
  };

  return {
    value: formatValue(current),
    rawValue: current,
    isAnimating,
    start,
    reset
  };
}

export function useStaggeredCountUp(targets, options = {}) {
  const { staggerDelay = 100 } = options;
  const counters = targets.map((target, index) => 
    useCountUp(target, {
      ...options,
      delay: index * staggerDelay
    })
  );

  return counters;
}