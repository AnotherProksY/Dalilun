import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import { Container } from '@/components/UI/Container/Container'
import { HeroBlock } from '@/components/HeroBlock/HeroBlock'
import { WeHelpBlock } from '@/components/WeHelpBlock/WeHelpBlock'
import { JourneyBlock } from '@/components/JourneyBlock/JourneyBlock'
import { ImmersivePilgrimageBlock } from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock'
import { SimpleCtaBlock } from '@/components/SimpleCtaBlock/SimpleCtaBlock'
import { UmmaQuestBlock } from '@/components/UmmaQuestBlock/UmmaQuestBlock'
import { ContactFormBlock } from '@/components/ContactFormBlock/ContactFormBlock'
import { UmmaFestPosterBlock } from '@/components/UmmaFestPosterBlock/UmmaFestPosterBlock'

const SHOW_UMMA_FEST_BANNER = false

export function MainPage() {
  return (
    <MainLayout>
      <Container>
        <HeroBlock />
      </Container>
      {SHOW_UMMA_FEST_BANNER && <UmmaFestPosterBlock />}
      <Container>
        <WeHelpBlock />
      </Container>
      <JourneyBlock />
      <SimpleCtaBlock />
      <UmmaQuestBlock />
      <Container>
        <ImmersivePilgrimageBlock />
        <ContactFormBlock />
      </Container>
    </MainLayout>
  )
}
