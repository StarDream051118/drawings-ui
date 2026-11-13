<script lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
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
import {
  TABS_CONTEXT,
  type TabActiveEffect,
  type TabInstance,
  type TabKey,
  type TabSize,
  type TabType,
  type TabWidthMode,
  type TabsDefaults,
} from './context'

export default defineComponent({
  name: 'DwTabs',

  props: {
    /** 当前选中标签的 value；标签没写 value 时回退成它的顺序索引 */
    modelValue: { type: [String, Number] as PropType<TabKey>, default: undefined },
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
    'update:modelValue': (value: TabKey) => typeof value === 'string' || typeof value === 'number',
    change: (value: TabKey) => typeof value === 'string' || typeof value === 'number',
  },

  setup(props, { slots, emit }) {
    const listRef = ref<HTMLElement | null>(null)
    const order = shallowRef<TabInstance[]>([])
    const innerKey = ref<TabKey | undefined>(props.modelValue)
    let warned = false
    let duplicateWarned = false
    let observer: IntersectionObserver | null = null

    // 没传 v-model 时默认选中第一个可选标签
    const firstEnabledKey = computed<TabKey | undefined>(
      () => order.value.find(tab => !tab.disabled.value)?.key.value,
    )
    const activeKey = computed<TabKey | undefined>(() => innerKey.value ?? firstEnabledKey.value)
    const hasSelection = computed(() => order.value.some(tab => tab.key.value === activeKey.value))
    const keys = computed(() => order.value.map(tab => tab.key.value))

    function register(tab: TabInstance) {
      order.value = [...order.value, tab]
    }

    function unregister(tab: TabInstance) {
      order.value = order.value.filter(item => item !== tab)
    }

    function select(key: TabKey) {
      if (props.disabled) return
      const tab = order.value.find(item => item.key.value === key)
      if (!tab || tab.disabled.value || key === activeKey.value) return
      innerKey.value = key
      emit('update:modelValue', key)
      emit('change', key)
    }

    provide(TABS_CONTEXT, {
      activeKey,
      hasSelection,
      order,
      defaults: props as unknown as TabsDefaults,
      register,
      unregister,
      select,
    })

    watch(() => props.modelValue, (value) => {
      innerKey.value = value
    })

    // 重复 key 提醒：同名标签只有第一个能被选中
    watch(keys, (list) => {
      const seen = new Set<TabKey>()
      const duplicates: TabKey[] = []

      for (const key of list) {
        if (seen.has(key)) {
          if (!duplicates.includes(key)) duplicates.push(key)
        } else {
          seen.add(key)
        }
      }

      if (duplicates.length === 0) {
        duplicateWarned = false
        return
      }
      if (duplicateWarned) return

      duplicateWarned = true
      console.warn(`[DrawingsUI] DwTabs 检测到重复的 value：${duplicates.map(String).join('、')}，同名标签只有第一个能被选中。`)
    }, { immediate: true })

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

    watch(() => [props.widthMode, props.size, props.fill], () => {
      nextTick(syncEqualWidth)
    })

    function onKeydown(event: KeyboardEvent) {
      if (props.disabled) return

      // 方向键和 Home/End 只在可选标签之间移动，跳过禁用项
      const enabled = order.value.filter(tab => !tab.disabled.value)
      if (enabled.length === 0) return

      const current = enabled.findIndex(tab => tab.key.value === activeKey.value)
      let target: TabInstance

      switch (event.key) {
        case 'ArrowRight':
          target = enabled[current === -1 ? 0 : (current + 1) % enabled.length]
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
      select(target.key.value)
      target.el.value?.focus()
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
