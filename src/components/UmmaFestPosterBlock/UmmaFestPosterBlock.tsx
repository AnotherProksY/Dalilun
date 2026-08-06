import { useTranslation } from 'react-i18next'
import { Container } from '@/components/UI/Container/Container'
import { Icon } from '@/components/UI/Icon/Icon'
import styles from '@/components/UmmaFestPosterBlock/UmmaFestPosterBlock.module.scss'

export function UmmaFestPosterBlock() {
  const { t } = useTranslation()
  const title = t('ummaFest.title')
  const projects = t('ummaFest.projects', { returnObjects: true }) as string[]

  return (
    <section className={styles.section} aria-label='UMMA Fest 2026'>
      <div className={styles.bg} aria-hidden='true' />
      <div className={styles.circleGlow} aria-hidden='true' />

      <Container className={styles.container}>
        <div className={styles.lantern} aria-hidden='true'>
          <img
            className={styles.lanternImage}
            src='/umma-fest-lantern-glow.png'
            alt=''
            width={1461}
            height={1998}
          />
        </div>
        <div className={styles.logos}>
          <img
            className={styles.dalilunLogo}
            src='/dalilun-logo-umma.svg'
            alt='Dalilun'
            width={186}
            height={59}
          />
          <img
            className={styles.ummaLogo}
            src='/umma-fest-partner-logo.png'
            alt='UMMA Fest'
            width={133}
            height={73}
          />
        </div>

        <h2 className={styles.title}>
          {title.split('\n').map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <Icon
              id='calendar-dots'
              width={37}
              height={37}
              viewBox='0 0 37 37'
              className={styles.infoIcon}
            />
            <div className={styles.infoText}>
              <p className={styles.infoPrimary}>{t('ummaFest.date')}</p>
              <p className={styles.infoSecondary}>{t('ummaFest.time')}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Icon
              id='map-pin'
              width={37}
              height={37}
              viewBox='0 0 37 37'
              className={styles.infoIcon}
            />
            <div className={styles.infoText}>
              <p className={styles.infoPrimary}>{t('ummaFest.location')}</p>
              <p className={styles.infoSecondary}>{t('ummaFest.address')}</p>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.cardText}>{t('ummaFest.description')}</p>
            <div className={styles.tags}>
              {projects.map((project) => (
                <span key={project} className={styles.tag}>
                  {project}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.card} ${styles.partnerCard}`}>
            <img
              className={styles.partnerIcon}
              src='/umma-fest-expert-icon.svg'
              alt=''
              width={124}
              height={103}
              aria-hidden='true'
            />
            <div className={styles.partnerText}>
              <p className={styles.partnerLabel}>{t('ummaFest.partnerLabel')}</p>
              <p className={styles.cardText}>{t('ummaFest.partnerText')}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
