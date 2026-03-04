// style.ts
import styled from 'styled-components'

export const MineWrapper = styled.div`
  padding: 20px 0;
  background-color: #f5f5f5;
  min-height: calc(100vh - 160px);

  .wrap-v2 {
    width: 1100px;
    margin: 0 auto;
  }

  .content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 700px;

    /* 未登录状态样式 */
    .pic {
      position: relative;
      width: 807px;
      height: 372px;
      margin: 0 auto;
      background: url(${require('@/assets/img/mine_sprite1.png')}) 0 104px
        no-repeat;

      .login {
        position: absolute;
        width: 167px;
        height: 45px;
        left: 482px;
        top: 302px;
        text-indent: -9999px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    /* 已登录状态样式 */
    .user-content {
      padding: 24px;

      .user-info {
        flex: 1;

        .username {
          margin: 0;
          color: #333;
          font-size: 24px;
          font-weight: bold;
        }

        .user-email {
          margin: 4px 0 0 0;
          color: #666;
        }

        .song-count {
          margin: 4px 0 0 0;
          color: #999;
          font-size: 12px;
        }
      }

      .songs-list {
        .song-item {
          position: relative;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          cursor: pointer;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background-color: #f5f5f5;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .song-content {
            .ant-list-item-meta {
              align-items: center;
            }
          }

          .song-actions {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;

            .ant-btn {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

              &:hover {
                transform: scale(1.1);
                transition: transform 0.2s ease;
              }
            }
          }

          &:hover .song-actions {
            opacity: 1;
          }
        }

        .ant-avatar {
          background: #1890ff;
        }
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: #d9d9d9;
        }

        .empty-text {
          margin-bottom: 16px;
          font-size: 14px;
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* 响应式设计 */
  @media (max-width: 1200px) {
    .wrap-v2 {
      width: 95%;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 0;

    .content {
      .user-content {
        padding: 16px;
      }

      .pic {
        width: 100%;
        background-size: contain;
        background-position: center;

        .login {
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
`
