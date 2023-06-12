'use client'
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
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
  const [email, setEmail] = useState('')
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
          await api.post('users/signin', loginData)
            .then(({ data }) => {
              const { id, name, email, jwtToken } = data;
              const cookieExpiresInSeconds = 43200
              _.setCookie('userData', JSON.stringify({ id, name, email, jwtToken }), { expires: cookieExpiresInSeconds })
              setUser({ id, name, email, jwtToken })
            })
            .catch(err => {
              if (err.response.data.message.includes('email not validated')) {
                openNotification(
                  'Conta não verificada!',
                  'Verifique sua caixa de entrada para confirmar seu e-mail.',
                  'warn'
                )
                setEmail(email)
                setViewBtnAccVerify(true)
                return
              }
              if (err.response.data.message.includes('Invalid Credentials')) {
                setValidationPass({
                  message: 'Autenticação inválida.',
                  type: 'error',
                  show: true
                })
                setValidationEmail({
                  message: '',
                  type: 'error',
                  show: true
                })
                return
              }
              openNotification(
                'Erro ao fazer login!',
                'Erro ao tentar fazer o login. Tente novamente!',
                'error'
              )
            })
        } catch (error: any) {
          openNotification(
            'Erro ao fazer login!',
            'Erro ao tentar fazer o login. Tente novamente!',
            'error'
          )
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

  const resendValidationEmail = async () => {
    setLoadEmail(true)
    await api.post('users/resend-validation-email', { email })
      .then(() => {
        openNotification(
          'Confirmação enviada!',
          'Email de confirmação enviado. Verifique sua caixa de entrada para confirmar seu e-mail.',
          'success'
        )
        router.push('/');
      })
      .catch((err) => {
        openNotification(
          'Erro ao enviar email!',
          'Email de confirmação não enviado. Verifique o email digitado.',
          'error'
        )
      })
      .finally(() => {
        setLoadEmail(false)
      })
  }

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

          <Button
            title={
              load
                ? <p className={styles.load}>Entrando... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                : <p>ENTRAR</p>
            }
            type='submit'
            disabled={load ? true : false}
          />

        </form >
        <div className={styles.form}        >
          <Button
            type='button'
            disabled={load ? true : false}
            visible={viewBtnAccVerify}
            title={
              loadEmail
                ? <p className={styles.load}>Enviando... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                : <p>Reenviar e-mail de confirmação?</p>
            }
            onClick={() => resendValidationEmail()}
          />
        </div>
      </main>
  );
}
