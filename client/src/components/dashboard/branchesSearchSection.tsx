import { BranchesFilter } from '.'
import {
  Card,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui'

interface Props {
  selectedBranches?: 'all' | 'stale' | 'closed'
  selectedRepo?: string
}

export function BranchesSearchSection({
  selectedBranches,
  selectedRepo,
}: Props) {
  const items = [
    {
      label: 'All repos',
      value: 'all',
    },
    {
      label: 'Repo 1',
      value: 'repo1',
    },
    {
      label: 'Repo 2',
      value: 'repo2',
    },
    {
      label: 'Repo 3',
      value: 'repo3',
    },
  ]

  return (
    <Card className='h-16 flex-row justify-between items-center px-4'>
      <div className='flex gap-4'>
        <Input placeholder='Search for branches' />
        <Select items={items} defaultValue={items[0].value}>
          <SelectTrigger className='w-45'>
            <SelectValue placeholder='Select a repo' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <BranchesFilter />
    </Card>
  )
}
