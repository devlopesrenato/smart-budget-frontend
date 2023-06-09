'use client'
import { Logo } from '@/components/Logo';
import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { Button, Result } from 'antd';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import styles from './page.module.css';

const _ = new Utils;

export default function AccountCreatedSuccess() {
    const { setPage } = useContext(AppContext);
    
    useEffect(() => {
        setPage('createSuccess')
    }, [])

    return (
        <main className={styles.main}>
            <Logo />
            <div className={styles.center}>
                <Result
                    status='success'
                    title={<span key='title' className={styles.title}>Contra criada com sucesso!</span>}
                    subTitle={<span key='subTitle' className={styles.title}>Verifique seu email para confirmar a criação da sua conta.</span>}
                    extra={[
                        <Link
                            key="linkLogin"
                            href={'/user/signin'}
                        >
                            <Button type="primary" key="login">
                                Login
                            </Button>
                        </Link>
                    ]}
                />
            </div>
        </main >
    );
}
