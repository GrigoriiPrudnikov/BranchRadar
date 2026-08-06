import { StatCard } from './statCard'

export function StatCardsSection() {
  return (
    <section className='flex space-x-4'>
      <StatCard
        key='total-branches'
        value={0}
        title='Total branches'
        description='across all repositories'
      />
      <StatCard
        key='stale-branches'
        value={0}
        title='Stale branches'
        description='no activity in 90+ days'
        styles='border-1 border-yellow-500 bg-yellow-500/10'
      />
      <StatCard
        key='already-merged'
        value={0}
        title='Already merged'
        description='safe to remove'
        styles='border-1 border-green-500 bg-green-500/10'
      />
      <StatCard
        key='selected-to-delete'
        value={0}
        title='Selected to delete'
        description='ready for cleanup'
        styles='border-1 border-red-500 bg-red-500/10'
      />
    </section>
  )
}
