const theme = {
  color: {
    primary: '#84cec3',
    secondary: ''
  },
  size: {},
  mixin: {
    wrapv1: `
      width: 1100px;
      height: 34px;
      margin: 0 auto;
    `,
    textNowrap: `
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    `
  }
}
export type AppTheme = typeof theme
export default theme
