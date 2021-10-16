import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

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

    if(permissions?.length > 0){
        const hasAllPermissions = permissions.some(permission => {
            return user.permissions.includes(permission)
        });
        
        if(!hasAllPermissions){
            return false
        }
    }

    if(roles?.length > 0){
        const hasAllRoles = roles.some(role => {
            return user.roles.includes(role)
        });
        if(!hasAllRoles){
            return false
        }
    }
    return true
}