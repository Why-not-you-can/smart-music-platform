import styled from 'styled-components'
export const SongsListHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  .header-info {
    display: flex;
    justify-content: center;
    width: 780px;
    height: 33px;
    border-bottom: 2px solid #c20c0c;

    .list-title {
      font-size: 20px;
      font-weight: normal;
      font-family: 'Microsoft Yahei', Arial, Helvetica, sans-serif;
      color: #333;
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
`
