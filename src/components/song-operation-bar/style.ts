import styled from 'styled-components'

export const OperationBarWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .play {
    display: flex;
    align-items: center;
    margin-right: 5px;
    cursor: pointer;

    .play-icon {
      display: inline-block;
      height: 31px;
      line-height: 31px;
      background-position: right -428px;
      &:hover {
        background-position: right -508px;
      }
      &:active {
        background-position: right -548px;
      }

      .play {
        color: #fff;
        display: flex;
        align-items: center;
        padding: 0 7px 0 8px;
        background-position: 0 -387px;
        &:hover {
          background-position: 0 -468px;
        }
        &:active {
          background-position: 0 -508px;
        }
        i {
          display: inline-block;
          width: 20px;
          height: 18px;
          margin: -2px 2px 0;
          background-position: 0 -1622px;
        }
      }
    }

    .add-icon {
      display: inline-block;
      width: 31px;
      height: 31px;
      margin-left: -11px;
      transform: translateY(1px);
      padding-right: 0;
      background-position: 0 -1588px;
      text-indent: -9999px;
      &:hover {
        background-position: -40px -1588px;
      }
      &:active {
        background-position: -80px -1588px;
      }
    }
  }

  .item {
    display: inline-block;
    height: 31px;
    margin-right: 6px;
    padding-right: 5px;
    background-position: right -1020px;
    &:hover {
      background-position: right -1106px;
    }
    &:active {
      background-position: right -1150px;
    }
    .icon {
      display: inline-block;
      height: 31px;
      line-height: 31px;
      padding: 0 7px 0 28px;
      font-family: simsun;
    }

    .favor-icon {
      background-position: 0 -977px;
      &:hover {
        background-position: 0 -1063px;
      }
      &:active {
        background-position: 0 -1105px;
      }
    }

    .share-icon {
      background-position: 0 -1225px;
      &:hover {
        background-position: 0 -1311px;
      }
      &:active {
        background-position: 0 -1353px;
      }
    }

    .download-icon {
      background-position: 0 -2761px;
    }

    .comment-icon {
      background-position: 0 -1465px;
      &:hover {
        background-position: 0 -1551px;
      }
      &:active {
        background-position: 0 -1593px;
      }
    }
  }
`
