import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'
import ja from './ja'

// 从 localStorage 获取保存的语言设置
function getSavedLocale() {
  return localStorage.getItem('locale')
}

// 检测浏览器语言
function detectBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  
  // 繁体中文地区
  if (browserLang.startsWith('zh-TW') || 
      browserLang.startsWith('zh-HK') || 
      browserLang.startsWith('zh-Hant')) {
    return 'zh-TW'
  }
  // 简体中文
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  // 日语
  if (browserLang.startsWith('ja')) {
    return 'ja'
  }
  // 英语
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  // 默认简体中文
  return 'zh-CN'
}

// 获取默认语言
function getDefaultLocale() {
  // 优先使用用户保存的设置
  const saved = getSavedLocale()
  if (saved && ['zh-CN', 'zh-TW', 'en', 'ja'].includes(saved)) {
    return saved
  }
  // 否则检测浏览器语言
  return detectBrowserLocale()
}

// 使用 legacy: true 模式，这样 $t() 在 Options API 组件中可以直接使用
const i18n = createI18n({
  legacy: true,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en': en,
    'ja': ja,
  },
})

export default i18n
