import axios from "axios";

export async function postRegisterCustomer(customerInfo) {
    return (await axios.post(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/customer/register`, customerInfo
    ).then(res => res.data));
}

export async function getCustomerInfoByEmail(email, token) {
    return (await axios.get(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/customer/info`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { email: email },
        }
    ));
}

export async function updateCustomerInfo(data, token) {
    return (await axios.put(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/customer/update`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    ));
}