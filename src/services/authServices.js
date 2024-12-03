//support auth api

import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

export const loginWithToken = async (token) => {
  //add token to request header
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};
