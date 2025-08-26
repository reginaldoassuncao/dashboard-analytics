import UsersTable from '../components/table/UsersTable';
import styles from './Users.module.css';

function Users() {
  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestão de Usuários</h1>
        <p className={styles.subtitle}>
          Visualize e analise o comportamento dos usuários da plataforma
        </p>
      </div>
      
      <UsersTable />
    </div>
  )
}

export default Users