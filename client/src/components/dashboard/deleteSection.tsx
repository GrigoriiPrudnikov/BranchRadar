import { Button, Card, Checkbox } from '../ui'

export function DeleteSection() {
  return (
    <Card className='h-16 flex-row justify-between items-center px-4'>
      <div className='flex gap-4'>
        <Checkbox className='h-5 w-5' />
        <p>12* Branches</p>
      </div>
      <div>select safe to delete</div>
      <div>
        {/* Add confirmation at the same place as button without modals */}
        {/* Also make it disable when no checkboxes are selected */}
        <Button variant='destructive'>Delete selected</Button>
      </div>
    </Card>
  )
}
