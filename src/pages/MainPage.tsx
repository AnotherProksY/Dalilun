import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import { Container } from '@/components/UI/Container/Container'
import { HeroBlock } from '@/components/HeroBlock/HeroBlock'
import { WeHelpBlock } from '@/components/WeHelpBlock/WeHelpBlock'
import { ImmersivePilgrimageBlock } from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock'
import { SimpleCtaBlock } from '@/components/SimpleCtaBlock/SimpleCtaBlock'
import { ContactFormBlock } from '@/components/ContactFormBlock/ContactFormBlock'

export function MainPage() {
  return (
    <MainLayout>
      <Container>
        <HeroBlock />
        <WeHelpBlock />
      </Container>
      <SimpleCtaBlock />
      <Container>
        <ImmersivePilgrimageBlock />
        <ContactFormBlock />
      </Container>
    </MainLayout>
  )
}
