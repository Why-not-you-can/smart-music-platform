import React, { memo, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { VisualizeWrapper } from './style'
import { useAppSelector } from '@/store'

interface IProps {
  children?: ReactNode
}

const AudioVisualizer: FC<IProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  const { currentSong, isPlaying } = useAppSelector((state) => state.player)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 增加条形数量，创建更密集的效果
    const bars = 168
    let frequencies: number[] = new Array(bars).fill(0.1)
    let lastUpdateTime = 0

    // 基于歌曲的种子值
    let songBasedSeed = 0
    if (currentSong?.id) {
      songBasedSeed = (currentSong.id % 100) / 100
    }

    const draw = () => {
      if (!ctx) return

      // 使用更透明的清除以获得拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const currentTime = Date.now()
      const time = currentTime * 0.005

      if (isPlaying && currentSong) {
        if (currentTime - lastUpdateTime > 16) {
          // ~60fps
          frequencies = frequencies.map((freq, index) => {
            const seedInfluence = songBasedSeed * 0.5

            const wave1 =
              Math.sin(time * (0.5 + seedInfluence) + index * 0.3) * 0.4
            const wave2 =
              Math.cos(time * (0.8 + seedInfluence * 0.5) + index * 0.1) * 0.3
            const wave3 =
              Math.sin(time * (1.2 + seedInfluence * 0.3) + index * 0.05) * 0.2

            // 使用种子值调整随机脉冲概率
            const pulseThreshold = 0.7 - songBasedSeed * 0.2
            const randomPulse =
              Math.random() > pulseThreshold ? Math.random() * 0.8 : 0

            // 基于位置的权重
            const positionWeight = 1 - Math.abs(index - bars / 2) / (bars / 2)

            const baseValue = 0.2 + wave1 + wave2 + wave3 + randomPulse
            const weightedValue = baseValue * (0.7 + positionWeight * 0.3)

            // 快速变化，减少平滑度
            const targetHeight = Math.min(1, Math.max(0.1, weightedValue))

            // 更快的响应
            return freq + (targetHeight - freq) * 0.3
          })

          lastUpdateTime = currentTime
        }

        // 使用种子值调整峰值爆发的概率
        const burstThreshold = 0.93 - songBasedSeed * 0.1
        if (Math.random() > burstThreshold) {
          const burstStart = Math.floor(Math.random() * (bars - 10))
          const burstWidth = 5 + Math.floor(Math.random() * 6)
          const burstStrength = 0.8 + Math.random() * 0.2

          for (
            let i = burstStart;
            i < burstStart + burstWidth && i < bars;
            i++
          ) {
            frequencies[i] = burstStrength
          }
        }
      } else {
        // 停止时快速衰减
        frequencies = frequencies.map((freq) => Math.max(0.1, freq * 0.8))
      }

      // 绘制条形
      const barWidth = canvas.width / bars

      frequencies.forEach((freq, index) => {
        const barHeight = freq * canvas.height * 0.8 // 增加高度系数
        const x = index * barWidth
        const y = canvas.height - barHeight

        // 使用歌曲种子值来影响颜色变化
        const hueShift = songBasedSeed * 360
        const hue =
          ((currentSong?.id || 0) * 137 + index * 2 + time * 50 + hueShift) %
          360

        // 使用饱和度和亮度来创建更丰富的颜色
        const saturation = 80 + freq * 20
        const lightness = 40 + freq * 30

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, y)

        if (freq > 0.7) {
          // 高能量颜色 - 使用计算出的饱和度和亮度
          gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`)
          gradient.addColorStop(
            1,
            `hsl(${(hue + 60) % 360}, ${saturation + 10}%, ${lightness + 20}%)`
          )
        } else {
          // 低能量颜色 - 使用计算出的饱和度和亮度
          gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`)
          gradient.addColorStop(
            1,
            `hsl(${(hue + 30) % 360}, ${saturation + 10}%, ${lightness + 20}%)`
          )
        }

        ctx.fillStyle = gradient

        // 更细的条形，更少的间距
        const actualBarWidth = barWidth - 1
        ctx.fillRect(x, y, actualBarWidth, barHeight)

        // 添加高光效果 - 使用 lightness 来调整高光强度
        if (freq > 0.5) {
          const highlightOpacity = 0.3 * freq * (lightness / 70)
          ctx.fillStyle = `hsla(${hue + 30}, 100%, ${lightness + 40}%, ${highlightOpacity})`
          ctx.fillRect(x, y, actualBarWidth * 0.3, barHeight * 0.3)
        }
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentSong])

  // 只有在播放且有当前歌曲时才显示可视化器
  if (!isPlaying || !currentSong) return null

  return (
    <VisualizeWrapper>
      <div className="audio-visualizer-container">
        <canvas ref={canvasRef} className="audio-visualizer" />
      </div>
    </VisualizeWrapper>
  )
}

export default memo(AudioVisualizer)
