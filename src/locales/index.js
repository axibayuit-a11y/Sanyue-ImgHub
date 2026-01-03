import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'
import ja from './ja'
import es from './es'
import hi from './hi'
import arSA from './ar-SA'
import bnBD from './bn-BD'
import csCZ from './cs-CZ'
import deDE from './de-DE'
import frFR from './fr-FR'
import idID from './id-ID'
import itIT from './it-IT'
import koKR from './ko-KR'
import msMY from './ms-MY'
import nlNL from './nl-NL'
import plPL from './pl-PL'
import ptBR from './pt-BR'
import ruRU from './ru-RU'
import thTH from './th-TH'
import trTR from './tr-TR'
import ukUA from './uk-UA'
import viVN from './vi-VN'

// 从 localStorage 获取保存的语言设置
function getSavedLocale() {
  return localStorage.getItem('locale')
}

// 支持的语言列表
const supportedLocales = [
  'zh-CN', 'zh-TW', 'en', 'ja', 'ko-KR',
  'es', 'pt-BR', 'fr-FR', 'de-DE', 'it-IT', 'nl-NL', 'pl-PL', 'cs-CZ', 'uk-UA',
  'ru-RU', 'tr-TR', 'ar-SA', 'hi', 'bn-BD', 'th-TH', 'vi-VN', 'ms-MY', 'id-ID'
]

// 检测浏览器语言
function detectBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  console.log('[i18n] Browser language:', browserLang)
  
  // 繁体中文地区
  if (browserLang.startsWith('zh-TW') || 
      browserLang.startsWith('zh-HK') || 
      browserLang.startsWith('zh-Hant')) {
    return 'zh-TW'
  }
  if (browserLang.startsWith('zh')) return 'zh-CN'
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('ko')) return 'ko-KR'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('pt')) return 'pt-BR'
  if (browserLang.startsWith('fr')) return 'fr-FR'
  if (browserLang.startsWith('de')) return 'de-DE'
  if (browserLang.startsWith('it')) return 'it-IT'
  if (browserLang.startsWith('nl')) return 'nl-NL'
  if (browserLang.startsWith('pl')) return 'pl-PL'
  if (browserLang.startsWith('cs')) return 'cs-CZ'
  if (browserLang.startsWith('uk')) return 'uk-UA'
  if (browserLang.startsWith('ru')) return 'ru-RU'
  if (browserLang.startsWith('tr')) return 'tr-TR'
  if (browserLang.startsWith('ar')) return 'ar-SA'
  if (browserLang.startsWith('hi')) return 'hi'
  if (browserLang.startsWith('bn')) return 'bn-BD'
  if (browserLang.startsWith('th')) return 'th-TH'
  if (browserLang.startsWith('vi')) return 'vi-VN'
  if (browserLang.startsWith('ms')) return 'ms-MY'
  if (browserLang.startsWith('id')) return 'id-ID'
  if (browserLang.startsWith('en')) return 'en'
  return 'zh-CN'
}

// 获取默认语言
function getDefaultLocale() {
  const saved = getSavedLocale()
  console.log('[i18n] Saved locale:', saved)
  if (saved && supportedLocales.includes(saved)) {
    return saved
  }
  const detected = detectBrowserLocale()
  console.log('[i18n] Detected locale:', detected)
  return detected
}

const defaultLocale = getDefaultLocale()
console.log('[i18n] Using locale:', defaultLocale)

const i18n = createI18n({
  legacy: true,
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en': en,
    'ja': ja,
    'ko-KR': koKR,
    'es': es,
    'pt-BR': ptBR,
    'fr-FR': frFR,
    'de-DE': deDE,
    'it-IT': itIT,
    'nl-NL': nlNL,
    'pl-PL': plPL,
    'cs-CZ': csCZ,
    'uk-UA': ukUA,
    'ru-RU': ruRU,
    'tr-TR': trTR,
    'ar-SA': arSA,
    'hi': hi,
    'bn-BD': bnBD,
    'th-TH': thTH,
    'vi-VN': viVN,
    'ms-MY': msMY,
    'id-ID': idID,
  },
})

console.log('[i18n] i18n instance created:', i18n)
console.log('[i18n] Current locale:', i18n.global.locale)

export default i18n
