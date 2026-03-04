import styled from 'styled-components'

export const PlayListWrapper = styled.div`
  .content {
    background: url(${require('@/assets/img/wrap-bg.png')}) repeat-y;
    background-color: #fff;
    display: flex;
  }

  .left {
    width: 709px;
  }

  .right {
    width: 250px;
    padding: 20px 40px 40px 30px;
  }
`
