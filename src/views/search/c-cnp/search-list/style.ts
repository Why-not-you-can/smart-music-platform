import styled from 'styled-components'

export const SearchListWrapper = styled.div`
  width: 900px;
  .song-item {
    background-color: #ffffff;
  }
  .song-item:nth-child(even) {
    background-color: #f7f7f7;
  }
  .song-item:hover {
    background-color: #f0f0f0;
  }
  .search-stats {
    font-size: 12px;
    color: #999;
    margin-bottom: 20px;
    .keyword {
      color: #999;
    }
    .count {
      color: #c20c0c;
      font-weight: bold;
    }
  }
  .tab-bar {
    display: flex;
    align-items: center;
    height: 39px;
    width: 900px;
    border: 1px solid #ccc;
    border-width: 0 1px;
    background-position: 0 0;
    background-repeat: repeat-x;
    margin-bottom: 20px;
    .tab-btn {
      width: 110px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      cursor: pointer;
      background: inherit;
      background-position: right 0;
      flex: 1;
    }
    .tab-btn:hover {
      background-position: right -45px;
    }
    .tab-btn.active {
      background-position: right -90px;
    }
  }

  .play-list {
    table {
      width: 100%;
      border-collapse: collapse;

      .song-item {
        height: 38px;

        &:hover {
          background-color: #f5f5f5;
        }

        td {
          padding: 6px 10px;
          line-height: 18px;
          text-align: left;
        }
        .w7 {
          width: 50px;
        }
        .w4 {
          width: 180px;
          height: 62px;
          color: #666;
        }
        .time-col {
          width: 110px !important;
          color: #999;
          text-align: right;
        }
        .songs-count {
          width: 72px;
          padding-right: 0;
          padding-left: 25px;
          color: #999;
        }
        .play-col {
          width: 40px;
          text-align: center;
        }

        .title-col {
          width: 35%;
        }
        .fav-col {
          width: 15%;
          color: #999;
        }
        .artist-col {
          width: 15%;
          color: #666;
        }

        .album-col {
          width: 20%;
          color: #666;
        }

        .time-col {
          width: 80px;
          color: #999;
          text-align: right;
        }
        .text {
          width: 100%;
          position: relative;
          zoom: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .highlight {
        color: #0c73c2 !important;
        font-weight: normal;
      }
    }

    .play.sprite_table {
      display: inline-block;
      width: 17px;
      height: 17px;
      cursor: pointer;
      background-position: 0 -103px;
      border: none;
      background-color: transparent;
      &:hover {
        background-position: 0 -128px;
      }
    }

    .song-name-box {
      display: flex;
      align-items: center;
      gap: 5px;

      .song-title {
        flex: 1;
        cursor: pointer;
      }
      &:hover .song-title {
        text-decoration: underline;
      }

      .operate-btns {
        display: flex;
        visibility: hidden;
        gap: 5px;
        align-items: center;
      }
    }
    .song-item:hover .operate-btns {
      visibility: visible;
      opacity: 1;
    }

    .add {
      margin-bottom: 3px;
      width: 13px;
      height: 13px;
      cursor: pointer;
      background-position: 0 -700px;
      &:hover {
        background-position: -22px -700px;
      }
    }
    .fav {
      margin-left: 0;
      width: 18px;
      height: 16px;
      cursor: pointer;
      background-position: 0 -174px;
      &:hover {
        background-position: -20px -174px;
      }
    }
    .share {
      width: 18px;
      height: 16px;
      cursor: pointer;
      background-position: 0 -195px;
      &:hover {
        background-position: -20px -195px;
      }
    }
    .download {
      width: 18px;
      height: 16px;
      cursor: pointer;
      background-position: -81px -174px;
      &:hover {
        background-position: -104px -174px;
      }
    }
  }

  .artist-list {
    display: grid;
    grid-template-columns: repeat(6, 130px);
    gap: 20px;
    padding: 10px 0;
  }

  .artist-card {
    width: 130px;
    text-align: center;
    cursor: pointer;
  }

  .artist-img {
    position: relative;
    border-radius: 8px;
    margin-bottom: 8px;
    display: block;
    object-fit: cover;
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: 0 -680px;
  }
  .artist-info {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
  }
  .artist-name {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #000;
    flex: 1;
    &:hover {
      text-decoration: underline;
    }
  }
  .icon {
    width: 17px;
    height: 18px;
    background-position: 0 -740px;
    display: inline-block;
    flex-shrink: 0;
  }
  .artist-name .highlight {
    color: #0c73c2 !important;
  }
  .album-list {
    display: grid;
    grid-template-columns: repeat(5, 130px);
    row-gap: 40px;
    column-gap: 55px;
  }
  .album-card {
    width: 130px;
    text-align: center;
    cursor: pointer;
  }
  .album-img {
    position: relative;
    border-radius: 8px;
    margin-bottom: 8px;
    display: block;
    object-fit: cover;
  }
  .album-cover {
    position: absolute;
    width: 153px;
    height: 130px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-position: 0 -845px;
    text-indent: -9999px;
  }
  .album-name {
    width: 153px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #000;
    &:hover {
      text-decoration: underline;
    }
  }
  .album-name .highlight {
    color: #0c73c2 !important;
  }
  .video-list {
    display: grid;
    grid-template-columns: repeat(5, 159px);
    gap: 20px;
  }
  .video-info {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .video-title {
    width: 153px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #000;
    flex-shrink: 0;
    &:hover {
      text-decoration: underline;
    }
  }
  .video-title .highlight {
    color: #0c73c2 !important;
  }
  .vic {
    width: 26px;
    height: 16px;
    background-position: -270px -480px;
    display: inline-block;
    flex-shrink: 0;
  }
  .video-img {
    position: relative;
    border-radius: 8px;
    margin-bottom: 8px;
    display: block;
    cursor: pointer;
    object-fit: cover;
  }
  .tl {
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 5px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    box-sizing: border-box;
    text-align: right;
    text-shadow: -2px 1px rgba(0, 0, 0, 0.4);
    width: 90px;
    background-position: 0 0;
    .mv {
      margin: -2px 2px 0 0;
      width: 15px;
      height: 10px;
      display: inline-block;
      background-position: -60px -310px;
    }
  }
  .bl {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: 5px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    text-shadow: -2px 1px rgba(0, 0, 0, 0.4);
  }
  .video-name {
    font-size: 12px;
    cursor: pointer;
    color: #666;
    &:hover {
      text-decoration: underline;
    }
  }
`
