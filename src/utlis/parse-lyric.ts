const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export interface ILyric {
  time: number
  text: string
}
export function parseLyric(lyricString: string) {
  const lineStrings: string[] = lyricString.split('\n')
  const lyrics: ILyric[] = []
  for (const line of lineStrings) {
    if (line) {
      const results = timeRegExp.exec(line)
      if (!results) continue
      const time1 = Number(results[1]) * 60 * 1000
      const time2 = Number(results[2]) * 1000
      const time3 =
        results[3].length === 3 ? Number(results[3]) : Number(results[3]) * 10
      const time = time1 + time2 + time3
      const text = line.replace(timeRegExp, '')
      lyrics.push({ time, text })
    }
  }
  return lyrics
}
