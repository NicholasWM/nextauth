import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"

export function withSSRGuest<P>(fn:GetServerSideProps<P>):GetServerSideProps{
    return async(ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx, ctx.req.cookies)  
        if(cookies['nextauth.token']){
          return {
            redirect:{
              destination:'/dashboard',
              permanent:false
            }
          }
        }
        return await fn(ctx)
    }
}