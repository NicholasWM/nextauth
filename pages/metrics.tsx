import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
export default function Metrics() {
    return (
        <>
            <h1>Metrics</h1>
        </>
    )
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me')
    return {
        props: {}
    }
},{
    permissions:['metrics.list1212321'], // Quais permissões o user tem que ter para acessar a tela
    roles: ['administrator']
})
