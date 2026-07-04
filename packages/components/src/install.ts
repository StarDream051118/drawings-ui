import type { App } from 'vue'
import { UiButton } from './button'

const components = [UiButton]

function install(app: App) {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
}

export default { install }
export { install }
