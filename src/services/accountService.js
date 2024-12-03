import axios from "axios";

export async function getAccountPage({
  currentPage = 1,
  itemsPerPage = 3,
  searchText = "",
  status = "all",
  role_id = "all",
  sortBy = "username",
  sortType = "asc",
}) {
  return axios
    .get("http://localhost:8080/api/account", {
      params: {
        currentPage,
        itemsPerPage,
        searchText,
        status,
        role_id,
        sortBy,
        sortType,
      },
    })
    .then((res) => res.data);
}

export async function getAllRefences() {
  return axios
    .get("http://localhost:8080/api/account/references")
    .then((res) => res.data);
}

export async function updateAccount(account) {
  return axios
    .post(`http://localhost:8080/api/account/${account.account_id}`, account)
    .then((res) => res.data);
}
