import axios from "axios";

const getOrders = async () => {
    return (await axios.get(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/order-confirmation/orders`
    ).then((res) => res.data));
}

const updateConfirm = async (orderId, status) => {
    return (await axios.put(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/order-confirmation/confirm`, { orderId, status }
    ).then((res) => res.data));
}

export {
    getOrders,
    updateConfirm
}