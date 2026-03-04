import styled from 'styled-components'

export const RadioCategoryWrapper = styled.div`
  width: 933px;
  height: 194px;
  position: relative;
  margin: 0 -30px;
  margin-bottom: 20px;

  .dots {
    position: absolute;
    left: 0;
    right: 0;

    li {
      display: inline-flex; /* 横向排列 */
      align-items: center;
      justify-content: center;
      margin: 0 4px;
    }

    .slick-dots {
      margin-right: 12%;
    }

    li button {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ccc;
      border: none;
    }

    li.slick-active button {
      background-color: #c20c0c;
    }
  }

  .category-page {
    display: block;
    height: 100%;
  }

  .category-item {
    width: 70px;
    height: 72px;
    float: left;
    margin: 0 0 25px 33px;
    text-align: center;

    .image {
      width: 70px;
      height: 70px;
      background-repeat: no-repeat;
      background-position: center 0;

      img {
        width: 48px;
        height: 48px;
        object-fit: none;
        object-position: 0 0;
        margin: 2px auto 0;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    span {
      display: block;
      font-size: 12px;
      color: #888;
      white-space: nowrap;
      text-align: center;
    }

    &.active {
      .image img {
        object-position: -48px 0;
      }

      .image {
        background-position: -70px 0;
        box-shadow: 0 0 0 2px #d35757;
        color: #d35757;
        border-radius: 3px;
      }

      span {
        color: #d35757;
        text-align: center;
        font-weight: 500;
      }
    }
  }
`
export const BannerControl = styled.div`
  .btn {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 30px;
    margin-top: -15px;
    opacity: 0.25;
    filter: alpha(opacity=25);
    text-indent: -9999px;
    background-image: url(${require('@/assets/img/radio_slide.png')});
    background-color: transparent;
    cursor: pointer;
    opacity: 0.25;
  }

  .left {
    left: 5px;
    background-position: 0 -30px;
  }

  .right {
    right: -21px;
    background-position: -30px -30px;
  }
  .left,
  .right:hover {
    opacity: 0.4;
  }
`
