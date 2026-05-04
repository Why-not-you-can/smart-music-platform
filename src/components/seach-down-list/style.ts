import styled from 'styled-components'

export const SearchDropdownWrapper = styled.div`
  position: absolute;
  top: 60px;
  width: 300px;
  overflow-y: auto;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  padding: 6px 0; // 缩小上下内边距

  .user-entry {
    padding: 8px 16px;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 4px;

    &:hover {
      background: #f5f5f5;
    }
  }

  .search-row {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    .category-cell {
      width: 75px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding: 8px 12px;
      box-sizing: border-box;
      align-self: flex-start;

      .category-icon {
        font-size: 12px;
        color: #999;
        flex-shrink: 0;
      }

      .category-text {
        font-size: 12px;
        color: #666;
        line-height: 1.4;
      }
    }
    .list-cell {
      flex: 1;
      box-sizing: border-box;
      padding: 4px 0;

      .list-item {
        padding: 6px 12px;
        font-size: 11px;
        color: #333;
        cursor: pointer;
        line-height: 1.4;
        display: flex;
        align-items: center;
        gap: 4px;
        min-height: 32px;
        box-sizing: border-box;

        &:hover {
          background: #f5f5f5;
        }

        .item-sub {
          color: #666;
          font-size: 11px;
          flex-shrink: 0;
        }

        .highlight-keyword {
          color: #0c73c2;
          font-weight: 500;
        }
      }
    }
  }
`
