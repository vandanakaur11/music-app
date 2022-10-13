import { Provider } from "react-redux";
import Layout from "../src/layout/Layout";
import { store } from "../src/store/reducer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
