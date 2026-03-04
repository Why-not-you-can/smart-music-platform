import styled from 'styled-components'
import { AppTheme } from '../../../../assets/theme'
export const NavWrapper = styled.div<{ theme: AppTheme }>`
  height: 35px;
  background-color: ${(props) => props.theme.color.primary};
  .nav {
    display: flex;
    padding-left: 180px;
    position: relative;
    top: -3px;

    .item {
      a {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        padding: 0 20px;
        margin: 10px 20px 0;
        color: #fff;
        font-size: 14px;

        &:hover,
        &.active {
          text-decoration: none;
          background-color: #79b7f1;
          border-radius: 20px;
        }
      }
    }
  }
`
