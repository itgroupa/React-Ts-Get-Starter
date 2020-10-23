import React from "react";
import ReactDOM, { render } from "react-dom";
import { App } from 'components/app.component';

if ('serviceWorker' in navigator && !!SW_ACTIVE) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then();
  });
}

ReactDOM.render(
    <App />,
  document.getElementById("app")
);