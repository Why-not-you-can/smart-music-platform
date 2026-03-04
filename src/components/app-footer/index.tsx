import React, { Fragment, memo } from 'react'
import type { FC, ReactNode } from 'react'
import { AppFooterWrapper } from './style'
import { footerLinks } from '@/assets/data/local_data'

interface IProps {
  children?: ReactNode
}

const AppFooter: FC<IProps> = () => {
  return (
    <AppFooterWrapper>
      <div className="wrap-v2 content">
        <div className="footer-links">
          {footerLinks.map((item, index) => (
            <Fragment key={item.link}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="separator">|</span>
              )}
            </Fragment>
          ))}
        </div>
        <div className="report-info">
          <span className="integrity-report">廉正举报</span>
          <span className="bad-info-report">
            不良信息举报邮箱:
            <a
              href="mailto:51jubao@service.netease.com"
              className="report-email"
            >
              51jubao@service.netease.com
            </a>
          </span>
        </div>
      </div>
    </AppFooterWrapper>
  )
}

export default memo(AppFooter)
