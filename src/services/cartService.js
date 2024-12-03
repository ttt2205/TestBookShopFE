import axios from "axios";

const getAllBillPromotions = async () => {
    return (await axios.get(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/cart/promotion`
    ));
}

const insertOrder = async (orders) => {
    return (await axios.post(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/cart/order`, orders
    ));
}

export {
    getAllBillPromotions,
    insertOrder
}