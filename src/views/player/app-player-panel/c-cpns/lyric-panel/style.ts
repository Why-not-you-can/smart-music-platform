import styled from 'styled-components'

export const LyricPanelWrapper = styled.div`
  position: relative;
  flex: 1;
  border-left: 4px solid #000 !important;
  padding: 21px 0 20px 0;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .lrc-content {
    .lrc-item {
      height: 32px;
      text-align: center;
      color: #989898;

      &.active {
        color: #fff;
        font-size: 14px;
      }
    }
  }
`
