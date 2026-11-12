<script lang="ts">
import {
  Comment,
  Fragment,
  Text,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  shallowRef,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import DwTabButton from './TabButton.vue'
import { TABS_CONTEXT, type TabActiveEffect, type TabInstance, type TabSize, type TabType, type TabWidthMode, type TabsDefaults } from './context'

export default defineComponent({
  name: 'DwTabs',

  props: {
    /** 当前选中项索引，配合 v-model 使用 */
    modelValue: { type: Number, default: 0 },
    /** 以下视觉属性作为整条标签栏的默认值，可被单个 DwTabButton 覆盖 */
    type: { type: String as PropType<TabType>, default: 'default' },
    size: { type: [String, Number] as PropType<TabSize>, default: 'default' },
    disabled: { type: Boolean, default: false },
    sound: { type: Boolean, default: true },
    icon: { type: String, default: undefined },
    iconColor: { type: String, default: undefined },
    bgColor: { type: String, default: undefined },
    color: { type: String, default: undefined },
    /** 选中视觉：border 只高亮描边（默认），pressed 借用禁用态的深底 + 去投影 */
    activeEffect: { type: String as PropType<TabActiveEffect>, default: 'border' },
    /** 自适应宽度下：auto 各自按内容撑开，equal 以最宽标签为准 */
    widthMode: { type: String as PropType<TabWidthMode>, default: 'auto' },
  },

  emits: {
    'update:modelValue': (value: number) => typeof value === 'number',
    change: (value: number) => typeof value === 'number',
  },

  setup(props, { slots, emit }) {
    const listRef = ref<HTMLElement | null>(null)
    const activeIndex = ref(props.modelValue)
    const order = shallowRef<TabInstance[]>([])
    let warned = false

    function register(tab: TabInstance) {
      order.value = [...order.value, tab]
    }

    function unregister(tab: TabInstance) {
      order.value = order.value.filter(item => item !== tab)
    }

    function select(index: number) {
      if (props.disabled) return
      if (index < 0 || index === activeIndex.value) return
      activeIndex.value = index
      emit('update:modelValue', index)
      emit('change', index)
    }

    provide(TABS_CONTEXT, {
      activeIndex,
      order,
      defaults: props as unknown as TabsDefaults,
      register,
      unregister,
      select,
    })

    watch(() => props.modelValue, (value) => {
      activeIndex.value = value
    })

    // 子元素增删后把越界的选中项收回
    watch(() => order.value.length, (length) => {
      if (length > 0 && activeIndex.value > length - 1) {
        activeIndex.value = length - 1
        emit('update:modelValue', length - 1)
        emit('change', length - 1)
      }
    })

    // 等宽模式：量出最宽的那个标签，让所有标签统一宽度
    function syncEqualWidth() {
      const el = listRef.value
      if (!el) return

      el.style.removeProperty('--dw-tab-width')

      // 只有「自适应 + 等宽」才需要测量；其它 size 已经有固定宽度
      if (props.widthMode !== 'equal' || props.size !== 'default') return

      let max = 0
      el.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
        max = Math.max(max, tab.getBoundingClientRect().width)
      })

      if (max > 0) {
        el.style.setProperty('--dw-tab-width', `${Math.ceil(max)}px`)
      }
    }

    onMounted(() => {
      syncEqualWidth()
      window.addEventListener('resize', syncEqualWidth)
      // 像素字体加载完之前量出来的是回退字体宽度，加载完再量一次
      document.fonts?.ready.then(() => syncEqualWidth()).catch(() => {})
    })

    // 标签增删、文字变化都会走到这里
    onUpdated(syncEqualWidth)

    onBeforeUnmount(() => {
      window.removeEventListener('resize', syncEqualWidth)
    })

    watch(() => [props.widthMode, props.size], () => {
      nextTick(syncEqualWidth)
    })

    function focusTab(index: number) {
      const tabs = listRef.value?.querySelectorAll<HTMLElement>('[role="tab"]')
      tabs?.[index]?.focus()
    }

    function onKeydown(event: KeyboardEvent) {
      if (props.disabled) return

      const length = order.value.length
      if (length === 0) return

      const last = length - 1
      let next = activeIndex.value

      switch (event.key) {
        case 'ArrowRight':
          next = activeIndex.value >= last ? 0 : activeIndex.value + 1
          break
        case 'ArrowLeft':
          next = activeIndex.value <= 0 ? last : activeIndex.value - 1
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = last
          break
        default:
          return
      }

      event.preventDefault()
      if (next !== activeIndex.value) select(next)
      focusTab(next)
    }

    // 收集插槽节点：展开 Fragment，丢掉注释和空白文本
    function collect(nodes: VNode[], out: VNode[]) {
      for (const node of nodes) {
        if (node.type === Fragment) {
          collect(node.children as VNode[], out)
        } else if (node.type === Comment) {
          continue
        } else if (node.type === Text && !String(node.children ?? '').trim()) {
          continue
        } else {
          out.push(node)
        }
      }
    }

    // 只渲染 DwTabButton；混入其它标签时给出警告并整体不渲染
    return () => {
      const children: VNode[] = []
      collect(slots.default?.() ?? [], children)

      if (children.some(node => node.type !== DwTabButton)) {
        if (!warned) {
          warned = true
          console.warn('[DrawingsUI] DwTabs 的子元素只能是 DwTabButton，检测到其它标签，DwTabs 已停止渲染。')
        }
        return null
      }

      warned = false

      return h('div', {
        ref: listRef,
        class: ['dw-tabs', props.widthMode === 'equal' && props.size === 'default' && 'dw-tabs--equal'],
        role: 'tablist',
        'aria-orientation': 'horizontal',
        onKeydown,
      }, children)
    }
  },
})
</script>

<style src="./tabs.scss" />
