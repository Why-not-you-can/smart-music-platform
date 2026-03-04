import styled from 'styled-components'

export const PlayerBarWrapper = styled.div`
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  bottom: 0;
  height: 53px;
  background-position: 0 0;
  background-repeat: repeat;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 47px;
  }
`
interface IBarControl {
  isPlaying: boolean
}

export const BarControl = styled.div<IBarControl>`
  display: flex;
  align-items: center;

  .btn {
    cursor: pointer;
  }

  .prev,
  .next {
    width: 28px;
    height: 28px;
  }

  .prev {
    background-position: 0 -130px;
  }

  .play {
    width: 36px;
    height: 36px;
    margin: 0 8px;
    background-position: 0 ${(props) => (props.isPlaying ? '-165px' : '-204px')};
  }

  .next {
    background-position: -80px -130px;
  }
`

export const BarPlayerInfo = styled.div`
  display: flex;
  width: 642px;
  align-items: center;

  .image {
    width: 34px;
    height: 34px;
    border-radius: 5px;
  }

  .info {
    flex: 1;
    color: #a1a1a1;
    margin-left: 10px;

    .song {
      color: #e1e1e1;
      position: relative;
      left: 8px;
      top: 5px;

      .singer-name {
        color: #a1a1a1;
        margin-left: 10px;
      }
    }

    .progress {
      display: flex;
      align-items: center;
      margin-top: -8px;
      margin-left: -8px;

      .ant-slider {
        position: relative;
        top: -3px;
        width: 493px;
        margin-right: 10px;

        .ant-slider-rail {
          height: 9px;
          background: url(${require('@/assets/img/progress_bar1.png')}) right 0;
        }

        .ant-slider-track {
          height: 9px;
          background: url(${require('@/assets/img/progress_bar1.png')})
            left -66px;
        }

        .ant-slider-handle {
          width: 22px;
          height: 24px;
          border: none;
          margin-top: -7px;
          background: url(${require('@/assets/img/sprite_icon.png')}) 0 -250px;
        }
      }

      .time {
        .current {
          color: #e1e1e1;
        }
        .divider {
          margin: 0 3px;
        }
      }
    }
  }
`
interface IBarOperator {
  playMode: number
}
export const BarOperator = styled.div<IBarOperator>`
  display: flex;
  align-items: center;
  position: relative;
  top: 3px;

  .btn {
    width: 25px;
    height: 25px;
    cursor: pointer;
    &:hover {
      filter: brightness(1.25) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
      transition: all 0.3s ease;
    }
  }

  .left {
    display: flex;
    align-items: center;
  }

  .pip {
    background: url(${require('@/assets/img/pip_icon.png')});
  }

  .favor {
    background-position: -88px -163px;
  }

  .share {
    background-position: -114px -163px;
  }

  .right {
    display: flex;
    align-items: center;
    width: 126px;
    padding-left: 13px;
    background-position: -147px -248px;

    .volume-wrapper {
      position: relative;
      display: inline-block;
    }

    .volume {
      background-position: -2px -246px;

      &.muted {
        background-position: -104px -248px;
      }
    }

    .volume-slider-container {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 20px;
      padding: 12px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      height: 120px;
      z-index: 1000;

      .ant-slider-vertical {
        height: 100px;
        margin: 0;

        .ant-slider-rail {
          background-color: #4a4a4a;
        }

        .ant-slider-track {
          background-color: #c20c0c;
        }

        .ant-slider-handle {
          border-color: #c20c0c;
          background-color: #fff;
          width: 12px;
          height: 12px;
          margin-left: -4px;
        }
      }
    }

    .loop {
      background-position: ${(props) => {
        switch (props.playMode) {
          case 1:
            return '-66px -248px'
          case 2:
            return '-66px -344px'
          default:
            return '-3px -344px'
        }
      }};
    }

    .playlist {
      padding-left: 18px;
      text-align: center;
      color: #ccc;
      width: 59px;
      background-position: -42px -69px;
    }
  }
`
