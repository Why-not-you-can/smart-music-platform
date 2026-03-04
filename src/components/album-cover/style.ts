import styled from 'styled-components'

interface AlbumCoverWrapperProps {
  width: any
  size: any
  bgp: any
}
export const AlbumCoverWrapper = styled.div<AlbumCoverWrapperProps>`
  width: 186px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .album-image {
    position: relative;
    width: ${(props) => props.width};
    height: ${(props) => props.size};
    overflow: hidden;
    margin-top: 15px;

    img {
      width: ${(props) => props.size};
      height: ${(props) => props.size};
    }

    .cover {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-position: 0 ${(props) => props.bgp};
      text-indent: -9999px;
    }
    .play {
      position: absolute;
      right: 30px;
      bottom: 5px;
      width: 28px;
      height: 28px;
      background-position: 0 -140px;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }

    &:hover .play {
      opacity: 1;
    }

    .play:hover {
      background-position: 0 -170px;
    }
  }

  .album-info {
    font-size: 12px;
    width: ${(props) => props.size};
    .name {
      color: #000;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .artist {
      color: #666;
    }
  }
`
