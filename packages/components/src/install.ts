import type { App } from 'vue'
import { DwButton } from './button'

const components = [DwButton]

function install(app: App) {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
}

export default { install }
export { install }
