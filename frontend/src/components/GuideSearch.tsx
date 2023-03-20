import {Input, InputGroup, InputRightElement, useToast} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import React from "react";
import {useApiClient} from "../adapter/api/useApiClient";
import {useNavigate} from "react-router-dom";

export const GuideSearch = () => {

    const toast = useToast();
    const api = useApiClient();
    const [search, setSearch] = React.useState("");
    const navigate = useNavigate();

    /**
     * @name  searchGuide
     * @brief searches the Database for a
     *        Guide that the User typed in
     */
    const searchGuide = async () => {
        const res = await api.guidesTitleAllUsersGet(search);
        if (res.data.length === 0) {
            toast({
                title: "Error",
                description: "No guides with this name found",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        navigate("/public/guides/search", {state: res.data});
    }

    return (
        <>
            <InputGroup>
                <Input placeholder='Search Guides'
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       onKeyPress={event => {
                           if (event.key === "Enter") {
                               searchGuide();
                           }
                       }}
                />
                <InputRightElement
                    height={"100%"}
                    children={<SearchIcon
                        _hover={
                            {
                                transform: "scale(1.2)",
                                transition: "transform 0.2s ease-in-out",
                                color: "gray.500",
                            }
                        }
                        onClick={() => {
                            searchGuide(); // when search button is pressed, search for a guide in database
                        }}
                    />}
                />
            </InputGroup>
        </>
    );
}
