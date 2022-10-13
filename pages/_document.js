import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />

          {/*You can add react portals  */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
