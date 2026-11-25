import { Comment, Fragment, Text, cloneVNode, defineComponent, h, mergeProps, type VNode } from 'vue'

function isIgnorable(node: VNode) {
  if (node.type === Comment) return true
  if (node.type === Text) return !String(node.children ?? '').trim()
  return false
}

// <slot /> 透传时可能被包成 Fragment，需要展开成实际子节点
function flatten(nodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (isIgnorable(node)) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flatten(node.children as VNode[]))
      continue
    }
    result.push(node)
  }
  return result
}

function canClone(node: VNode) {
  return typeof node.type === 'string' || typeof node.type === 'object' || typeof node.type === 'function'
}

function joinIds(...values: unknown[]) {
  const ids: string[] = []
  for (const value of values) {
    if (typeof value !== 'string') continue
    for (const id of value.split(/\s+/)) {
      if (id) ids.push(id)
    }
  }
  return ids.length ? Array.from(new Set(ids)).join(' ') : undefined
}

let warned = false
function warnFallback() {
  if (warned) return
  warned = true
  console.warn('[DwTooltip] 默认插槽需为单一元素根节点，已回退为包裹层渲染。')
}

/**
 * 无包裹触发器：把事件与 aria 属性注入默认插槽的唯一根元素。
 * 插槽不是单一可克隆节点时回退为 span 包裹层。
 */
export default defineComponent({
  name: 'DwTooltipTrigger',
  inheritAttrs: false,
  props: {
    describedBy: { type: String, default: '' },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const nodes = flatten(slots.default?.() ?? [])
      const describedBy = joinIds(attrs['aria-describedby'], props.describedBy)

      if (nodes.length === 1 && canClone(nodes[0])) {
        return cloneVNode(
          nodes[0],
          mergeProps(nodes[0].props ?? {}, attrs, { 'aria-describedby': describedBy }),
        )
      }

      if (nodes.length > 1 || (nodes.length === 1 && !canClone(nodes[0]))) {
        warnFallback()
      }

      return h(
        'span',
        mergeProps(attrs, {
          class: 'dw-tooltip-trigger',
          'aria-describedby': describedBy,
        }),
        slots.default?.(),
      )
    }
  },
})
