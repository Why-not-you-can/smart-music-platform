import styled from 'styled-components'

export const PlayerWrapper = styled.div`
  .content {
    background: url(${require('@/assets/img/wrap-bg.png')}) repeat-y;
    background-color: #fff;
    display: flex;
  }

  .left {
    width: 710px;
  }

  .right {
    width: 270px;
    padding: 20px 40px 40px 30px;
  }
`
