import styled from 'styled-components'

export const PlaylistInfoWrapper = styled.div`
  display: flex;
  padding: 47px 30px 40px 39px;

  .left {
    width: 206px;
    margin-right: -226px;

    .image {
      width: 208px;
      height: 208px;
      padding: 3px;
      border: 2px solid #ccc;
      box-sizing: border-box;
      position: relative;
    }

    .image img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .link {
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        width: 16px;
        height: 16px;
        background-position: -34px -863px;
        display: inline-block;
      }

      a {
        color: #0c73c2;
        text-decoration: underline;
        margin-left: 4px;
      }
    }
  }

  .right {
    width: 414px;
    margin-left: 225px;
    margin-top: -20px;

    .header {
      width: 410px;
      height: 24px;
      display: flex;
      align-items: center;

      i {
        width: 54px;
        height: 24px;
        background-position: 0 -243px;
        display: inline-block;
      }

      .playlist-title {
        width: 346px;
        height: 24px;
        margin-left: 8px;
        font-size: 20px;
        font-weight: 400;
      }
    }

    .creator-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      color: #333;
      margin: 0 0 20px;

      .creator-avatar {
        width: 35px;
        height: 35px;
      }

      .creator-nickname {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .create-time {
        font-size: 12px;
        color: #999;
      }
    }

    .info-tags {
      display: flex;
      align-items: center;
      margin: 25px 0 5px;
      flex-wrap: wrap;

      .tags-label {
        font-size: 12px;
        color: #333;
        margin-right: 8px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .tags-list {
        display: flex;
        gap: 10px;
      }

      .tag-item {
        padding: 4px 10px;
        background-color: #f5f5f5;
        border-radius: 12px;
        font-size: 13px;
        color: #555;
        transition: all 0.2s ease;

        &:hover {
          background-color: #e8e8e8;
          color: #333;
          transform: translateY(-1px);
        }
      }
    }

    .info-description {
      margin: 16px 0;
      color: #333;
      font-size: 12px;
      line-height: 1.6;

      .desc-title {
        font-weight: 600;
        color: #666;
        margin: 0 8px 8px 0;
        display: inline-block;
        vertical-align: top;
        width: 50px;
      }

      .desc-content {
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 58px);
        margin: 0;

        p {
          margin: 0 0 6px 0;
          word-break: break-word;
        }
      }

      .desc-control {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #0066cc;
        background: none;
        border: none;
        padding: 4px 0;
        margin: 6px 0 0 58px;
        font-size: 12px;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #004999;
        }

        .sprite_icon2 {
          width: 12px;
          height: 12px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          transition: transform 0.2s;
        }

        &:has(+ .isSpread) .sprite_icon2,
        &:hover .sprite_icon2 {
          transform: rotate(180deg);
        }
      }
    }

    @media (max-width: 768px) {
      .creator-info {
        gap: 8px;
      }

      .creator-nickname {
        max-width: 120px;
        font-size: 12px;
      }

      .create-time {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .info-tags {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .tag-item {
        padding: 3px 8px;
        font-size: 12px;
      }

      .info-description {
        .desc-title {
          font-size: 12px;
          display: block;
          width: auto;
          margin-bottom: 4px;
        }

        .desc-content {
          display: block;
          width: 100%;
        }

        .desc-control {
          margin-left: 0;
        }
      }
    }
  }
`
