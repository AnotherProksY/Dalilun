interface IconProps {
  id: string
  width: number
  height: number
  className?: string
}

export function Icon({ id, width, height, className }: IconProps) {
  return (
    <svg width={width} height={height} className={className}>
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}
