import styled from 'styled-components'

export const SongsListWrapper = styled.div`
  .song-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30px 49px;
    margin-top: 30px;
  }

  .song-item {
    width: 140px;
    height: 188px;

    .top {
      position: relative;

      & > img {
        width: 140px;
        height: 140px;
        object-fit: cover;
      }

      .top-favorite-marker {
        width: 40px;
        height: 40px;
        background-position: -135px -220px;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: 0 0;

      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-position: 0 -537px;
        color: #ccc;
        height: 27px;

        .headset {
          margin-right: 5px;
          display: inline-block;
          width: 14px;
          height: 11px;
          background-position: 0 -24px;
        }

        .play {
          display: inline-block;
          width: 16px;
          height: 17px;
          background-position: 0 0;
          cursor: pointer;
        }
      }
    }
  }

  .bottom {
    font-size: 12px;
    color: #000;
    margin-top: 5px;

    .song-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
      cursor: pointer;
      color: #000;
      text-decoration: none;
    }
    .song-name:hover {
      text-decoration: underline;
    }

    .song-creator,
    .song-track-count {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 3px;
    }

    .song-creator .by-text {
      color: #999;
      margin-right: 3px;
    }

    .song-creator .verify-icon {
      height: 13px;
      width: 13px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 3px;
    }
  }
  .pagination-container {
    height: 25px;
    padding: 50px;
    text-align: center;
  }
`
