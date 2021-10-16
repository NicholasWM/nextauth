import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions";

type UseCamParams = {
    permissions?: string[],
    roles?: string[]
}

export function useCan({permissions, roles}: UseCamParams){
    const {isAuthenticated, user} = useContext(AuthContext)
    console.log(permissions, roles);
    console.log(user?.permissions);
    if(!isAuthenticated){
        return false
    }
    const userHasValidPermissions = validateUserPermissions({user, permissions, roles})
  
    return userHasValidPermissions
}