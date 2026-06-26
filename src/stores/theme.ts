import { ref } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'dark' | 'light' | 'book'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark')

  function set(next: Theme) {
    theme.value = next
    apply()
  }

  function cycle() {
    const order: Theme[] = ['dark', 'light', 'book']
    const idx = order.indexOf(theme.value)
    set(order[(idx + 1) % order.length])
  }

  function apply() {
    const root = document.documentElement
    root.classList.remove('theme-light', 'theme-book', 'dark')
    if (theme.value === 'light') root.classList.add('theme-light', 'dark')
    else if (theme.value === 'book') root.classList.add('theme-book', 'dark')
    else root.classList.add('dark')
    localStorage.setItem('af-theme', theme.value)
  }

  function init() {
    const saved = localStorage.getItem('af-theme') as Theme | null
    if (saved && ['dark', 'light', 'book'].includes(saved)) {
      theme.value = saved
    }
    apply()
  }

  return { theme, set, cycle, apply, init }
})
