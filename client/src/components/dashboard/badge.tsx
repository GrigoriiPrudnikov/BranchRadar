type ColorType = 'gray' | 'green' | 'yellow' | 'blue'

interface Props {
  text: string
  color: ColorType
}

const styles: Record<ColorType, string> = {
  gray: 'text-gray-500 bg-gray-500/10 border-gray-500/50',
  green: 'text-green-500 bg-green-500/10 border-green-500/50',
  yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/50',
}

export function Badge({ text, color }: Props) {
  return (
    <div className={'w-fit border rounded-full px-2 py-0.5 ' + styles[color]}>
      {text}
    </div>
  )
}
