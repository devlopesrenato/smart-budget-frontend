'use client'
import { Logo } from '@/components/Logo';
import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import styles from './page.module.css';

const _ = new Utils;

export default function Sheet() {
  const { user, loading, setPage } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setPage('sheet')
  }, [])

  useEffect(() => {
    if (user === null && !loading) {
      router.push('/user/signin');
    }
  }, [user, loading])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <div className={styles.center}>
          <Logo />
        </div>

      </main>
  );
}
