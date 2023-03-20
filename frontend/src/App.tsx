import * as React from "react"
import {useEffect, useState} from "react"
import {Box, ChakraProvider, Grid,} from "@chakra-ui/react"
import {Navbar} from "./components/Navbar";
import {Footer} from "./components/Footer";

import {LoggedInRoutes, LoggedOutRoutes} from "./Routes";
import {LoginRegisterModal} from "./components/LoginRegisterModal";


export const App = () => {
    const [loginState, setLoginState] = useState<boolean>(false);

    // workaround for chakra ui bug :)
    useEffect(() => {
        localStorage.setItem('chakra-ui-color-mode', 'dark')
        if (sessionStorage.getItem("user") !== null) {
            setLoginState(true);
        }
    }, [])

    return (
        <ChakraProvider>
            <Navbar loginState={loginState} setLoginState={setLoginState}/>
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={3}>
                    {loginState ? LoggedInRoutes : LoggedOutRoutes}
                </Grid>
            </Box>
            <LoginRegisterModal setLoginState={setLoginState}/>
            <Footer/>
        </ChakraProvider>
    );
}
