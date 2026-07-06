import cardIcon from '../icons/card.svg?raw'
import settingsIcon from '../icons/settings.svg?raw'
import searchIcon from '../icons/search.svg?raw'
import stateIcon from '../icons/state.svg?raw'
import uploadIcon from '../icons/upload.svg?raw'
import rightIcon from '../icons/right.svg?raw'
import chestIcon from '../icons/chest.svg?raw'
import closeIcon from '../icons/close.svg?raw'
import updateIcon from '../icons/update.svg?raw'
import heartIcon from '../icons/heart.svg?raw'
import downloadIcon from '../icons/download.svg?raw'
import listIcon from '../icons/list.svg?raw'

// 内置图标注册表
const icons: Record<string, string> = {
  card: cardIcon,
  settings: settingsIcon,
  search: searchIcon,
  state: stateIcon,
  upload: uploadIcon,
  right: rightIcon,
  chest: chestIcon,
  close: closeIcon,
  update: updateIcon,
  heart: heartIcon,
  download: downloadIcon,
  list: listIcon,
}

export type BuiltInIcon = keyof typeof icons

export function useIcon() {
  function getIconSvg(name: string): string | null {
    return icons[name] ?? null
  }

  function isBuiltInIcon(name: string): name is BuiltInIcon {
    return name in icons
  }

  return { icons, getIconSvg, isBuiltInIcon }
}
