import { Card, Checkbox } from '../ui'
import { Badge } from '.'

export type BranchStatus = 'merged' | 'open_pr' | 'no_pr'

export interface Branch {
  name: string
  repository: string
  description: string
  author: string
  status: BranchStatus
  lastActivity: string
}

export const fakeBranches: Branch[] = [
  {
    name: 'feature/legacy-checkout-flow',
    repository: 'acme/storefront',
    description: 'Fix coupon rounding on cart total',
    author: 'Dana Whitfield',
    status: 'merged',
    lastActivity: '1y 1mo ago',
  },
  {
    name: 'fix/ie11-polyfill-hotfix',
    repository: 'acme/storefront',
    description: 'Add Array.from polyfill for IE11',
    author: 'Marcus Lee',
    status: 'merged',
    lastActivity: '9mo ago',
  },
  {
    name: 'experiment/three-column-dashboard',
    repository: 'acme/web-app',
    description: 'Try masonry layout for widgets',
    author: 'Priya Nandakumar',
    status: 'no_pr',
    lastActivity: '7mo ago',
  },
  {
    name: 'chore/bump-node-16',
    repository: 'acme/api',
    description: 'Upgrade CI image to node 16',
    author: 'Dana Whitfield',
    status: 'open_pr',
    lastActivity: '6mo ago',
  },
  {
    name: 'feature/notification-center-v1',
    repository: 'acme/web-app',
    description: 'Wire websocket toast events',
    author: 'Sofia Ramirez',
    status: 'no_pr',
    lastActivity: '5mo ago',
  },
  {
    name: 'spike/graphql-federation',
    repository: 'acme/api',
    description: 'Prototype subgraph stitching',
    author: 'Marcus Lee',
    status: 'no_pr',
    lastActivity: '4mo ago',
  },
  {
    name: 'fix/flaky-auth-test',
    repository: 'acme/api',
    description: 'Increase timeout for token refresh test',
    author: 'Priya Nandakumar',
    status: 'merged',
    lastActivity: '3mo ago',
  },
  {
    name: 'feature/dark-mode-tokens',
    repository: 'acme/web-app',
    description: 'Map semantic tokens to CSS vars',
    author: 'Sofia Ramirez',
    status: 'open_pr',
    lastActivity: '3mo ago',
  },
]

export function BranchesTableSection() {
  return (
    <Card className='p-0 gap-0'>
      {fakeBranches.map((branch, idx) => (
        <BranchesTableItem key={idx} branch={branch} idx={idx} />
      ))}
    </Card>
  )
}

interface ItemProps {
  branch: Branch
  idx: number
}

function BranchesTableItem({ branch, idx }: ItemProps) {
  const { name, repository, description, author, status, lastActivity } = branch

  // add whole line highlight when selected

  return (
    <div className={`${idx != 0 && 'border-t'} h-16 px-4 flex items-center`}>
      <div className='flex gap-4 items-center w-2/5'>
        <Checkbox className='h-5 w-5' />
        <div>
          <p className='text-md'>{name}</p>
          <p className='text-xs text-muted-foreground'>
            {repository} · {description}
          </p>
        </div>
      </div>
      <div className='w-1/5'>{author}</div>
      <div className='w-1/5' />
      <div className='w-1/10'>
        <Badge text={status} color='blue' />
      </div>
      <div className='w-1/10'>
        <Badge text={lastActivity} color='yellow' />
      </div>
    </div>
  )
}
