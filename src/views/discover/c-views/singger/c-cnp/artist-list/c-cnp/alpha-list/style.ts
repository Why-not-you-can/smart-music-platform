import styled from 'styled-components'
interface AlphaListWrapperProps {
  hasTop?: boolean
}
export const AlphaListWrapper = styled.div<AlphaListWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => (props.hasTop ? '20px' : 0)};

  .item {
    display: flex;
    padding: 1px 4px;
    border-radius: 3px;
    align-items: center;
    justify-content: center;
    span {
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }

    span:hover {
      text-decoration: underline;
    }

    &.text-item {
      /* 文字项 */
      width: 45px;
      height: 24px;
    }

    &.letter-item {
      /* 字母项 */
      width: 21px;
      height: 24px;
    }
  }

  .active {
    background-color: #c20c0c;
    span {
      color: #fff;
    }
  }
`
