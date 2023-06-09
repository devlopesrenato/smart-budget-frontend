import Cookies from 'js-cookie';

export class Utils {
    public isEmpty(value: unknown) {
        if (typeof value !== 'string' || value.length === 0) {
            return true;
        }
        return false;
    }

    public isEmail(email: string | undefined) {
        if (!email) {
            return false
        }
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    }

    public setCookie(key: string, value: string, options = {}) {
        Cookies.set(key, value, options)
    };

    public getCookie(key: string) {
        return Cookies.get(key);
    };

    public removeCookie(key: string) {
        Cookies.remove(key);
    };
} 