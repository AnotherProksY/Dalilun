import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MainPage } from '@/pages/MainPage'

function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('pageTitle')
  }, [t, i18n.language])

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <Routes>
      <Route path='*' element={<MainPage />} />
    </Routes>
  )
}

export default App
