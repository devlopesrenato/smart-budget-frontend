'use client'
import PasswordInput from '@/components/PasswordInput';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import SuccessError from '@/components/SuccessError';
import styles from './page.module.css';

const _ = new Utils;

interface ValidationsProps {
  password?: string,
  passwordConfirm?: string,
  sendRecover?: boolean
}

export default function AccountRecover() {
  const [load, setLoad] = useState(true)
  const [validationPass, setValidationPass] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [validationPassConfirm, setValidationPassConfirm] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [pswCompare, setPswCompare] = useState<String>('')
  const [error, setError] = useState(false)
  const [title, setTitle] = useState('Solicitação inválida.')
  const [subTitle, setSubTitle] = useState('')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  const { openNotification, loading, setPage } = useContext(AppContext);

  const router = useRouter();

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const password = String(formData.get('password') || '');
    const passwordConfirm = String(formData.get('passwordConfirm') || '');

    setLoad(true)
    validations({ password, passwordConfirm, sendRecover: true })
      .then(async ({ password }) => {
        try {
          await api.patch('users',
            {
              email,
              password
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
            .then(data => {
              openNotification(
                'Senha atualizada!',
                'Senha alterada com sucesso.',
                'success'
              )
              setLoad(true)
              router.push('/user/signin')
            })
            .catch(err => {
              openNotification(
                'Erro ao atualizar senha!',
                'Houve um erro ao tentar redefinir sua senha. \nTente novamente!',
                'error'
              )
            })
            .finally(() => {

            })
        } catch (error: any) {
          openNotification(
            'Erro ao criar conta!',
            'Houve um erro ao tentar criar sua contra. \nTente novamente!',
            'error'
          )
        }
      })
      .catch((err) =>
        console.log(err?.message)
      )
      .finally(() =>
        setLoad(false)
      )
  }

  const validations = (props: ValidationsProps): Promise<{ password?: string }> => {
    return new Promise(async (resolve, reject) => {
      setValidationPass((prev) => ({ ...prev, show: false }));
      setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      const {
        password = undefined,
        passwordConfirm = undefined,
        sendRecover = false
      } = props;

      if ((password !== undefined || sendRecover) && _.isEmpty(password)) {
        setValidationPass({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo de senha está vazio.'));
        if (!sendRecover) return;
      } else {
        setValidationPass((prev) => ({ ...prev, show: false }));
      }

      if ((passwordConfirm !== undefined || sendRecover) && _.isEmpty(passwordConfirm)) {
        setValidationPassConfirm({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo repita sua senha está vazio.'));
        if (!sendRecover) return;
      } else {
        setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      }

      if ((passwordConfirm !== undefined || sendRecover) && passwordConfirm !== pswCompare) {
        setValidationPassConfirm({
          type: 'warn',
          message: 'As senhas não conferem.',
          show: true
        });
        reject(new Error('Senhas não conferem.'));
        if (!sendRecover) return;
      } else {
        setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      }

      if ((password !== undefined) && password.length < 4) {
        setValidationPass({
          type: 'warn',
          message: 'A senha deve ter mais de 4 dígitos.',
          show: true
        });
        reject(new Error('Senha com menos de 4 dígitos'));
        if (!sendRecover) return;
      } else {
        setValidationPass((prev) => ({ ...prev, show: false }));
      }

      if (sendRecover && !password) {
        reject('data not sent')
      }
      resolve({ password });
    });
  };

  function verifyData() {
    setLoad(true)
    try {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      const email = url.searchParams.get('email');
      if (token?.length && email?.length) {
        setToken(token)
        setEmail(email)
        api.post('users/validate-data', {
          email,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(data => {
            setError(false)
          })
          .catch(err => {
            if (err.response.data.message.includes('user not found')) {
              setError(true)
              return
            }
            if (err.response.data.message.includes('this email does not belong to this userToken')) {
              setError(true)
              return
            }
            setError(true)
          })
          .finally(() => {
            setLoad(false)
          })
      } else {
        setError(true)
        setLoad(false)
      }
    } catch (error) {
      setTitle('Erro interno.')
      setError(true)
      setLoad(false)
    }
  }

  useEffect(() => {
    setPage('recover')
    verifyData()
  }, [])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <Logo />
        {error ?
          (<SuccessError type={'error'} title={title} subTitle={subTitle} />) : (
            <>
              <div className={styles.pageTitle}>
                <h2>Redefinir senha</h2>
                <p>Crie uma nova senha para sua conta.</p>
              </div>

              <form
                onSubmit={updatePassword}
                className={styles.form}
              >
                <PasswordInput
                  disabled={load}
                  id='password'
                  alert={{
                    type: validationPass.type,
                    message: validationPass.message,
                    show: validationPass.show
                  }}
                  onChange={(password) => {
                    setPswCompare(password)
                    validations({ password })
                      .catch((err) => { })
                  }}
                  placeholder={'Sua senha'}
                />

                <PasswordInput
                  disabled={load}
                  id='passwordConfirm'
                  alert={{
                    type: validationPassConfirm.type,
                    message: validationPassConfirm.message,
                    show: validationPassConfirm.show
                  }}
                  onChange={(passwordConfirm) => {
                    validations({ passwordConfirm })
                      .catch((err) => { })
                  }}
                  placeholder={'Repita sua senha'}
                />

                <Button
                  title={
                    load
                      ? <p className={styles.load}>Enviando dados... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                      : <p>REDEFINIR SENHA</p>
                  }
                  type='submit'
                  disabled={load ? true : false}
                />

              </form >
            </>)
        }
      </main>
  );
}
