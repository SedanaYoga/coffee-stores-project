import { useRouter } from 'next/router'
import Head from 'next/head'

const DynamicRoute = () => {
  const route = useRouter()
  const query = route.query.dynamic_route
  return (
    <div>
      <Head>
        <title>{query}</title>
      </Head>
      Page {query}
    </div>
  )
}

export default DynamicRoute
