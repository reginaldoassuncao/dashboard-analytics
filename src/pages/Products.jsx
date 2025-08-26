import ProductsTable from '../components/table/ProductsTable';
import styles from './Products.module.css';

function Products() {
  return (
    <div className={styles.products}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestão de Produtos</h1>
        <p className={styles.subtitle}>
          Visualize e gerencie todos os produtos da plataforma
        </p>
      </div>
      
      <ProductsTable />
    </div>
  )
}

export default Products