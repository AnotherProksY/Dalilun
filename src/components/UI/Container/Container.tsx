import { type ReactNode } from 'react'
import styles from '@/components/UI/Container/Container.module.scss'

interface Props {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: Props) {
  return <div className={`${styles.container}${className ? ` ${className}` : ''}`}>{children}</div>
}
