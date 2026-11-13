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
    /** 标签均分整条栏宽度（flex: 1），用于铺满父容器 */
    fill: { type: Boolean, default: false },
  },

  emits: {
    'update:modelValue': (value: number) => typeof value === 'number',
    change: (value: number) => typeof value === 'number',
  },

  setup(props, { slots, emit }) {
    const listRef = ref<HTMLElement | null>(null)
    const activeIndex = ref(Math.max(props.modelValue, 0))
    const order = shallowRef<TabInstance[]>([])
    let warned = false
    let observer: IntersectionObserver | null = null

    function register(tab: TabInstance) {
      order.value = [...order.value, tab]
    }

    function unregister(tab: TabInstance) {
      order.value = order.value.filter(item => item !== tab)
    }

    function clampIndex(value: number) {
      const next = Math.max(0, value)
      const max = order.value.length - 1
      return max >= 0 ? Math.min(next, max) : next
    }

    function select(index: number) {
      if (props.disabled) return
      const tab = order.value[index]
      if (!tab || tab.disabled.value || index === activeIndex.value) return
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
      activeIndex.value = clampIndex(value)
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

      const needed = props.widthMode === 'equal' && props.size === 'default' && !props.fill

      // auto 模式不测量；只有之前设过变量时才清理一次
      if (!needed) {
        if (el.style.getPropertyValue('--dw-tab-width')) el.style.removeProperty('--dw-tab-width')
        return
      }

      // 先撤掉统一宽度，量到的才是各标签自己的内容宽度
      el.style.removeProperty('--dw-tab-width')

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

      // 容器从不可见变为可见时补测一次（这种情况不会有 window resize）
      if (typeof IntersectionObserver !== 'undefined' && listRef.value) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some(entry => entry.isIntersecting)) syncEqualWidth()
        })
        observer.observe(listRef.value)
      }
    })

    // 标签增删、文字变化都会走到这里
    onUpdated(syncEqualWidth)

    onBeforeUnmount(() => {
      window.removeEventListener('resize', syncEqualWidth)
      observer?.disconnect()
    })

    watch(() => [props.widthMode, props.size], () => {
      nextTick(syncEqualWidth)
    })

    function focusTab(index: number) {
      order.value[index]?.el.value?.focus()
    }

    function enabledIndexes() {
      const list: number[] = []
      order.value.forEach((tab, index) => {
        if (!tab.disabled.value) list.push(index)
      })
      return list
    }

    function onKeydown(event: KeyboardEvent) {
      if (props.disabled) return

      // 方向键和 Home/End 只在可选标签之间移动，跳过禁用项
      const enabled = enabledIndexes()
      if (enabled.length === 0) return

      const current = enabled.indexOf(activeIndex.value)
      let target: number

      switch (event.key) {
        case 'ArrowRight':
          target = current === -1 ? enabled[0] : enabled[(current + 1) % enabled.length]
          break
        case 'ArrowLeft':
          target = current === -1
            ? enabled[enabled.length - 1]
            : enabled[(current - 1 + enabled.length) % enabled.length]
          break
        case 'Home':
          target = enabled[0]
          break
        case 'End':
          target = enabled[enabled.length - 1]
          break
        default:
          return
      }

      event.preventDefault()
      if (target !== activeIndex.value) select(target)
      focusTab(target)
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
        class: [
          'dw-tabs',
          props.fill && 'dw-tabs--fill',
          !props.fill && props.widthMode === 'equal' && props.size === 'default' && 'dw-tabs--equal',
        ],
        role: 'tablist',
        'aria-orientation': 'horizontal',
        onKeydown,
      }, children)
    }
  },
})
</script>

<style src="./tabs.scss" />
