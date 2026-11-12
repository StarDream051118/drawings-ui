import type { App } from 'vue'
import { DwButton } from './button'
import { DwTabs, DwTabButton } from './tabs'

const components = [DwButton, DwTabs, DwTabButton]

function install(app: App) {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
}

export default { install }
export { install }
