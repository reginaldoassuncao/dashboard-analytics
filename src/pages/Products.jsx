import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';

function Products() {
  const location = useLocation();

  // Handle success messages from form
  useEffect(() => {
    if (location.state?.message) {
      // In a real app, you might show a toast notification here
      console.log(`${location.state.type}: ${location.state.message}`);
      
      // Clear the state to prevent showing message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return <ProductsList />;
}

export default Products