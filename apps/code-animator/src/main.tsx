import React from "react";
import ReactDOM from "react-dom/client";
import App from "ui-react";
import "./index.css";

const font = new FontFace("Dank Mono", "url(DankMono-Regular.ttf))", {
  style: "normal",
  weight: "400",
  stretch: "condensed",
});

document.fonts.add(font);

const AppWithFontCheck = () => {
  const [fontloaded, setFontloaded] = React.useState(false);
  React.useEffect(() => {
    font.load().then(() => setFontloaded(true));
  }, []);
  return fontloaded ? <App /> : <div>Loading...</div>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppWithFontCheck />
  </React.StrictMode>
);
