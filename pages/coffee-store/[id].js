import Link from 'next/link'
import { useRouter } from 'next/router'

const CoffeeStore = () => {
  const route = useRouter()
  console.log('route', route)
  return (
    <div>
      Coffee Store Page {route.query.id}
      <Link href='/'>
        <a>Back to Home</a>
      </Link>
      <Link href='/coffee-store/dynamic'>
        <a>Go to dynamic page</a>
      </Link>
    </div>
  )
}

export default CoffeeStore
