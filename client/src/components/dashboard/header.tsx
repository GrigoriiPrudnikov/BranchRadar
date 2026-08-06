export function Header() {
  return (
    <header className='w-full h-12 flex justify-between items-center'>
      <div>
        <p>Branch Radar</p>
        <p className='text-sm text-neutral-400'>
          Sweep away long-unused GitHub branches
        </p>
      </div>
      <ConnectionBadge name='GitHub' />
    </header>
  )
}

function ConnectionBadge({ name }: { name: string }) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-sm font-sans'>
      <span className='w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.9)]' />
      <span className='text-green-800'>
        Connected to <strong className='text-green-900'>{name}</strong>
      </span>
    </div>
  )
}
