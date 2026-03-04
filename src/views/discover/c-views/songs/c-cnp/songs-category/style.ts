import styled from 'styled-components'

export const SongsCategoryWrapper = styled.div`
  position: absolute;
  z-index: 99;
  top: 55px;
  left: -25px;
  width: 700px;
  border: 1px solid #ccc;
  background-color: #fefefe;
  box-shadow: 0 0 10px 2px #d3d3d3;
  border-radius: 5px;
  padding-top: 10px;

  .arrow {
    position: absolute;
    top: -11px;
    left: 110px;
    width: 24px;
    height: 11px;
    background-position: -48px 0;
  }

  /* 「全部风格」按钮的样式 */
  .all {
    padding: 10px 25px;
    border-bottom: 1px solid #e2e2e2;

    .link {
      display: inline-block;
      text-align: center;
      width: 75px;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d3d3d3;
      border-radius: 3px;
      background-color: #fafafa;
      cursor: pointer; /* 鼠标放上去变“小手”，提示能点 */

      /* 鼠标悬停时的效果 */
      &:hover {
        background-color: #f0f0f0;
        border-color: #b3b3b3;
      }

      /* 选中时的高亮样式 */
      &.active {
        background-color: #e9e9e9;
        border-color: #adadad;
        color: #c62f2f; /* 选中时文字变红，更明显 */
      }
    }
  }

  .category {
    padding-left: 25px;

    dl {
      display: flex;
      align-items: flex-start;
    }

    dt {
      display: inline-flex;
      align-items: center;
      padding: 15px 0 10px;
      width: 70px;
      text-align: center;
      color: #666; /* 分类标题（比如“语种”“场景”）用浅灰色，区分内容 */

      i {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-position: -20px -735px;
        margin-right: 8px;
      }
    }

    /* 分类标题前的小图标样式（保持你原来的） */
    dl.item1 {
      i {
        background-position: 0 -60px;
      }
    }
    dl.item2 {
      i {
        background-position: 0 -88px;
      }
    }
    dl.item3 {
      i {
        background-position: 0 -117px;
      }
    }
    dl.item4 {
      i {
        background-position: 0 -141px;
      }
      dd {
        padding-bottom: 25px;
      }
    }

    /* 子分类（比如“华语”“英语”“工作”）的样式 */
    dd {
      padding-top: 18px;
      padding-left: 15px;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      border-left: 1px solid #e2e2e2;

      .item {
        margin-bottom: 8px;
        padding: 0 5px; /* 扩大点击区域，避免点不准 */
      }

      .link {
        color: #333;
        cursor: pointer; /* 提示能点击 */
        padding: 2px 5px;

        /* 鼠标悬停时显示下划线 */
        &:hover {
          text-decoration: underline;
          color: #c62f2f; /* 悬停时文字变红 */
        }

        /* 选中时的样式 */
        &.active {
          color: #c62f2f;
          font-weight: 500; /* 选中时加粗 */
        }
      }

      /* 分隔符“|”的样式 */
      .divider {
        margin: 0 12px;
        color: #e2e2e2;
        user-select: none; /* 防止不小心选中分隔符 */
      }
    }
  }
`
