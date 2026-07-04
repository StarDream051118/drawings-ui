import DefaultTheme from 'vitepress/theme'
import ButtonBasic from './demos/ButtonBasic.vue'
import ButtonSize from './demos/ButtonSize.vue'
import ButtonDisabled from './demos/ButtonDisabled.vue'
import ButtonLoading from './demos/ButtonLoading.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('button-demos-basic', ButtonBasic)
    app.component('button-demos-size', ButtonSize)
    app.component('button-demos-disabled', ButtonDisabled)
    app.component('button-demos-loading', ButtonLoading)
  },
}
