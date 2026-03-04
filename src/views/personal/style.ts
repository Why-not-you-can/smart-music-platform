import { Card } from 'antd'
import styled from 'styled-components'

export const PersonalWrapper = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`

export const UserCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;

  .user-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar-container {
    position: relative;
    cursor: pointer;

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }

  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .user-info {
    flex: 1;
  }

  .username {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
  }

  .user-stats {
    display: flex;
    gap: 24px;
    margin-top: 16px;
  }

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 18px;
      font-weight: bold;
      color: #1890ff;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }
  }
`

export const AvatarUpload = styled.div`
  .avatar-upload-content {
    text-align: center;
    padding: 20px 0;
  }

  .avatar-preview-large {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    cursor: pointer;
    border: 2px dashed #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: border-color 0.3s;

    &:hover {
      border-color: #1890ff;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar-placeholder-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;

    .anticon {
      font-size: 32px;
      margin-bottom: 8px;
    }
  }

  .upload-tips {
    color: #666;
    font-size: 14px;

    p {
      margin-bottom: 12px;
    }
  }
`
