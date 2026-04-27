import styles from '@/components/UI/CtaButton/CtaButton.module.scss'

interface CtaButtonBaseProps {
  children: React.ReactNode
  className?: string
}

interface CtaButtonAsButton extends CtaButtonBaseProps {
  href?: undefined
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

interface CtaButtonAsLink extends CtaButtonBaseProps {
  href: string
  onClick?: never
  type?: never
  disabled?: never
}

type CtaButtonProps = CtaButtonAsButton | CtaButtonAsLink

export function CtaButton({ children, className, href, onClick, type = 'button', disabled }: CtaButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(' ')

  if (href !== undefined) {
    return (
      <a href={href} className={cls}>
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
