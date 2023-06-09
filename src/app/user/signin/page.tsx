'use client'
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { setTimeout } from 'timers';
import styles from './page.module.css';
const _ = new Utils;

interface ValidationsProps {
  email?: string,
  password?: string,
  sendLogin?: boolean
}

export default function Signin() {
  const [load, setLoad] = useState(false)
  const [validationPass, setValidationPass] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [validationEmail, setValidationEmail] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [viewBtnAccVerify, setViewBtnAccVerify] = useState(false)
  const [loadEmail, setLoadEmail] = useState(false)

  const { user, setUser, loading, openNotification, setPage } = useContext(AppContext);

  const router = useRouter();

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    setLoad(true)
    validations({ email, password, sendLogin: true })
      .then(async loginData => {
        try {
          const { data } = await api.post('users/signin', loginData)
          if (data) {
            const { id, name, email, jwtToken } = data;
            const cookieExpiresInSeconds = 43200
            _.setCookie('userData', JSON.stringify({ id, name, email, jwtToken }), { expires: cookieExpiresInSeconds })
            setUser({ id, name, email, jwtToken })
          }
        } catch (error: any) {
          if (error.response.data.message.includes('email not validated')) {
            openNotification(
              'Conta não verificada!',
              'Verifique sua caixa de entrada para confirmar seu e-mail.',
              'warn'
            )
            setViewBtnAccVerify(true)
          } else {
            openNotification(
              'Erro ao fazer login!',
              'Erro ao tentar fazer o login. \nTente novamente!',
              'error'
            )
          }
        }
      })
      .catch((err) => {
        console.log(err?.message)
      })
      .finally(() =>
        setLoad(false)
      )
  }

  const validations = (props: ValidationsProps): Promise<{ email?: string, password?: string }> => {
    return new Promise(async (resolve, reject) => {
      setValidationEmail((prev) => ({ ...prev, show: false }));
      setValidationPass((prev) => ({ ...prev, show: false }));
      const { email = undefined, password = undefined, sendLogin = false } = props;

      if ((email != undefined || sendLogin) && _.isEmpty(email)) {
        setValidationEmail({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo de e-mail está vazio.'));
        return;
      } else {
        setValidationEmail((prev) => ({ ...prev, show: false }));
      }

      if ((email || sendLogin) && !_.isEmail(email)) {
        setValidationEmail({
          type: 'error',
          message: 'E-mail inválido.',
          show: true
        });
        reject(new Error('O e-mail é inválido.'));
        return;
      } else {
        setValidationEmail((prev) => ({ ...prev, show: false }));
      }

      if ((password !== undefined || sendLogin) && _.isEmpty(password)) {
        setValidationPass({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo de senha está vazio.'));
        return;
      } else {
        setValidationPass((prev) => ({ ...prev, show: false }));
      }

      if (sendLogin && (!email || !password)) {

        reject('data not sent')
      }
      resolve({ email, password });
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/sheet');
    }
  }, [user])

  useEffect(() => {
    setPage('signin')
  }, [])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <Logo />

        <div className={styles.pageTitle}>
          <h2>Entrar</h2>
          <p>Entre e gerencie suas finanças de um jeito fácil e inteligente.</p>
        </div>

        <form
          onSubmit={login}
          className={styles.form}
        >
          <EmailInput
            disabled={load}
            id='email'
            alert={{
              type: validationEmail.type,
              message: validationEmail.message,
              show: validationEmail.show
            }}
            placeholder={'E-mail'}
            onChange={(email) => {
              validations({ email })
                .catch((err) => { })
            }}
          />
          <PasswordInput
            disabled={load}
            id='password'
            alert={{
              type: validationPass.type,
              message: validationPass.message,
              show: validationPass.show
            }}
            onChange={(password) => {
              validations({ password })
                .catch((err) => { })
            }}
            placeholder={'Senha'}
          />
          <Link href={'/user/password-recovery'} >
            <p className={styles.recoverPass}>Esqueci minha senha.</p>
          </Link>

          <button
            type='submit'
            disabled={load ? true : false}
            className={styles.button}
          >
            {
              load
                ? <p className={styles.load}>Entrando... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                : <p>ENTRAR</p>
            }
          </button>


        </form >

        <button
          style={{ display: viewBtnAccVerify ? 'flex' : 'none' }}
          disabled={loadEmail ? true : false}
          className={styles.buttonResend}
          onClick={() => {
            setLoadEmail(true)
            setTimeout(() => {
              openNotification(
                'E-mail enviado!',
                'Enviamos um e-mail de confirmação da sua conta. Verifique sua caixa de entrada!',
                'info'
              )
              router.push('/');
            }, 5000)
          }}
        >
          {
            loadEmail
              ? <p className={styles.load}>Enviando... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
              : <p>Reenviar e-mail de confirmação?</p>
          }
        </button>

      </main>
  );
}
