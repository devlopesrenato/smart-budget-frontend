'use client'
import { SheetsView } from '@/components/SheetsView';
import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Details from './details/details';
import styles from './page.module.css';

const _ = new Utils;

export default function Sheet() {
  const [loadPage, setLoadPage] = useState<boolean>(true)  
  const { user, loading, setPage, setIdSheetDetail, idSheetDetail } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setPage('sheet')
    getSheetIDByRoute()
  }, [])

  useEffect(() => {
    if (user === null && !loading) {
      router.push('/user/signin');
    }
  }, [user, loading])

  function getSheetIDByRoute() {
    try {
      const url = new URL(window.location.href);
      const id = url.searchParams.get('id');
      if (id?.length) {
        setIdSheetDetail(Number(id))
        setLoadPage(false)
      } else {
        setLoadPage(false)
      }
    } catch (error) {
      setLoadPage(false)
    }
  }

  return (
    <main className={styles.main}>
      {(user === null || loading || loadPage)
        ? <LoadingOutlined style={{ fontSize: 24 }} spin />
        : (
          idSheetDetail
            ? (
              <Details params={{
                id: idSheetDetail
              }} />
            )
            : (
              <SheetsView />
            )
        )
      }
    </main>
  );
}
