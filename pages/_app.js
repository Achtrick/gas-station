import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { store, wrapper } from "../redux/store";
import "../styles/globals.scss";
import createEmotionCache from "../utils/config/cahce";
import lightTheme from "../utils/shared/theme";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <SnackbarProvider
              autoHideDuration={1500}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
