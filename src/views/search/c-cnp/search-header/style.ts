import styled from 'styled-components'

export const SearchHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  .ant-input-search {
    width: 420px;
    height: 40px;
    margin: 0 auto;
    z-index: 10;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
  .ant-input {
    line-height: 30px;
    padding: 0;
  }
  .ant-input-affix-wrapper {
    border: none;
    box-shadow: none;
  }
  .ant-input-search-button {
    height: 40px;
    width: 50px;
    border: none;
    border-left: 1px solid #e0e0e0;
    background: #f5f5f5;
    color: #999;
  }
  & > div:last-child {
    position: absolute;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    width: 420px;
    z-index: 999;
  }
`
