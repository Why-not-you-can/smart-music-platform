import styled from 'styled-components'

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
    pointer-events: auto;

    .modal {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    transition: background 0.3s ease;
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 32px 28px;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(-20px);
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
    border: 1px solid #f0f0f0;
  }
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  .close-btn {
    color: #8c8c8c;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.2s ease;

    &:hover {
      color: #1a1a1a;
      transform: scale(1.1);
    }
  }
`

export const ModalBody = styled.div`
  .form-item {
    margin-bottom: 20px;

    .input-icon {
      color: #8c8c8c;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    font-size: 14px;
    color: #666666;
  }

  .remember-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;

    input {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      accent-color: #1890ff;
    }

    .label-text {
      user-select: none;
      color: #595959;
    }
  }
`

export const ModalFooter = styled.div`
  margin: 28px 0 16px;

  .login-button {
    height: 48px;
    font-size: 16px;
    border-radius: 8px;
    background: #1890ff;
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #40a9ff;
      transform: translateY(-1px);
    }
  }
`

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  margin: 0;

  .register-btn {
    font-size: 14px;
    color: #1890ff;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #096dd9;
      text-decoration: underline;
      transform: translateY(-1px);
    }
  }

  .forgot-link {
    font-size: 14px;
    color: #1890ff;
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #096dd9;
      text-decoration: underline;
    }
  }

  .login-link {
    font-size: 14px;
    color: #1890ff;
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #096dd9;
      text-decoration: underline;
    }
  }

  .register-tip {
    font-size: 14px;
    color: #8c8c8c;
    margin: 0;
  }
`
