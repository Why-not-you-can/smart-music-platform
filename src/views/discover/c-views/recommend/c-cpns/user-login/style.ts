import styled from 'styled-components'

export const LoginWrapper = styled.div`
  height: 126px;
  background-position: 0 0;
  padding: 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    line-height: 25px;
  }

  a {
    margin-top: 10px;
    display: inline-block;
    width: 100px;
    height: 31px;
    line-height: 31px;
    text-align: center;
    color: #fff;
    text-decoration: none;
    background-position: 0 -195px;
    text-shadow: 0 1px 0 #8a060b;

    :hover {
      background-position: -110px -195px;
    }
  }

  &.logged-in {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    padding: 2px;
    background: #fff;
    border: 1px solid #dadada;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .username {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .stats {
    font-size: 12px;
    color: #666;
    display: flex;
    gap: 12px;
  }
`
