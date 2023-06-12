import styles from './button.module.css';

interface ButtonProps {
    title: string | JSX.Element;
    onClick?: () => void;
    disabled?: boolean;
    visible?: boolean;
    type: 'submit' | 'button' | 'reset' | undefined;

}

export const Button: React.FC<ButtonProps> = ({
    title = '',
    onClick,
    disabled = false,
    visible = true,
    type = undefined
}) => {

    return (
        <button
            style={{ display: visible ? 'flex' : 'none' }}
            type={type}
            disabled={disabled}
            className={styles.button}
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}
        >
            {title}
        </button>
    )
}