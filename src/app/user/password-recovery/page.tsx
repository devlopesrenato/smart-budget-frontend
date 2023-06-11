'use client'
import EmailInput from '@/components/EmailInput';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import styles from './page.module.css';
const _ = new Utils;

interface ValidationsProps {
  email?: string,
  sendRecover?: boolean
}

export default function PasswordRecovery() {
  const [load, setLoad] = useState(false)
  const [validationEmail, setValidationEmail] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })

  const { loading, openNotification, setPage } = useContext(AppContext);

  const router = useRouter();

  function recover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email') || '');

    setLoad(true)
    validations({ email, sendRecover: true })
      .then(async loginData => {
        try {
          const { data } = await api.post('users/recover', loginData)
          if (data) {
            openNotification(
              'Recuperação de senha enviada!',
              'Enviamos um e-mail de redefinição da senha. Verifique sua caixa de entrada!',
              'success'
            )
            router.push('/user/signin')
          }
        } catch (error: any) {
          if(error.response.data.message.includes('A password reset email has already')){
            openNotification(
              'Email já enviado!',
              'Já foi solicitado uma redefinição em menos de 5 minutos! Aguarde para solicitar novamente.',
              'info'
            )
            return
          }
          if(error.response.data.message.includes('email not found')){
            setValidationEmail({
              type: 'warn',
              message: 'Email incorreto.',
              show: true
            });

            openNotification(
              'Email não encontrado!',
              'Não encontramos nenhuma conta com este e-mail! Verifique o e-mail digitado.',
              'warn'
            )

            return
          }
          openNotification(
            'Erro ao recuperar senha!',
            'Erro ao tentar recuperar sua senha. Verifique o e-mail digitado!',
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

  const validations = (props: ValidationsProps): Promise<{ email?: string }> => {
    return new Promise(async (resolve, reject) => {
      setValidationEmail((prev) => ({ ...prev, show: false }));

      const { email = undefined, sendRecover = false } = props;

      if ((email != undefined || sendRecover) && _.isEmpty(email)) {
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

      if ((email || sendRecover) && !_.isEmail(email)) {
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

      if (sendRecover && (!email)) {

        reject('data not sent')
      }
      resolve({ email });
    });
  };

  useEffect(() => {
    setPage('passwordRecovery')
  }, [])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <Logo />

        <div className={styles.pageTitle}>
          <h2>Esqueci minha senha</h2>
          <p>Insira seu E-mail e enviaremos um link para alterar sua senha.</p>
        </div>

        <form
          onSubmit={recover}
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
            placeholder={'E-mail cadastrado'}
            onChange={(email) => {
              validations({ email })
                .catch((err) => { })
            }}
          />

          <button
            type='submit'
            disabled={load ? true : false}
            className={styles.button}
          >
            {
              load
                ? <p className={styles.load}>Enviando... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                : <p>ENVIAR</p>
            }
          </button>

        </form >

      </main>
  );
}
