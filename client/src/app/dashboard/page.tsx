import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  console.log('cookieStore', cookieStore.getAll())

  console.log('session is', session)

  return <div>Dashboard</div>
}
