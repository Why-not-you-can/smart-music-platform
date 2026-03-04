import styled from 'styled-components'

export const AppFooterWrapper = styled.div`
  width: 100%;
  max-width: 980px;
  height: 232px;
  background-color: #f2f2f2;
  border-top: 1px solid #e5e5e5;
  padding: 40px 20px;
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden; /* 防止内容溢出导致滚动 */

  .wrap-v2 {
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    height: 100%;
    justify-content: center;
  }

  .footer-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* 允许链接换行 */
    justify-content: center;
    gap: 10px 16px; /* 垂直和水平间距 */
    width: 100%;
    max-width: 800px; /* 限制最大宽度，防止过宽 */
    line-height: 1.5;

    a {
      color: #666;
      font-size: 14px;
      text-decoration: none;
      white-space: nowrap; /* 防止链接文字换行 */
      transition: color 0.2s ease;

      &:hover {
        color: #333;
        text-decoration: underline;
      }
    }

    .separator {
      color: #ccc;
      font-size: 14px;
      line-height: 1;
      display: flex;
      align-items: center;
    }
  }

  .report-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    color: #999;
    font-size: 12px;
    line-height: 1.5;
    width: 100%;
    text-align: center;

    .integrity-report {
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #666;
      }
    }

    .report-email {
      color: #3982e5;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 30px 15px;

    .content {
      gap: 20px;
    }

    .footer-links {
      gap: 8px 12px;

      a,
      .separator {
        font-size: 12px;
      }
    }

    .report-info {
      flex-direction: column;
      gap: 8px;
    }
  }
`
