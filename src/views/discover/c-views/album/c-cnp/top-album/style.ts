import styled from 'styled-components'

export const TopAlbumWrapper = styled.div`
  margin-top: 30px;
  padding: 0 16px;

  .album-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
  }

  .album-list > div {
    width: calc(20% - 16px);
    box-sizing: border-box;
  }
`
