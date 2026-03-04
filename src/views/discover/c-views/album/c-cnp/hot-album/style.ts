import styled from 'styled-components'

export const HotAlbumWrapper = styled.div`
  .album-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px;
  }

  .album-list > div {
    width: calc(20% - 10px);
    margin-bottom: 20px;
    box-sizing: border-box;
  }
`
