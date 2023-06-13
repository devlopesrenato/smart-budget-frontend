'use client'
import { Button } from '@/components/Button';
import Link from 'next/link';
import styles from './page.module.css';

export default function AccountCreatedSuccess() {

    return (
        <main className={styles.main}>
            <h4>Página em construção</h4>
            <div className={styles.center}>
                <Link href={'/sheet'} >
                    <Button title={'VOLTAR'} type={undefined} />
                </Link>
            </div>
        </main >
    );
}
