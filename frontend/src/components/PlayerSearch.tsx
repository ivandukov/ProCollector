import {Flex, Input, InputGroup, InputRightElement, Select, useToast} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {useReducer, useState} from "react";
import {useNavigate} from "react-router-dom";
import {leagueServerRegions} from "../helper/Regions";

/**
 * Represents the minimum information about a searched player
 */
export type PlayerSearchType = {
    playerName: string,
    region: string | null,
}

export const PlayerSearch = () => {

    const [playerSearchState] = useState<PlayerSearchType>({
        playerName: "",
        region: null
    })

    const reducer = (state: PlayerSearchType, action: any) => {
        switch (action.type) {
            case "playerName":
                return {...state, playerName: action.payload};
            case "region":
                return {...state, region: action.payload};
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, playerSearchState);
    const navigate = useNavigate();
    const toast = useToast();

    const search = () => {
        if (state.playerName.length > 0 && state.region != null) {
            navigate("/search", {state: state});
        } else {
            toast({
                title: 'Error',
                description: "Server and player name are required",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    };

    return (
        <>
            <Flex
                width={{
                    xl: "810px",
                    md: "full",
                }}
                margin={{
                    xl: "0 auto",
                }}
                flexDirection={["column", "column", "row"]}
            >
                <Select size={"lg"} placeholder='Region' width={"20%"} onChange={event => {
                    dispatch({type: "region", payload: event.target.value})
                }}>
                    {leagueServerRegions.map((region) => (
                        <option key={region.abb} value={region.abb}>
                            {region.value}
                        </option>
                    ))}
                </Select>
                <InputGroup>
                    <Input
                        placeholder='Player Name'
                        size='lg'
                        value={state.playerName}
                        onChange={event => {
                            dispatch({type: "playerName", payload: event.target.value})
                        }}
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                search();
                            }
                        }
                        }
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
                                search();
                            }}
                        />}
                    />
                </InputGroup>
            </Flex>
        </>
    );

}