import {iAxios} from "@/api/http";

export const xhprofFetchList = ({
    uri,
    domain,
    minCost,
    maxCost,
    sort,
    page
}) => {
    return iAxios.get('/xhprof/index', {
        params: {
            uri,
            domain,
            minCost,
            maxCost,
            sort,
            page
        }
    })
}

export const xhprofFetchItem = ({
    id
}) => {
    return iAxios.get('/xhprof/item', {
        params: {
            id
        }
    })
}
