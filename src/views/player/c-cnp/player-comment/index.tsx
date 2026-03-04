import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const PlayerComment: FC<IProps> = () => {
  return <div></div>
}

export default memo(PlayerComment)
