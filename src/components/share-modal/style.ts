import styled from 'styled-components'

export const ShareContentWrapper = styled.div`
  .ant-modal:has(.ant-modal-body &) {
    .ant-modal-content {
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
      overflow: hidden;
      border: none;
    }

    .ant-modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      padding: 20px 24px !important;

      .ant-modal-title {
        color: #fff !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px;
      }
    }

    .ant-modal-close {
      top: 16px !important;
      right: 16px !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(4px);
      transition: all 0.3s;

      .ant-modal-close-x {
        color: #fff !important;
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.35) !important;
        transform: rotate(90deg);
      }
    }

    .ant-modal-body {
      padding: 28px 24px 20px !important;
    }

    .ant-modal-footer {
      border-top: 1px solid #f0f0f0 !important;
      background: #fafafa !important;
      padding: 16px 24px !important;

      .ant-btn-primary {
        background: linear-gradient(
          135deg,
          #667eea 0%,
          #764ba2 100%
        ) !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  .share-info {
    margin-bottom: 24px;
    padding: 16px;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    border-left: 4px solid #667eea;
    border-radius: 0 8px 8px 0;

    strong {
      color: #667eea;
      font-weight: 600;
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    span {
      color: #333;
      font-size: 15px;
      font-weight: 500;
    }
  }

  .share-textarea {
    margin-bottom: 28px;

    textarea.ant-input {
      border-radius: 10px;
      border: 2px solid #f0f0f0;
      transition: all 0.3s;
      font-size: 14px;
      resize: none;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);

      &:hover {
        border-color: #d9d9d9;
      }

      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.08);
      }
    }
  }

  .share-platform-title {
    margin-bottom: 18px;
    font-size: 14px;
    color: #888;
    font-weight: 500;
    display: flex;
    align-items: center;

    strong {
      color: #333;
      font-size: 15px;
    }

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #e8e8e8, transparent);
      margin-left: 16px;
    }
  }

  .share-platform-buttons {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    justify-content: center;

    .ant-btn {
      flex: 1;
      height: 52px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      border: 2px solid #f0f0f0;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      .anticon {
        font-size: 20px;
      }

      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(-1px) scale(0.98);
      }
    }

    .wechat-btn {
      color: #09bb07;
      border-color: rgba(9, 187, 7, 0.2);
      background: rgba(9, 187, 7, 0.02);

      &:hover {
        color: #fff;
        border-color: #09bb07;
        background: #09bb07;
      }
    }

    .qq-btn {
      color: #12b7f5;
      border-color: rgba(18, 183, 245, 0.2);
      background: rgba(18, 183, 245, 0.02);

      &:hover {
        color: #fff;
        border-color: #12b7f5;
        background: #12b7f5;
      }
    }

    .weibo-btn {
      color: #e6162d;
      border-color: rgba(230, 22, 45, 0.2);
      background: rgba(230, 22, 45, 0.02);

      &:hover {
        color: #fff;
        border-color: #e6162d;
        background: #e6162d;
      }
    }
  }

  .share-link-section {
    margin-top: 4px;

    strong {
      color: #333;
      font-size: 14px;
      font-weight: 500;
      display: block;
      margin-bottom: 12px;
    }

    .share-link-box {
      padding: 16px;
      background: #f8f9fa;
      border: 1px dashed #d9d9d9;
      border-radius: 10px;
      font-size: 13px;
      color: #666;
      word-break: break-all;
      line-height: 1.6;
      position: relative;
      transition: all 0.3s;
      font-family: 'Monaco', 'Menlo', monospace;

      &:hover {
        background: #fff;
        border-style: solid;
        border-color: #667eea;
        color: #333;
      }
    }
  }
`
