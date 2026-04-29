interface IconProps {
  id: string
  width: number
  height: number
  viewBox?: string
  className?: string
}

export function Icon({ id, width, height, viewBox, className }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}
