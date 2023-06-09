'use client'
import { Logo } from '@/components/Logo';
import { AppContext } from '@/context/app.context';
import { BarChartOutlined, FileTextOutlined, LoadingOutlined, RiseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { TbArrowBarToUp } from 'react-icons/tb';
import styles from './page.module.css';

export default function Home() {
  const { user, loading, setPage } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/sheet');
    }
  }, [user])

  useEffect(() => {
    setPage('home')
  }, [])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <Logo />
        <div className={styles.pageTitle}>
          <p className={styles.textCenter}>Gerencie suas finanças de um jeito fácil e inteligente.</p>
          <div className={styles.iconsContent}>
            <RiseOutlined className={styles.icons} />
            <FileTextOutlined className={styles.icons} />
            <BarChartOutlined className={styles.icons} />
          </div>
        </div>

        <div className={styles.bottom}>
          <Link
            href={'/user/signin'}
            className={styles.link}
          >
            <div className={styles.card}>
              <h2>
                Entrar <span><AiOutlineLogin /></span>
              </h2>
              <p>Faça login e gerencie seu orçamento de forma inteligente.</p>
            </div>
          </Link>

          <Link
            className={styles.link}
            href={'/user/signup'}
          >
            <div className={styles.card}>
              <h2>
                Cadastre-se <span><TbArrowBarToUp /></span>
              </h2>
              <p>Novo usuário? Cadastre-se para criar sua conta no Smart Budget.</p>
            </div>
          </Link>
        </div>
      </main >
  );
}
