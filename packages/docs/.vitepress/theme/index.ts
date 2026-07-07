import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import '@drawings-ui/components/styles/index.scss'
import ButtonBasic from './demos/ButtonBasic.vue'
import ButtonSize from './demos/ButtonSize.vue'
import ButtonActive from './demos/ButtonActive.vue'
import ButtonDisabled from './demos/ButtonDisabled.vue'
import ButtonIcon from './demos/ButtonIcon.vue'
import ButtonCustom from './demos/ButtonCustom.vue'
import ButtonIconColor from './demos/ButtonIconColor.vue'
import ButtonBgColor from './demos/ButtonBgColor.vue'
import ButtonBgColorChange from './demos/ButtonBgColorChange.vue'
import ButtonSound from './demos/ButtonSound.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('button-demos-basic', ButtonBasic)
    app.component('button-demos-size', ButtonSize)
    app.component('button-demos-active', ButtonActive)
    app.component('button-demos-disabled', ButtonDisabled)
    app.component('button-demos-icon', ButtonIcon)
    app.component('button-demos-icon-color', ButtonIconColor)
    app.component('button-demos-custom', ButtonCustom)
    app.component('button-demos-bg-color', ButtonBgColor)
    app.component('button-demos-bg-color-change', ButtonBgColorChange)
    app.component('button-demos-sound', ButtonSound)
  },
}
