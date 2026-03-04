export function scrollTo(element: any, to: number, duration: number): void {
  // 先判断 element 是否存在，不存在直接返回
  if (duration <= 0 || !element) return

  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10

  setTimeout(function () {
    // 再次确认 element 存在（防止超时后元素已被销毁）
    if (!element) return

    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}
