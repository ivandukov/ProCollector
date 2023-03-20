import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Select,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {useEffect, useReducer, useState} from "react";
import {useNavigate} from "react-router-dom";
import {leagueServerRegions} from "../helper/Regions";
import {useApiClient} from "../adapter/api/useApiClient";

enum LoginRegisterError {
    EMPTY_USERNAME = "Username is required",
    EMPTY_PASSWORD = "Password is required",
    INVALID_CREDENTIALS = "Invalid credentials",
    EMPTY_SUMMONER_NAME = "Summoner name is required",
    EMPTY_SERVER_REGION = "Server region is required",
    API_ERROR = "Riot API is not available. Please try again later."
}

type LoginRegisterModalState = {
    username: string;
    password: string;
    summonerName?: string;
    region?: string;
}

type LoginRegisterModalProps = {
    setLoginState: (state: boolean) => void;
}

export const LoginRegisterModal = ({setLoginState}: LoginRegisterModalProps) => {

    const {isOpen, onOpen, onClose} = useDisclosure()
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const toast = useToast();
    const apiClient = useApiClient();

    //login state
    const [loginState] = useState<LoginRegisterModalState>({
        username: "",
        password: "",
        summonerName: "",
        region: ""
    })

    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<LoginRegisterError | null>(null)

    const reducer = (state: LoginRegisterModalState, action: any) => {
        switch (action.type) {
            case "username":
                return {...state, username: action.payload}
            case "password":
                return {...state, password: action.payload}
            case "summonerName":
                return {...state, summonerName: action.payload}
            case "region":
                return {...state, region: action.payload}
            case "reset":
                return {...state, username: "", password: "", region: "", summonerName: ""}
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, loginState);

    useEffect(() => {
        document.addEventListener("loginregistermodal:open", onOpen)
    }, [onOpen]);


    const isInputValid = (state: LoginRegisterModalState) => {
        if (state.username.length === 0) {
            setError(true);
            setErrorMessage(LoginRegisterError.EMPTY_USERNAME);
            return false
        }
        if (state.password.length === 0) {
            setError(true)
            setErrorMessage(LoginRegisterError.EMPTY_PASSWORD)
            return false
        }
        setErrorMessage(null);
        return true
    }

    const registerHandler = async () => {

        if (isInputValid(state)) {

            if (state.summonerName.length === 0) {
                setError(true);
                setErrorMessage(LoginRegisterError.EMPTY_SUMMONER_NAME);
                return
            }
            if (state.region.length === 0) {
                setError(true);
                setErrorMessage(LoginRegisterError.EMPTY_SERVER_REGION);
                return
            }

            try {
                const response = await apiClient.postAuthRegister({
                    region: state.region,
                    summonerName: state.summonerName,
                    userName: state.username,
                    password: state.password
                })
                if (response.status === 201) {
                    toast({
                        title: "Success",
                        description: "You have successfully registered. Please login with your credentials.",
                        status: "success",
                        duration: 9000,
                        isClosable: true
                    })
                    dispatch({type: "reset"})
                    onClose();
                }
            } catch (e) {
                setError(true);
                setErrorMessage(LoginRegisterError.INVALID_CREDENTIALS)
            }

        } else {
            return;
        }
    }

    const loginHandler = async () => {
        if (isInputValid(state)) {
            const response = await apiClient.postAuthLogin({userName: state.username, password: state.password});


            if (response.status === 200) {
                setLoginState(true)
                sessionStorage.setItem("user", JSON.stringify(response.data))
                navigate("/dashboard")
                dispatch({type: "reset"})
                onClose();
            } else {
                setError(true)
                setErrorMessage(LoginRegisterError.INVALID_CREDENTIALS)
            }
        } else {
            return;
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setError(false);
                    setErrorMessage(null);
                    dispatch({type: "reset"})
                }}>
                <ModalOverlay/>
                <ModalContent>
                    <Tabs>
                        <TabList>
                            <Tab>Sign in</Tab>
                            <Tab>Register</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <ModalCloseButton/>
                                <ModalBody>
                                    <Stack spacing={5}>
                                        <FormControl isRequired isInvalid={error}>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                value={state.username}
                                                onChange={(e) => dispatch({type: "username", payload: e.target.value})}
                                            />
                                            <FormLabel mt={"1.5rem"}>Password</FormLabel>
                                            <InputGroup size='md'>
                                                <Input
                                                    pr='4.5rem'
                                                    type={show ? 'text' : 'password'}
                                                    value={state.password}
                                                    onChange={(e) => dispatch({
                                                        type: "password",
                                                        payload: e.target.value
                                                    })}
                                                />
                                                <InputRightElement width='4.5rem'>
                                                    <Button h='1.75rem' size='xs' onClick={handleClick}>
                                                        {show ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {error && <FormLabel mt={"1.5rem"}>{errorMessage}</FormLabel>}
                                        </FormControl>
                                    </Stack>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={() => loginHandler()}>Login</Button>
                                </ModalFooter>
                            </TabPanel>
                            <TabPanel>
                                <ModalCloseButton/>
                                <ModalBody>
                                    <Stack spacing={5}>
                                        <FormControl isRequired isInvalid={error}>
                                            <FormLabel>Username</FormLabel>
                                            <Input
                                                value={state.username}
                                                onChange={(e) => dispatch({type: "username", payload: e.target.value})}
                                            />
                                            <FormLabel mt={"1.5rem"}>Summoner name</FormLabel>
                                            <Input
                                                value={state.summonerName}
                                                onChange={(e) => dispatch({
                                                    type: "summonerName",
                                                    payload: e.target.value
                                                })}
                                            />
                                            <FormLabel mt={"1.5rem"}>Region</FormLabel>
                                            <Select size={"lg"} placeholder='Region' onChange={event => {
                                                dispatch({type: "region", payload: event.target.value})
                                            }}>
                                                {leagueServerRegions.map((region) => (
                                                    <option key={region.abb} value={region.abb}>
                                                        {region.value}
                                                    </option>
                                                ))}
                                            </Select>
                                            <FormLabel mt={"1.5rem"}>Password</FormLabel>
                                            <InputGroup size='md'>
                                                <Input
                                                    pr='4.5rem'
                                                    type={show ? 'text' : 'password'}
                                                    value={state.password}
                                                    onChange={(e) => dispatch({
                                                        type: "password",
                                                        payload: e.target.value
                                                    })}
                                                />
                                                <InputRightElement width='4.5rem'>
                                                    <Button h='1.75rem' size='xs' onClick={handleClick}>
                                                        {show ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {error && <FormLabel mt={"1.5rem"}>{errorMessage}</FormLabel>}
                                        </FormControl>
                                    </Stack>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={() => registerHandler()}>
                                        Register
                                    </Button>
                                </ModalFooter>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalContent>
            </Modal>
        </>
    )
}