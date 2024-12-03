import axios from "axios";

export async function getDetailProductDataService(productId) {
    return (await axios.get(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/detail-product/product?id=${productId}`
    ));
}

export async function getImagesForThumbnail(productId) {
    return (await axios.get(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/detail-product/images-thumbnail?id=${productId}`
    ));
}

export async function getRelatedProductDataService(productId, genreId) {
    return (await axios.get(`${process.env.REACT_APP_BACK_END_LOCALHOST}/api/detail-product/related-product?id=${productId}&genreId=${genreId}`))
}

