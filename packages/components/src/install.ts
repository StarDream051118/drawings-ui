import type { App } from 'vue'
import { DwButton } from './button'
import { DwInput } from './input'
import { DwTabs, DwTabButton } from './tabs'
import { DwTooltip } from './tooltip'
import {
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
} from './tab-strip'

const components = [
  DwButton,
  DwInput,
  DwTabs,
  DwTabButton,
  DwTooltip,
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
]

function install(app: App) {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
}

export default { install }
export { install }
