import type { MouseEventHandler, ReactNode } from 'react'
import styles from '@/components/UI/CtaButton/CtaButton.module.scss'

interface CtaButtonBaseProps {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
}

interface CtaButtonAsButton extends CtaButtonBaseProps {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

interface CtaButtonAsLink extends CtaButtonBaseProps {
  href: string
  type?: never
  disabled?: never
}

type CtaButtonProps = CtaButtonAsButton | CtaButtonAsLink

export function CtaButton({
  children,
  className,
  href,
  onClick,
  type = 'button',
  disabled,
}: CtaButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(' ')

  if (href !== undefined) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
