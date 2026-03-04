import styled from 'styled-components'

export const SongListWrapper = styled.div`
  padding: 0 40px;

  .header-info {
    display: flex;
    height: 33px;
    border-bottom: 2px solid #c20c0c;

    .list-title {
      font-size: 20px;
      font-weight: normal;
      font-family: 'Microsoft Yahei', Arial, Helvetica, sans-serif;
      color: #333;
      margin: 0;
    }

    .list-song {
      margin: 9px 0 0 20px;
      color: #666;
    }

    .play-stats {
      font-size: 12px;
      margin-top: 5px;
      margin-left: auto;
      white-space: nowrap;
      color: #666;

      #play-count {
        margin: 0 4px;
        color: #c20c0c;
      }
    }

    @media (max-width: 768px) {
      .play-stats {
        margin-left: 0;
        width: 100%;
        margin-top: 8px;
      }
    }
  }

  .play-list {
    table {
      width: 100%;
      border: 1px solid #d9d9d9;

      thead {
        th {
          height: 34px;
          line-height: 34px;
          background-image: url(${require('@/assets/img/sprite_table.png')});
          color: #666;
          border: 1px solid #ddd;
          border-width: 0 0 1px 1px;
          padding-left: 10px;
        }

        .ranking {
          width: 78px;
          border-left: none;
        }

        .duration {
          width: 91px;
        }

        .singer {
          width: 173px;
        }
      }

      tbody {
        td {
          padding: 6px 10px;
        }

        tr:nth-child(2n) {
          background-color: #fff;
        }

        tr:nth-child(2n + 1) {
          background-color: #f7f7f7;
        }

        .rank-num {
          display: flex;

          .num {
            width: 25px;
            height: 18px;
            text-align: center;
            color: #999;
          }

          .new {
            width: 16px;
            height: 17px;
            margin-left: 12px;
            background-position: -67px -283px;
          }
        }

        .song-name {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }

          .play {
            width: 17px;
            height: 17px;
            cursor: pointer;
            background-position: 0 -103px;
          }
          .play:hover {
            color: #e2e2e2;
          }

          .name {
            margin-left: 10px;
          }
        }
      }
    }
  }
`
