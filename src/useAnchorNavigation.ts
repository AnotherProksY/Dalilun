import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { scrollToAnchor } from '@/scrollToAnchor'
import { ROUTES } from '@/routes'

export function useAnchorNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (anchorId: string) => {
      if (location.pathname === ROUTES.home) {
        scrollToAnchor(anchorId)
        return
      }
      navigate(ROUTES.home, { state: { anchorId } })
    },
    [location.pathname, navigate],
  )
}
