import styled from 'styled-components'

export const PlayListWrapper = styled.div`
  position: relative;
  width: 563px;
  padding: 2px;
  border-right: 4px solid #000;

  .scroll-container {
    height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translateX(10px);

    /* 美化滚动条 */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #868686;
      border-radius: 3px;
    }
  }
  .play-item {
    padding: 0 8px 0 25px;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    line-height: 28px;
    color: #ccc;
    cursor: pointer;

    &.active {
      color: #fff;
      background-color: #000;

      ::before {
        content: '';
        position: absolute;
        left: 8px;
        width: 10px;
        height: 13px;
        background: url(${require('@/assets/img/playlist_sprite.png')}) -182px 0;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .singer {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .duration {
        width: 45px;
      }

      .link {
        margin-left: 20px;
        width: 14px;
        height: 16px;
        background-position: -100px 0;
      }
    }
  }
`
