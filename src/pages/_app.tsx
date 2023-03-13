import { useState } from "react";
import type { AppProps } from "next/app";
import { Router } from "next/router";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";

import "@/styles/style.scss";
import createEmotionCache from "@/config/createEmotionCache";
import theme from "@/config/theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache: EmotionCache;
}

export default function App({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: MyAppProps) {
    const [loading, setLoading] = useState(false);

    Router.events.on("routeChangeStart", () => {
        setLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
        setLoading(false);
    });
    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
                {loading && <>Spinner</>}
            </ThemeProvider>
        </CacheProvider>
    );
}
