'use client'

export function BranchesFilter() {
  return (
    <div className='flex gap-4'>
      <BranchesFilterButton text='All' active={true} onClick={() => {}} />
      <BranchesFilterButton text='Stale' active={false} onClick={() => {}} />
      <BranchesFilterButton text='Merged' active={false} onClick={() => {}} />
    </div>
  )
}

interface ButtonProps {
  text: string
  active: boolean
  onClick: () => void
}

function BranchesFilterButton({ text, active, onClick }: ButtonProps) {
  return (
    <button
      className={(active ? 'text-black' : 'text-neutral-400') + ''}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
