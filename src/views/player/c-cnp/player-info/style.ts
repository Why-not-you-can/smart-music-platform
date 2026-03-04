import styled from 'styled-components'

export const PlayerInfoWrapper = styled.div`
  display: flex;
  padding: 47px 30px 40px 39px;

  .left {
    float: left;
    width: 206px;
    margin-right: -226px;

    .image {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      width: 198px;
      height: 198px;

      .cover {
        position: absolute;
        width: 206px;
        height: 205px;
        margin-top: -4px;
        margin-left: -4px;
        background-position: -140px -580px;
      }
    }

    .link {
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-position: -34px -863px;
      }

      a {
        color: #0c73c2;
        text-decoration: underline;
      }
    }
  }

  .right {
    width: 414px;
    margin-left: 225px;
    margin-top: -45px;

    .header {
      display: flex;
      align-items: center;
      i {
        display: inline-block;
        width: 54px;
        height: 24px;
        background-position: 0 -463px;
      }

      .title {
        font-size: 24px;
        font-weight: 400;
        margin-left: 10px;
      }
    }

    .singer,
    .album {
      margin: 10px;

      a {
        color: #0c73c2;
      }
    }

    .lyric {
      padding: 30px 0 50px;

      .lyric-info {
        .text {
          margin: 6px 0;
        }
      }

      .lyric-control {
        position: relative;
        color: #0c73c2;
        background-color: #fff;
        text-decoration: underline;
        cursor: pointer;

        i {
          position: absolute;
          width: 11px;
          height: 8px;
          right: -8px;
          top: 2px;
          background-position: ${(props) =>
              (props as any).isSpread ? '-45px' : '-65px'} -520px;
        }
      }
    }
  }
`
