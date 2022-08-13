import '../styles/globals.css'
import {ChakraProvider} from "@chakra-ui/react";
import {Fragment} from "react";


function MyApp({ Component, pageProps }) {
  const Layout = Component.layout ?? Fragment;


  return <ChakraProvider>
    <Layout>
      <Component {...pageProps}></Component>
    </Layout>
  </ChakraProvider>
}

export default MyApp
