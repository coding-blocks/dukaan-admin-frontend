import {axios} from "../DukaanAPI";

export const getAllCenters = () => {
    return axios.get(`/api/v2/admin/centers`)
}
