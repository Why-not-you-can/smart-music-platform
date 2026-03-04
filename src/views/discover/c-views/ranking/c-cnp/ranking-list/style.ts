import styled from 'styled-components'

export const RankingListWrapper = styled.div`
  width: 240px;
  margin-top: 20px;
  background-color: #f9f9f9;

  .title {
    font-size: 14px;
    font-weight: 900;
    font-family: simsun;
    color: #000;
    padding: 0 10px 12px 15px;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 10px 0 10px 20px;
    text-decoration: none;
    color: inherit;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    &:not(.active):hover {
      background-color: #f5f5f5;
    }

    &.active {
      background-color: #e6e6e6;
    }

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      margin-right: 12px;
    }

    .info {
      flex: 1;
      overflow: hidden;

      .name {
        font-size: 14px;
        color: #333;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .update {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`
