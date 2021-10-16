import { ReactNode, useContext } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps{
    children: ReactNode,
    permissions?: string[],
    roles?: string[],
}

export function Can({children,permissions,roles}: CanProps){
    const userCanSeeComponent = useCan({permissions, roles})
    console.log(userCanSeeComponent, permissions);
    
    if(!userCanSeeComponent){
        return null
    }
    return (
        <>
            {children}
        </>
    )
}