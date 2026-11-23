import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import '@star-dream051118/drawings-ui/styles/base.scss'
import '@star-dream051118/drawings-ui/styles/font.scss'
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
import InputBasic from './demos/InputBasic.vue'
import TabsBasic from './demos/TabsBasic.vue'
import TabsActiveEffect from './demos/TabsActiveEffect.vue'
import TabsSize from './demos/TabsSize.vue'
import TabsWidthMode from './demos/TabsWidthMode.vue'
import TabsFill from './demos/TabsFill.vue'
import TabsDisabled from './demos/TabsDisabled.vue'
import TabsSound from './demos/TabsSound.vue'
import TabsActiveLine from './demos/TabsActiveLine.vue'
import TabStripBasic from './demos/TabStripBasic.vue'
import TabStripShowcase from './demos/TabStripShowcase.vue'
import TabStripBackground from './demos/TabStripBackground.vue'
import TabStripGroupBasic from './demos/TabStripGroupBasic.vue'
import TabStripFooter from './demos/TabStripFooter.vue'
import TabStripDisabled from './demos/TabStripDisabled.vue'

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
    app.component('input-demos-basic', InputBasic)
    app.component('tabs-demos-basic', TabsBasic)
    app.component('tabs-demos-active-effect', TabsActiveEffect)
    app.component('tabs-demos-size', TabsSize)
    app.component('tabs-demos-width-mode', TabsWidthMode)
    app.component('tabs-demos-fill', TabsFill)
    app.component('tabs-demos-disabled', TabsDisabled)
    app.component('tabs-demos-sound', TabsSound)
    app.component('tabs-demos-active-line', TabsActiveLine)
    app.component('tab-strip-demos-basic', TabStripBasic)
    app.component('tab-strip-demos-showcase', TabStripShowcase)
    app.component('tab-strip-demos-background', TabStripBackground)
    app.component('tab-strip-demos-group', TabStripGroupBasic)
    app.component('tab-strip-demos-footer', TabStripFooter)
    app.component('tab-strip-demos-disabled', TabStripDisabled)
  },
}
