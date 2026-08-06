import { Card } from '../ui'

interface Props {
  title: string
  value: number
  description: string
  styles?: string
}

export function StatCard({ title, value, description, styles }: Props) {
  return (
    <Card className={`w-full justify-between px-4 ` + styles}>
      <p className='text-neutral-500'>{title}</p>
      <p className='text-black font-bold text-3xl'>{value}</p>
      <p className='text-neutral-500'>{description}</p>
    </Card>
  )
}
