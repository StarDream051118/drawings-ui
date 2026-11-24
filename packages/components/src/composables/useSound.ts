import { ref } from 'vue'
import { SOUNDS } from '../utils/sounds'

const enabled = ref(true)

export function useSound() {
  function play(src: string) {
    if (!enabled.value) return
    const audio = new Audio(src)
    audio.play().catch(() => {})
  }

  /** 统一处理点击音效：pointerdown 对右键/中键也会触发，这里只响应主键（左键/触摸） */
  function playClick(event?: PointerEvent) {
    if (event && event.button !== 0) return
    play(SOUNDS.click)
  }

  function setEnabled(val: boolean) {
    enabled.value = val
  }

  return { play, playClick, enabled, setEnabled }
}
