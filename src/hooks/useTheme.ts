import { useEffect } from 'react'
import { useSettingsStore } from '../state/useSettingsStore'

/**
 * Apply the user's chosen theme to documentElement.
 * "auto" follows the system preference and updates live.
 */
export function useTheme() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    function apply(light: boolean) {
      if (light) root.setAttribute('data-theme', 'light')
      else root.removeAttribute('data-theme')
    }

    if (theme === 'light') {
      apply(true)
      return
    }
    if (theme === 'dark') {
      apply(false)
      return
    }
    // auto
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    apply(mq.matches)
    const onChange = (e: MediaQueryListEvent) => apply(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])
}
