import {
  BranchesSearchSection,
  BranchesTableSection,
  DeleteSection,
  Header,
} from '@/components/dashboard'
import { StatCardsSection } from '@/components/dashboard/statCardsSection'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  console.log('cookieStore', cookieStore.getAll())

  console.log('session is', session)

  return (
    <main className='space-y-4'>
      <Header />
      <StatCardsSection />
      <BranchesSearchSection />
      <DeleteSection />
      <BranchesTableSection />
    </main>
  )
}
