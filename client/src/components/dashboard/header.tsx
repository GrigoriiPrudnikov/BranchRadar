import { GitBranch } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className='w-full h-12 flex justify-between items-center'>
      <div className='flex space-x-4'>
        <div className='h-12 w-12 flex justify-center items-center rounded-xl bg-neutral-800'>
          <GitBranch />
        </div>
        <div>
          <p>Branch Radar</p>
          <p className='text-sm text-neutral-400'>
            Sweep away long-unused GitHub branches
          </p>
        </div>
      </div>
      <ConnectionBadge name='GitHub' />
    </header>
  )
}

function ConnectionBadge({ name }: { name: string }) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm font-sans'>
      <span className='w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.9)]' />
      <span className='text-neutral-300'>
        Connected to <span className='text-neutral-100'>{name}</span>
      </span>
    </div>
  )
}
