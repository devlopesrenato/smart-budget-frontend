import styles from './logo.module.css'

export const Logo = () => {

    return (
        <div className={styles.center}>
            <img className={styles.img} src='/logo.png' />
        </div>
    )
}