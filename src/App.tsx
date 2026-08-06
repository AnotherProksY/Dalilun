import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MainPage } from '@/pages/MainPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { CookiePolicyPage } from '@/pages/CookiePolicyPage'
import { PersonalDataConsentPage } from '@/pages/PersonalDataConsentPage'
import { ROUTES } from '@/routes'
import { scrollToAnchor } from '@/scrollToAnchor'

function App() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === ROUTES.home

  useEffect(() => {
    if (isHome) {
      document.title = t('pageTitle')
    }
  }, [t, i18n.language, isHome])

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  useEffect(() => {
    if (location.pathname !== ROUTES.home) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== ROUTES.home) return
    const anchorId = (location.state as { anchorId?: string } | null)?.anchorId
    if (!anchorId) return

    const frame = requestAnimationFrame(() => {
      scrollToAnchor(anchorId)
      navigate(ROUTES.home, { replace: true, state: null })
    })

    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.state, navigate])

  return (
    <Routes>
      <Route path={ROUTES.home} element={<MainPage />} />
      <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicyPage />} />
      <Route path={ROUTES.cookiePolicy} element={<CookiePolicyPage />} />
      <Route
        path={ROUTES.personalDataConsent}
        element={<PersonalDataConsentPage />}
      />
      <Route path='*' element={<MainPage />} />
    </Routes>
  )
}

export default App
