import {createContext, ReactNode} from 'react'

type AuthContextData = {
    signIn(credentials:SignInCredentials): Promise<void>,
    isAuthenticated: boolean
}
type SignInCredentials = {
    email: string,
    password: string,
}

type AuthProviderProps = {
    children: ReactNode // Quando o componente pode receber qualquer outra coisa dentro dele
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps){
    const isAuthenticated = false;

    async function signIn({email, password}: SignInCredentials){
        console.log({email, password})
    }
    
    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}