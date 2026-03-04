export function formatCount(count: number) {
  if (count > 100000) {
    return Math.floor(count / 10000) + '万'
  } else {
    return count
  }
}

export function getImageSize(
  imageUrl: string,
  width: number,
  height: number = width
) {
  return imageUrl + `?param=${width}y${height}`
}

export function formatTime(time: number) {
  const timeSeconds = time / 1000
  const minute = Math.floor(timeSeconds / 60)
  const second = Math.floor(timeSeconds) % 60
  const formatMinute = String(minute).padStart(2, '0')
  const formatSecond = String(second).padStart(2, '0')
  return `${formatMinute}:${formatSecond}`
}

function formatDate(time, fmt) {
  const date = new Date(time)

  // 处理年份
  if (/(y+)/.test(fmt)) {
    const year = date.getFullYear() + ''
    fmt = fmt.replace(RegExp.$1, year.substr(4 - RegExp.$1.length))
  }

  // 处理月、日、时、分、秒
  const map = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  Object.entries(map).forEach(([k, v]) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = v + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ('0' + str).slice(-2)
      )
    }
  })

  return fmt
}

export function formatMonthDay(time) {
  return formatDate(time, 'MM月dd日')
}
