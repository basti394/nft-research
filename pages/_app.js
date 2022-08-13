import '../styles/globals.css'
import {ChakraProvider} from "@chakra-ui/react";
import {Fragment} from "react";
import theme from "../components/theme";


function MyApp({ Component, pageProps }) {
  const Layout = Component.layout ?? Fragment;


  return <ChakraProvider theme={theme}>
    <Layout>
      <Component {...pageProps}></Component>
    </Layout>
  </ChakraProvider>
}

export default MyApp
