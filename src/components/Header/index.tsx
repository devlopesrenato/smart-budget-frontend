import { AppContext } from '@/context/app.context';
import { Utils } from '@/utils/utils';
import { SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FiHome } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { DropdownMenu } from '../DropdownMenu';
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
        'details'
    ]

    const title = {
        'none': '',
        'sheet': 'Folhas de Orçamento',
        'details': 'Detalhes',
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

    const itemsMenu = [
        {
            label:
                <p className={styles.userNameMenu}>
                    {user?.name.slice(0, 15)}
                    {user && user.name.length > 15 ? '...' : ''}
                </p>,
            key: 'userName'
        },
        {
            label: 'Minha Conta',
            key: 'account',
            icon: <SolutionOutlined style={{ color: '#00C5FF' }} size={18} />
        },
        {
            label: 'Sair',
            key: 'logout',
            icon: <HiOutlineLogout color='#D94848' size={18} />,
            action: () => logout()
        }
    ]

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
                        <DropdownMenu
                            items={itemsMenu}
                            placement={'bottomLeft'}
                        >
                            <Avatar style={{ backgroundColor: '#332d2d' }} icon={<UserOutlined />} />
                        </DropdownMenu>
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