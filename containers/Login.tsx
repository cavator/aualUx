import {useState} from 'react'
import {executeRequest} from '../services/api'
import {NextPage} from 'next'
import {AccessTokenProps} from '../types/AccessTokenProps'

/* eslint-disable @next/next/no-img-element */
export const Login: NextPage<AccessTokenProps> = ({
                                                      setToken,
                                                  }) => {
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [inSingIn, setSingIn] = useState(false)
    const doLogin = async () => {
        try {
            setLoading(true)
            setError('')
            if (!login && !password) {
                setError('Favor informar email e senha')
                setLoading(false)
                return
            }

            const body = {
                login,
                password,
            }

            const result = await executeRequest('login', 'POST', body)
            if (result && result.data) {
                localStorage.setItem('accessToken', result.data.token)
                localStorage.setItem('userName', result.data.name)
                localStorage.setItem('userMail', result.data.mail)
                setToken(result.data.token)
            } else {
                setError('Não foi possivel processar login, tente novamente')
            }
        } catch (e: any) {
            console.log(e)
            if (e?.response?.data?.error) {
                setError(e?.response?.data?.error)
            } else {
                setError('Não foi possivel processar login, tente novamente')
            }
        }

        setLoading(false)
    }
    const doRegister = async () => {
        try {
            setLoading(true)
            setError('')
            if (!name && !login && !password && !confirmPassword) {
                setError('Todos campos sao obrigatorios')
                setLoading(false)
                return
            }
            if (!password && !confirmPassword) {
                setError('senhas nao conferem')
                setLoading(false)
                return
            }
            const email = login
            const body = {
                name,
                email,
                password,
            }
            const result = await executeRequest('user', 'POST', body)
            if (result && result.data) {
               await doLogin()

            } else {
                setError('Não foi possivel processar login, tente novamente')
            }

        } catch (e: any) {
            if (e?.response?.data?.error) {
                setError(e?.response?.data?.error)
            }
            else {
                setError('Não foi possivel processar cadastrar, tente novamente')
            }

        }
        setLoading(false)
    }

    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
            {!inSingIn ?
                <form>
                    <p className="error">{error}</p>
                    <div className="input">
                        <img src="/mail.svg" alt="Informe seu email"/>
                        <input type="text" placeholder="Informe seu email"
                               value={login} onChange={evento => setLogin(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/lock.svg" alt="Informe sua senha"/>
                        <input type="password" placeholder="Informe sua senha"
                               value={password} onChange={evento => setPassword(evento.target.value)}/>
                    </div>
                    <button type="button" onClick={doLogin} disabled={isLoading}
                            className={isLoading ? 'loading' : ''}>
                        {isLoading ? '...Carregando' : 'Login'}
                    </button>
                    <div className={"p"} onClick={()=>setSingIn(true)}>
                        <p>nao possui conta? Cadastre-se</p>
                    </div>
                </form>
                :
                <form>
                    <p className="error">{error}</p>
                    <div className="mobile">
                        <img src="/exit-mobile.svg" alt="return"  onClick={()=>setSingIn(false)}/>
                    </div>
                    <div className="desktop">
                        <img src="/exit-desktop.svg" alt="return" onClick={()=>setSingIn(false)}/>
                    </div>
                    <div className="input">
                        <img src="/user.svg" alt="Informe seu nome" className={"filter-fiap"}/>
                        <input type="text" placeholder="Informe seu nome"
                               value={name} onChange={evento => setName(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/mail.svg" alt="Informe seu email"/>
                        <input type="text" placeholder="Informe seu email"
                               value={login} onChange={evento => setLogin(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/lock.svg" alt="Informe sua senha"/>
                        <input type="password" placeholder="Informe sua senha"
                               value={password} onChange={evento => setPassword(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/lock.svg" alt="Repita sua senha"/>
                        <input type="password" placeholder="Repita sua senha"
                               value={confirmPassword} onChange={evento => setConfirmPassword(evento.target.value)}/>
                    </div>
                    <button type="button" onClick={doRegister} disabled={isLoading}
                            className={isLoading ? 'loading' : ''}>
                        {isLoading ? '...Carregando' : 'Cadastrar'}
                    </button>
                </form>
            }
        </div>
    )
}
