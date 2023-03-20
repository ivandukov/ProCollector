import {VictoryLabel, VictoryPie, VictoryTheme} from 'victory';
import {Box, Heading} from "@chakra-ui/react";

//props with generic
type PieChartProps<T> = {
    data: T;
}

/**
 * Generic pie chart component that can be used with any type of data
 * @param props
 * @constructor
 */
export const PieChart = <T extends {}>(props: PieChartProps<T>) => {
    return (
        <>
            <Box>
                <Heading as={"h2"} fontSize="xl" fontWeight="medium" mb={2}>Game Ratio</Heading>
                <VictoryPie
                    animate={{
                        duration: 2000
                    }}
                    theme={VictoryTheme.material}
                    data={props.data as any}
                    innerRadius={100}
                    colorScale={["#8AFF89", "#FC7171"]}
                    labelComponent={<VictoryLabel labelPlacement={"perpendicular"}/>}
                    style={
                        {
                            labels: {
                                fontSize: 12,
                                fill: "white",
                            },
                        }
                    }
                />
            </Box>
        </>
    );
}