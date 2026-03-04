import styled from 'styled-components'

interface Position {
  x: number
  y: number
}

export const ChatWindow = styled.div<{
  position: Position
  isDragging: boolean
}>`
  position: fixed;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  width: 500px;
  height: 700px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 999;
  transition: ${(props) => (props.isDragging ? 'none' : 'all 0.3s ease')};
  cursor: ${(props) => (props.isDragging ? 'grabbing' : 'default')};
  user-select: none;

  .header {
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: move;

    .avatar-container {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;

      .main-title {
        font-size: 16px;
        font-weight: 600;
        margin-left: 30px;
      }

      .sub-title {
        font-size: 12px;
        opacity: 0.8;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .weather-info,
        .time-info {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .usage-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ffd700;
          font-weight: 500;

          .warning {
            color: #ff6b6b;
            font-weight: 600;
          }
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #52c41a;
          font-weight: 500;
        }
      }
    }

    .close-btn {
      height: 40px;
      width: 40px;
      cursor: pointer;
      font-size: 18px;
      transition: transform 0.2s;
      padding: 7px 11px 8px 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  /* 限制警告样式 */
  .limit-warning {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);

    .warning-content {
      background: linear-gradient(135deg, #fff5f5, #fff);
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 107, 107, 0.3);

      h3 {
        margin: 0 0 12px 0;
        color: #ff4d4f;
        font-size: 18px;
        font-weight: 600;
      }

      p {
        margin: 0 0 20px 0;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
      }

      .warning-actions {
        display: flex;
        gap: 12px;
        justify-content: center;

        .login-btn {
          background: linear-gradient(135deg, #ff6b6b, #ff4d4f);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
          }
        }

        .close-warning {
          background: rgba(255, 255, 255, 0.9);
          color: #666;
          border: 1px solid #e0e0e0;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;

          &:hover {
            background: white;
            border-color: #667eea;
            color: #667eea;
          }
        }
      }
    }
  }

  .messages-container {
    height: calc(100% - 140px);
    overflow-y: auto;
    padding: 15px;
    background: linear-gradient(135deg, #8f9fe4ff, #cb71b0ff);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(102, 126, 234, 0.3);
      border-radius: 3px;
    }

    /* 游客通知样式 */
    .visitor-notice-sticky {
      background: linear-gradient(135deg, #ffd666, #ffa940);
      color: #874d00;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(255, 173, 64, 0.3);
      position: sticky;
      top: -14px;
      z-index: 10;

      /* 添加粘性定位时的样式 */
      margin: 0 -16px 12px -16px;
      border-radius: 0;
      border-left: none;
      border-right: none;
      box-shadow: 0 2px 8px rgba(255, 173, 64, 0.2);
    }

    .visitor-notice-sticky .visitor-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    .visitor-notice-sticky .visitor-info .login-prompt {
      font-size: 11px;
    }

    .visitor-notice-sticky .visitor-info .login-prompt .login-link {
      color: #1890ff;
      font-weight: 600;
      text-decoration: none;
      margin: 0 4px;
    }

    .visitor-notice-sticky .visitor-info .login-prompt .login-link:hover {
      text-decoration: underline;
    }

    /* 确保 messages-container 有相对定位 */
    .messages-container {
      position: relative;
    }

    .message {
      margin-bottom: 18px;
      max-width: 85%;
      animation: fadeIn 0.3s ease;

      &.user {
        margin-left: auto;
        flex-direction: row-reverse;

        .avatar-container {
          width: 50px;
          margin-top: 40px;
          margin-left: auto;
        }

        .message-bubble {
          background: rgba(255, 255, 255, 0.5);
          color: black;
          border-radius: 18px 4px 18px 18px;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          margin-right: 55px;
          margin-top: -15px;
        }
      }

      &.assistant {
        flex-direction: row;

        .avatar-container {
          margin-right: 8px;
          margin-top: 4px;
        }
        .message-bubble {
          background: rgba(255, 255, 255, 0.5);
          color: #333;
          border-radius: 4px 18px 18px 18px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e8e8e8;
          margin-left: 55px;
          margin-top: -15px;
        }
      }

      .message-bubble {
        font-size: 14px;
        font-weight: 600;
        padding: 12px 16px;
        word-wrap: break-word;
        line-height: 1.5;

        .song-recommendations {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .playlist-recommendations {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .song-card {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e8e8e8;
          position: relative;

          .song-actions {
            display: flex;
          }
          .action-btn {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .action-btn:hover {
            background: #f5f5f5;
            border-color: #4096ff;
          }

          .download-btn:hover {
            color: #52c41a;
            border-color: #52c41a;
          }

          .share-btn:hover {
            color: #1890ff;
            border-color: #1890ff;
          }

          /* 用户上传歌曲的特殊样式 */
          &.user-uploaded {
            border: 2px solid #52c41a !important;
            background: rgba(82, 196, 26, 0.05) !important;
            box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2) !important;

            &:hover {
              border-color: #73d13d !important;
              background: rgba(82, 196, 26, 0.1) !important;
              box-shadow: 0 4px 16px rgba(82, 196, 26, 0.3) !important;
            }
          }

          &:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-color: #667eea;
          }

          .song-cover {
            width: 45px;
            height: 45px;
            border-radius: 8px;
            margin-right: 12px;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
          }

          .song-info {
            flex: 1;
            min-width: 0;
          }

          .song-name {
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
            display: flex;
            align-items: center;

            .user-upload-indicator {
              color: #52c41a;
              margin-left: 4px;
              font-size: 12px;
            }
          }

          .song-artist {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;

            .user-upload-tag {
              color: #52c41a;
              font-size: 11px;
              font-weight: 600;
              margin-left: 6px;
              background: rgba(82, 196, 26, 0.1);
              padding: 1px 6px;
              border-radius: 8px;
            }
          }

          .song-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 11px;
            color: #999;
            margin-right: 8px;
          }

          .play-indicator {
            font-size: 16px;
            color: #667eea;
            opacity: 0.7;
            margin-left: 8px;
          }

          /* 用户上传徽章样式 */
          .user-upload-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background: linear-gradient(135deg, #52c41a, #73d13d);
            color: white;
            font-size: 9px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 8px;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            animation: pulse 2s infinite;
          }
        }

        .playlist-card {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e8e8e8;

          &:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-color: #667eea;
          }

          .playlist-cover {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            margin-right: 12px;
            overflow: hidden;
            flex-shrink: 0;
          }

          .playlist-info {
            flex: 1;
            min-width: 0;
          }

          .playlist-name {
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          }

          .playlist-meta {
            font-size: 11px;
            color: #666;
            display: flex;
            gap: 8px;
          }
        }

        .options {
          margin-top: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .option-btn {
          padding: 6px 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-1px);
          }
        }
      }
    }
  }

  .input-area {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    input {
      flex: 1;
      height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 0 15px;
      outline: none;
      font-size: 14px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      color: #333;

      &::placeholder {
        color: #999;
      }

      &:focus {
        border-color: #667eea;
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.6);
        color: #999;
        cursor: not-allowed;
      }
    }

    button {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: scale(1.05);
      }

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(82, 196, 26, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
    }
  }
`

export const ToggleButton = styled.button`
  position: fixed;
  right: 30px;
  bottom: 70px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }
`

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin: 0 2px;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`
