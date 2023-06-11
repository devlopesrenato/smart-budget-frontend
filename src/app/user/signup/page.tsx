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
import TextInput from '@/components/TextInput';
import styles from './page.module.css';
const _ = new Utils;

interface ValidationsProps {
  name?: string,
  email?: string,
  password?: string,
  passwordConfirm?: string,
  sendLogin?: boolean
}

export default function Signup() {
  const [load, setLoad] = useState(false)
  const [validationName, setValidationName] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [validationEmail, setValidationEmail] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [validationPass, setValidationPass] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [validationPassConfirm, setValidationPassConfirm] = useState<ErrorInputType>({ type: 'warn', message: '', show: false })
  const [pswCompare, setPswCompare] = useState<String>('')
  const { user, openNotification, loading, setPage, setUserCreated } = useContext(AppContext);

  const router = useRouter();

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const passwordConfirm = String(formData.get('passwordConfirm') || '');

    setLoad(true)
    validations({ name, email, password, passwordConfirm, sendLogin: true })
      .then(async ({ name, email, password }) => {
        try {
          const { data } = await api.post('users/signup', { name, email, password })
          if (data) {
            openNotification(
              'Conta criada!',
              'Conta criada com sucesso, verifique seu email para confirmar.',
              'success'
            )
            setUserCreated({
              id: data.id,
              email: data.email,
              name: data.name,
              jwtToken: ''
            })
            router.push('account/create/success')
          } else {
            openNotification(
              'Erro ao criar conta!',
              'Houve um erro ao tentar criar sua contra. \nTente novamente!',
              'error'
            )

          }
        } catch (error: any) {
          if (String(error.response.data.message).includes('email already exists')) {
            openNotification(
              'Erro ao criar conta!',
              'Este email já está sendo utilizado por outro usuário.',
              'warn'
            )
            setValidationEmail({
              type: 'warn',
              message: 'Este email já está sendo utilizado.',
              show: true
            });
          } else {
            openNotification(
              'Erro ao criar conta!',
              'Houve um erro ao tentar criar sua contra. \nTente novamente!',
              'error'
            )
          }
        }
      })
      .catch((err) =>
        console.log(err?.message)
      )
      .finally(() =>
        setLoad(false)
      )
  }

  const validations = (props: ValidationsProps): Promise<{ name?: string, email?: string, password?: string }> => {
    return new Promise(async (resolve, reject) => {
      setValidationEmail((prev) => ({ ...prev, show: false }));
      setValidationPass((prev) => ({ ...prev, show: false }));
      setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      const {
        name = undefined,
        email = undefined,
        password = undefined,
        passwordConfirm = undefined,
        sendLogin = false
      } = props;

      if ((name != undefined || sendLogin) && _.isEmpty(name)) {
        setValidationName({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo de nome está vazio.'));
        if (!sendLogin) return;
      } else {
        setValidationName((prev) => ({ ...prev, show: false }));
      }

      if ((email != undefined || sendLogin) && _.isEmpty(email)) {
        setValidationEmail({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo de e-mail está vazio.'));
        if (!sendLogin) return;
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
        if (!sendLogin) return;
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
        if (!sendLogin) return;
      } else {
        setValidationPass((prev) => ({ ...prev, show: false }));
      }

      if ((passwordConfirm !== undefined || sendLogin) && _.isEmpty(passwordConfirm)) {
        setValidationPassConfirm({
          type: 'warn',
          message: 'Preencha este campo.',
          show: true
        });
        reject(new Error('O campo repita sua senha está vazio.'));
        if (!sendLogin) return;
      } else {
        setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      }

      if ((passwordConfirm !== undefined || sendLogin) && passwordConfirm !== pswCompare) {
        setValidationPassConfirm({
          type: 'warn',
          message: 'As senhas não conferem.',
          show: true
        });
        reject(new Error('Senhas não conferem.'));
        if (!sendLogin) return;
      } else {
        setValidationPassConfirm((prev) => ({ ...prev, show: false }));
      }

      if (sendLogin && (!email || !password)) {

        reject('data not sent')
      }
      resolve({ name, email, password });
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/sheet');
    }
  }, [user])

  useEffect(() => {
    setPage('signup')
  }, [])

  return (
    loading
      ? <main className={styles.main}><LoadingOutlined style={{ fontSize: 24 }} spin /></main>
      : <main className={styles.main}>
        <Logo />

        <div className={styles.pageTitle}>
          <h2>Cadastre-se</h2>
          <p>Crie uma conta agora e gerencie suas finanças de um jeito fácil e inteligente.</p>
        </div>

        <form
          onSubmit={login}
          className={styles.form}
        >
          <TextInput
            id='name'
            placeholder='Nome completo'
            onChange={(name) => {
              validations({ name })
                .catch((err) => { })
            }}
            alert={{
              type: validationName.type,
              message: validationName.message,
              show: validationName.show
            }}
          />
          <EmailInput
            disabled={load}
            id='email'
            alert={{
              type: validationEmail.type,
              message: validationEmail.message,
              show: validationEmail.show
            }}
            placeholder={'Seu e-mail'}
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
          <button
            type='submit'
            disabled={load ? true : false}
            className={styles.button}
          >
            {
              load
                ? <p className={styles.load}>Enviando dados... <LoadingOutlined style={{ fontSize: 24 }} spin /></p>
                : <p>CRIAR CONTA</p>
            }
          </button>

        </form >

      </main>
  );
}
