import {Configuration, DefaultApi} from "./__generated";
import React from "react";


export function useApiClient() {
    return React.useMemo(() => {
        const basePath = "http://localhost:4000";

        const config = new Configuration({basePath});
        return new DefaultApi(config, basePath);
    }, []);
}
