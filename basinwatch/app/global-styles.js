import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'IBM Plex Serif', serif;
    height: 100vh;
  }

  body.fontLoaded {
    @import url("https://fonts.googleapis.com/css?family=IBM+Plex+Sans:700|IBM+Plex+Serif:400,400i&display=swap");
    font-family: 'IBM Plex Serif', serif;
    font-family: 'IBM Plex Sans', sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
    color: white;

  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;

export default GlobalStyle;
