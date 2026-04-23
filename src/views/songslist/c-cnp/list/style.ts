import styled from 'styled-components'
export const ListWrapper = styled.div`
  width: fit-content;
  margin: 0 auto;
.play-list {
    table {
      border: 1px solid #d9d9d9;
      width: 780px;
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
          width: 74px;
          border-left: none;
        }

        .duration {
          width: 111px;
        }

        .creator {
          width: 14%;
          text-align: center;
        }

        .album {
          width: 20%;
        }
      }

      tbody {
        td {
          padding: 6px 10px;
        }
          td.duration {
            text-align: center;
          }

          td.creator {
            text-align: center;
          }
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

          .play {
            width: 17px;
            height: 17px;
            cursor: pointer;
            margin-left: 20px;
            background-position: 0 -103px;
            background-repeat: no-repeat;
          }
          .play:hover {
            background-position: 0 -128px;
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

          .name {
            margin-left: 20px;
          }
        }
      }
    }
  }
      .pagination-container {
    height: 25px;
    padding: 50px;
    text-align: center;
  }
`
