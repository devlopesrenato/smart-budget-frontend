import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FiHome, FiLogOut } from 'react-icons/fi';
import styles from './header.module.css';

const _ = new Utils()

export const Header: React.FC = () => {
    const [viewGoBack, setViewGoBack] = useState(false)
    const { user, loading, setUser, page } = useContext(AppContext);
    const router = useRouter()

    const pagesWithGoBack: string[] = [
        'signin',
        'signup',
        'passwordRecovery'
    ]

    useEffect(() => {
        if (pagesWithGoBack.includes(page)) {
            setViewGoBack(true)
        } else {
            setViewGoBack(false)
        }
    }, [page])

    function logout() {
        setUser(null)
        _.removeCookie('userData')
    }

    return (
        (user !== null && !loading) ?
            (
                <div className={styles.header} >
                    <p>{user.name}</p>
                    <FiLogOut
                        className={styles.iconLogout}
                        onClick={() =>
                            logout()
                        }
                    />
                </div>
            ) : (
                <div className={styles.headerOff}>
                    <FiHome
                        style={{
                            display: viewGoBack ? 'flex' : 'none'
                        }}
                        onClick={() =>
                            router.push('/')
                        }
                    />
                    
                </div>
            )
    )
}