import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './style.module.css';

export default function Layout() {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}