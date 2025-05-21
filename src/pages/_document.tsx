/* eslint-disable react/no-danger */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp: (App) => {
          return (props) => {
            return (
              <StyleProvider cache={cache}>
                <App {...props} />
              </StyleProvider>
            );
          };
        },
      });
    };

    const initialProps = await Document.getInitialProps(ctx);
    const style = extractStyle(cache, true);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: style }} />
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
