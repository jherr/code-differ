import React from "react";
import ReactDOM from "react-dom/client";
import App from "ui-react";
import "./index.css";

const font = new FontFace(
  "Dank Mono",
  "url(DankMono-Regular.ttf), url(DankMono-Bold.ttf), url(DankMono-Italic.ttf)"
);

document.fonts.add(font);

const AppWithFontCheck = () => {
  const [fontloaded, setFontloaded] = React.useState(false);
  React.useEffect(() => {
    font.load().then(() => setFontloaded(true));
  }, []);
  return fontloaded ? <App /> : <div />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppWithFontCheck />
  </React.StrictMode>
);
