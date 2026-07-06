import { ref } from 'vue'

const enabled = ref(true)

export function useSound() {
  function play(src: string) {
    if (!enabled.value) return
    const audio = new Audio(src)
    audio.play().catch(() => {})
  }

  function setEnabled(val: boolean) {
    enabled.value = val
  }

  return { play, enabled, setEnabled }
}
