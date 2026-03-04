import styled from 'styled-components'

export const RadioRecommendWrapper = styled.div`
  .radio-list {
    margin: 20px 0 40px;
    display: flex;
    justify-content: space-between;
  }
  .radio-item {
    display: flex;
    flex-direction: column;
    width: 150px;

    .name {
      font-size: 14px;
      color: #333;
      margin: 5px 0;
    }

    img {
      width: 150px;
      height: 150px;
    }

    p {
      color: #666;
    }
  }
`
