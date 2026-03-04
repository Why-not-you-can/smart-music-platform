import styled from 'styled-components'

export const PlayHeaderWrapper = styled.div`
  display: flex;
  height: 41px;
  line-height: 41px;
  background: url(${require('@/assets/img/playpanel_bg.png')}) 0 0;

  .left {
    display: flex;
    justify-content: space-between;
    width: 553px;
    padding: 0 25px;

    h3 {
      color: #e2e2e2;
      font-weight: 700;
    }

    .operator {
      color: #ccc;
    }
    button {
      background-color: transparent;
      color: #ccc;
      cursor: pointer;
      text-underline-offset: 4px;
    }

    button.clear-btn {
      &:hover {
        color: #e2e2e2;
        text-decoration: underline;
      }
      &:hover .remove {
        filter: brightness(1.5);
      }
    }

    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      position: relative;
      top: 4px;
      right: 2px;
    }

    .favor {
      background-position: -24px 0;
    }

    .remove {
      width: 13px;
      background-position: -51px 0;
    }
  }
  .right {
    flex: 1;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
`
