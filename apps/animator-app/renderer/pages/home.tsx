import React from "react";
import Head from "next/head";
import App from "ui-react";

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Code Animator</title>
      </Head>
      <App />
    </React.Fragment>
  );
}

export default Home;
