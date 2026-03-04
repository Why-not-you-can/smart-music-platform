import styled from 'styled-components'

export const PlayerRelevantWrapper = styled.div`
  margin-top: 40px;

  .songs {
    .song-item {
      position: relative; /* 关键：作为按钮定位基准 */
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      height: 32px;
      padding-right: 60px; /* 给按钮预留固定空间 */

      .info {
        width: 100%;

        .title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          a {
            color: #666;
          }
        }

        .artist {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          a {
            color: #999;
            font-size: 12px;
          }
        }
      }

      .operate {
        /* 固定在右侧，不随内容移动 */
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%); /* 精确垂直居中 */
        background-color: #fff;
        padding: 0 5px;
        width: 50px; /* 固定宽度避免晃动 */
        display: flex;
        justify-content: center;
        gap: 10px; /* 按钮间距 */

        .item {
          display: inline-block;
          width: 10px;
          height: 11px;
        }

        .play {
          background-position: -69px -455px;
          cursor: pointer;
        }

        .add {
          background-position: -87px -454px;
          cursor: pointer;
        }
        .play,
        .add:hover {
          opacity: 1;
        }
      }
    }
  }
`
