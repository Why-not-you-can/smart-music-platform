export function handleSongsCategory(data: {
  categories: Record<number, string>
  sub: Array<{ category: number }>
}) {
  const category = data.categories
  const categoryData = Object.entries(category).map(([value]) => {
    return {
      name: value,
      subs: [] as Array<{ category: number }>
    }
  })
  for (const item of data.sub) {
    categoryData[item.category].subs.push(item)
  }

  return categoryData
}
export function generateSingerAlpha() {
  const alphabets: string[] = ['-1']
  const start = 'A'.charCodeAt(0)
  const last = 'Z'.charCodeAt(0)
  for (let i = start; i <= last; ++i) {
    alphabets.push(String.fromCharCode(i))
  }

  alphabets.push('0')

  return alphabets
}

export const singerAlphas = generateSingerAlpha()
