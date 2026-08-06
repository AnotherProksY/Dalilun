import { useEffect } from 'react'
import gsap from 'gsap'
import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import { Container } from '@/components/UI/Container/Container'
import styles from './LegalDocumentPage.module.scss'

interface Props {
  title: string
  paragraphs: readonly string[]
}

function renderParagraph(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)

  return parts.map((part, index) =>
    part.startsWith('http') ? (
      <a key={index} href={part} className={styles.link}>
        {part}
      </a>
    ) : (
      part
    ),
  )
}

function formatTabTitle(title: string): string {
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
}

export function LegalDocumentPage({ title, paragraphs }: Props) {
  useEffect(() => {
    gsap.killTweensOf(window)
    window.scrollTo(0, 0)
    document.title = formatTabTitle(title)
  }, [title])

  return (
    <MainLayout>
      <Container>
        <article className={styles.page}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.content}>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </article>
      </Container>
    </MainLayout>
  )
}
