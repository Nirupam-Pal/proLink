import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Geist, Instrument_Serif } from "next/font/google";
import { Provider } from "react-redux";

// Self-hosted by Next.js: Geist is one variable file, the serif is used only for display type
const geist = Geist({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });

export default function App({ Component, pageProps }) {
  return <>
  <style jsx global>{`
    :root {
      --font-geist: ${geist.style.fontFamily};
      --font-serif: ${serif.style.fontFamily};
    }
  `}</style>
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
  </>
}
