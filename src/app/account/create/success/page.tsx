'use client'
import { Logo } from '@/components/Logo';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';

const _ = new Utils;

export default function AccountCreatedSuccess() {
    const [load, setLoad] = useState(true)
    const { userCreated, loading, setPage, setUserCreated } = useContext(AppContext);

    const router = useRouter();

    useEffect(() => {
        setPage('createSuccess')
        setTimeout(() => {
            if (userCreated == null) {
                router.push('/')
            } else {
                setUserCreated(null)
            }
        }, 5000)
    }, [])

    useEffect(() => {
        if (userCreated !== null) {
            setLoad(false)
        }
    }, [userCreated])

    return (
        <main className={styles.main}>
            {
                load
                    ? <LoadingOutlined style={{ fontSize: 24 }} spin />
                    : (<>
                        <Logo />
                        <div className={styles.center}>
                            <SuccessError
                                type={'success'}
                                title={'Contra criada com sucesso!'}
                                subTitle={'Verifique seu email para confirmar a criação da sua conta.'}
                                buttonLink='/user/signin'
                                buttonTitle='Login'
                            />
                        </div>
                    </>)
            }
        </main >
    );
}
