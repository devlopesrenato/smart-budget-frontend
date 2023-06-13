import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FiHome, FiLogOut } from 'react-icons/fi';
import styles from './header.module.css';

const _ = new Utils()

export const Header: React.FC = () => {
    const [viewGoBack, setViewGoBack] = useState(false)
    const [viewHeader, setViewHeader] = useState(false)
    const { user, loading, setUser, page } = useContext(AppContext);
    const router = useRouter()

    const pagesWithGoBack: string[] = [
        'signin',
        'signup',
        'passwordRecovery'
    ]

    const pagesWithHeader: string[] = [
        'sheet',
    ]

    const title = {
        'none': '',
        'sheet': 'Folhas de Orçamento'
    }

    function getTitle(page: string) {
        // @ts-ignore
        return title[page]
    }

    useEffect(() => {
        if (pagesWithGoBack.includes(page)) {
            setViewGoBack(true)
        } else {
            setViewGoBack(false)
        }

        if (pagesWithHeader.includes(page)) {
            setViewHeader(true)
        } else {
            setViewHeader(false)
        }

    }, [page])

    function logout() {
        setUser(null)
        _.removeCookie('userData')
    }

    return (
        (user !== null && !loading) ?
            (
                <div
                    className={styles.header}
                    style={{
                        display: viewHeader ? 'flex' : 'none'
                    }}
                >
                    <p>{getTitle(page)}</p>
                    <div className={styles.userSection}>
                        <p>{user.name}</p>
                        <FiLogOut
                            className={styles.iconLogout}
                            onClick={() =>
                                logout()
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.headerOff}>
                    <Link
                        href={'/'}
                        className={styles.link}
                        style={{
                            display: viewGoBack ? 'flex' : 'none'
                        }}>
                        <FiHome />
                        Página Inicial
                    </Link>

                </div>
            )
    )
}