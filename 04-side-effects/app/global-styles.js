import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: center;
    background: #222 !important;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100%;
    margin: 0 auto;
    width: 1000px;
    text-align: center;
    padding-top: 50px;
    position: relative;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  h1 {
    margin-bottom: 40px !important;
    color: #eee !important;
  }

  .typeahead-selector {
    position: absolute;
    margin: 0px;
    background: #111;
    z-index: 999;
    width: 100%;
  }

  .typeahead-selector a {
    color: #eee;
    font-weight: bold;
    text-decoration: none;
    display: block;
    padding: 10px 0px;
  }

  .typeahead-selector li {
    list-style: none;
  }

  .public_fixedDataTable_main {
    border: none !important;
  }

`;
