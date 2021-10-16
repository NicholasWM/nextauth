import { createContext, ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from '../services/apiClient'
type User = {
    email: string,
    permissions: string[],
    roles: string[],
}

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>,
    signOut: () => void,
    isAuthenticated: boolean,
    user: User,
}
type SignInCredentials = {
    email: string,
    password: string,
}

type AuthProviderProps = {
    children: ReactNode // Quando o componente pode receber qualquer outra coisa dentro dele
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel = undefined
type MeResponse = {
    email: string,
    permissions: string[],
    roles: string[]
}
type SessionsResponse = {
    token: string,
    refreshToken: string,
    permissions: string[],
    roles: string[]
}
export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')
    if(authChannel.name == 'auth'){
        authChannel.postMessage('signOut')
    }
    Router.push('/')
}
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;
    useEffect(() => {
        authChannel = new BroadcastChannel('auth')
        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut();
                    authChannel.close()
                    break;
                default:
                    break;
            }
        }
    }, [])
    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()
        if (token) {
            api.get<MeResponse>('/me').then((response) => {
                const { email, permissions, roles } = response?.data
                setUser({ email, permissions, roles })
            }).catch(error => {
                signOut()
            })
        }
    }, [])
    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post<SessionsResponse>('sessions', { email, password })
            const { token, refreshToken, permissions, roles } = response?.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,// 30 dias //Quanto tempo mantem o cookie salvo no navegador
                path: '/' // a barra deixa de forma global // Quais caminhos da app vão ter acesso a esse cookie
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,// 30 dias //Quanto tempo mantem o cookie salvo no navegador
                path: '/' // a barra deixa de forma global // Quais caminhos da app vão ter acesso a esse cookie
            })

            setUser({
                email, permissions, roles
            })
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push('/dashboard')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )

}