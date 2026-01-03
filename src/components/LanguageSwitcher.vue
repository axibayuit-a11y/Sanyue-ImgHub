<template>
  <el-dropdown @command="changeLanguage" trigger="click">
    <span class="language-trigger">
      <font-awesome-icon icon="globe" class="language-icon"/>
      <span class="language-text">{{ currentLanguageLabel }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="lang in languages" 
          :key="lang.value" 
          :command="lang.value"
          :class="{ 'is-active': currentLocale === lang.value }"
        >
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import i18n from '@/locales'

export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      languages: [
        { value: 'zh-CN', label: '简体中文' },
        { value: 'zh-TW', label: '繁體中文' },
        { value: 'en', label: 'English' },
        { value: 'ja', label: '日本語' },
      ]
    }
  },
  computed: {
    currentLocale() {
      return i18n.global.locale
    },
    currentLanguageLabel() {
      const lang = this.languages.find(l => l.value === this.currentLocale)
      return lang ? lang.label : '简体中文'
    }
  },
  methods: {
    changeLanguage(lang) {
      i18n.global.locale = lang
      localStorage.setItem('locale', lang)
    }
  }
}
</script>

<style scoped>
.language-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: var(--el-text-color-primary);
}

.language-trigger:hover {
  background-color: var(--el-fill-color-light);
}

.language-icon {
  font-size: 16px;
}

.language-text {
  font-size: 13px;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}

/* 移动端隐藏文字 */
@media (max-width: 600px) {
  .language-text {
    display: none;
  }
  .language-trigger {
    padding: 6px;
  }
}
</style>
