import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';


class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Jewelry Order Management System" />
          <meta name="keywords" content="jewelry, orders, repairs, management" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 