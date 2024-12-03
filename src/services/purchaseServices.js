import axios from "axios";

export const getPage = async ({
  page,
  limit,
  q,
  searchBy,
  orderBy,
  orderType,
  startDate,
  endDate,
  startTotal,
  endTotal,
  provider_id,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(`http://localhost:8080/api/purchase`, {
        params: {
          page: page || 1,
          limit: limit || 10,
          q: q || "",
          searchBy: searchBy || "all",
          orderBy: orderBy || "createdAt",
          orderType: orderType || "desc",
          startDate: startDate || "",
          endDate: endDate || "",
          startTotal: startTotal || "",
          endTotal: endTotal || "",
          provider_id: provider_id || "",
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getReceiptById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/purchase/${id}`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createReceipt = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log("service: ", data);
    try {
      let response = await axios.post(
        `http://localhost:8080/api/purchase`,
        data
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllProviders = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(`http://localhost:8080/api/provider/all`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
