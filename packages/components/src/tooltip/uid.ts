let uid = 0

/** 生成唯一的 tooltip id，供 aria-describedby 使用 */
export function nextTooltipId() {
  uid += 1
  return `dw-tooltip-${uid}`
}
