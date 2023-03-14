import React from "react";
import { ipcRenderer } from "electron";
import Head from "next/head";
import App, { AnimatorUIProvider } from "ui-react";

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Code Animator</title>
      </Head>
      <AnimatorUIProvider
        options={{
          sendToAfterEffects: (data) => {
            return ipcRenderer.invoke("sendToAfterEffects", data);
          },
        }}
      >
        <App />
      </AnimatorUIProvider>
    </React.Fragment>
  );
}

export default Home;
