import { type ReactNode } from 'react'
import { Header } from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'
import styles from '@/layouts/MainLayout/MainLayout.module.scss'

interface Props {
  children: ReactNode
}

export function MainLayout({ children }: Props) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
