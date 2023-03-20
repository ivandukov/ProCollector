import {
    Box,
    Button,
    chakra,
    FormControl,
    FormLabel,
    GridItem,
    Heading,
    Input,
    InputGroup,
    Select,
    SimpleGrid,
    Stack,
    Text, useToast,
    VStack
} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useLoggedInUser} from "../helper/useLoggedInUser";
import {useApiClient} from "../adapter/api/useApiClient";
import {leagueServerRegions} from "../helper/Regions";
import {User} from "../adapter/api/__generated";

/**
 * Settings page where the user can change their player
 * @constructor
 */
export const Settings = () => {

    const {user, setUserFromStorage} = useLoggedInUser();
    const [newSummoner, setNewSummoner] = React.useState("");
    const [newRegion, setNewRegion] = React.useState("");
    const api = useApiClient();
    const toast = useToast();

    useEffect(() => {
        if (user) {
            setNewSummoner(user!.summonerName.name);
            setNewRegion(user!.summonerName.region);
        }
    }, [user]);


    const updateSummonerName = async () => {
        try {
            const res = await api.putAuthUpdate(newRegion, newSummoner, user?.userName, {withCredentials: true});
            let newUser: User = res.data;
            sessionStorage.setItem("user", JSON.stringify(newUser));
            setUserFromStorage();
            toast({
                title: "Success",
                description: "Summoner name updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box px={8} py={16}>
            <Box
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                textAlign={{
                    base: "left"
                }}
            >
                <chakra.h1
                    mb={6}
                    fontSize={{
                        base: "4xl",
                        md: "6xl",
                    }}
                    fontWeight="bold"
                    lineHeight="none"
                    letterSpacing={{
                        base: "normal",
                        md: "tight",
                    }}
                    color="gray.900"
                    _dark={{
                        color: "gray.100",
                    }}
                >
                    <Text
                        display={{
                            base: "block",
                            lg: "inline",
                        }}
                        w="full"
                        bgClip="text"
                        color={"#BE5A04"}
                        fontWeight="extrabold"
                    >
                        Settings
                    </Text>
                </chakra.h1>
                <Stack
                    direction={{
                        base: "column",
                        sm: "row",
                    }}
                    mb={{
                        base: 4,
                        md: 8,
                    }}
                    spacing={2}
                    justifyContent={{
                        sm: "left",
                        md: "center",
                    }}
                >
                </Stack>
            </Box>
            <VStack
                w={{
                    base: "full",
                    md: 11 / 12,
                    xl: 9 / 12,
                }}
                mx="auto"
                flexDirection="column"
                spacing={5}
                border={"1px"}
                borderColor={"#3f444e"}
                rounded={"lg"}
            >
                <Box
                    py={8}
                    px={8}
                    width={"100%"}
                >
                    <Box>
                        <SimpleGrid
                            display={{
                                base: "initial",
                                md: "grid",
                            }}
                            columns={{
                                md: 3,
                            }}
                            spacing={{
                                md: 6,
                            }}
                        >
                            <GridItem
                                colSpan={{
                                    md: 1,
                                }}
                            >
                                <VStack>
                                    <Heading fontSize="lg" fontWeight="md" lineHeight="6">
                                        Profile
                                    </Heading>
                                    <Text
                                        mt={1}
                                        fontSize="sm"
                                        color="gray.600"
                                        _dark={{
                                            color: "gray.400",
                                        }}
                                    >
                                        This information will be used to customize your dashboard.
                                    </Text>
                                </VStack>
                            </GridItem>
                            <GridItem
                                borderLeft={"1px"}
                                borderColor={"#3f444e"}
                                mt={[5, null, 0]}
                                colSpan={{
                                    md: 2,
                                }}
                            >
                                <chakra.form
                                    rounded={[null, "md"]}
                                    overflow={{
                                        sm: "hidden",
                                    }}
                                >
                                    <Stack
                                        px={4}
                                        spacing={6}
                                    >
                                        <SimpleGrid columns={3} spacing={6}>
                                            <FormControl as={GridItem} colSpan={[3, 2]}>
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color="gray.700"
                                                    _dark={{
                                                        color: "gray.50",
                                                    }}
                                                >
                                                    Main Champion
                                                </FormLabel>
                                                <InputGroup size="sm">
                                                    <Input
                                                        focusBorderColor="brand.400"
                                                        rounded="md"
                                                        value={newSummoner}
                                                        onChange={(e) => {
                                                            setNewSummoner(e.target.value)
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                        </SimpleGrid>
                                        <div>
                                            <FormControl id="email" mt={1}>
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="md"
                                                    color="gray.700"
                                                    _dark={{
                                                        color: "gray.50",
                                                    }}
                                                >
                                                    Region
                                                </FormLabel>
                                                <Select size={"sm"} placeholder='Region' onChange={event => {
                                                    setNewRegion(event.target.value);
                                                }}
                                                        value={newRegion}
                                                >
                                                    {leagueServerRegions.map((region) => (
                                                        <option key={region.abb} value={region.abb}>
                                                            {region.value}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Stack>
                                    <Box
                                        px={{
                                            base: 4,
                                            sm: 6,
                                        }}
                                        py={3}
                                        textAlign="right"
                                    >
                                        <Button
                                            fontWeight="md"
                                            onClick={updateSummonerName}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </chakra.form>
                            </GridItem>
                        </SimpleGrid>
                    </Box>
                </Box>;
            </VStack>
        </Box>
    );
}