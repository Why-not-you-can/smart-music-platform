import styled from 'styled-components'

export const VisualizeWrapper = styled.div`
  .audio-visualizer-container {
    position: fixed;
    bottom: 45px;
    left: 0;
    width: 100%;
    height: 200px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    z-index: 98;
    pointer-events: none;
  }

  .audio-visualizer {
    width: 100%;
    height: 100%;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  .audio-visualizer:hover {
    opacity: 1;
  }
`
