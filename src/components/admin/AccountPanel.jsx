import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Pagination from "./Pagination";
import {
  getAccountPage,
  getAllRefences,
  updateAccount,
} from "services/accountService";
import { toast } from "react-toastify";
import AccountModal from "./AccountModal";

export async function loader() {
  let allReferences = await getAllRefences();

  return { allReferences };
}

const AccountPanel = () => {
  let { allReferences } = useLoaderData();
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [search, setSearch] = useState({
    searchText: "",
    status: "all",
    role_id: "all",
    sortBy: "username",
    sortType: "asc",
  });

  const handleEdit = async (account) => {
    if (Object.keys(editingAccount).length === 0) {
      setEditingAccount(account);
      console.log(accounts);
    } else {
      let update = await updateAccount(editingAccount);
      if (!update) {
        toast.error("Update failed");
        return;
      }
      toast.success("Update success");
      setAccounts((prevAccounts) => {
        return prevAccounts.map((acc) => {
          if (acc.account_id === account.account_id) {
            return editingAccount;
          }
          return acc;
        });
      });
      setEditingAccount({});
    }
  };

  useEffect(() => {
    getAccountPage({
      currentPage: pagination.currentPage,
      itemsPerPage: pagination.itemsPerPage,
      searchText: search.searchText,
      status: search.status,
      role_id: search.role_id,
      sortBy: search.sortBy,
      sortType: search.sortType,
    }).then((res) => {
      console.log(res);
      setAccounts(res.accounts);
      setPagination({
        ...pagination,
        total_page: res.pagination.totalPages,
      });
    });
  }, [pagination.currentPage, search]);

  return (
    <div>
      <h1>Accounts</h1>
      <form className="row mb-3">
        <input
          className="col"
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearch({ ...search, searchText: e.target.value });
            setPagination((prev) => {
              return { ...prev, currentPage: 1 };
            });
          }}
        />
        <select
          className="form-select col"
          name="status"
          defaultValue={""}
          onChange={(e) => {
            setSearch({ ...search, status: e.target.value });
            setPagination((prev) => {
              return { ...prev, currentPage: 1 };
            });
          }}
        >
          <option value="all">Tất cả status</option>
          <option value="1">Active</option>
          <option value="0">Lock</option>
        </select>
        <select
          className="form-select col"
          name="role"
          defaultValue={"all"}
          onChange={(e) => {
            setSearch({ ...search, role_id: e.target.value });
            setPagination((prev) => {
              return { ...prev, currentPage: 1 };
            });
          }}
        >
          <option value="all">Tất cả vai trò</option>
          {allReferences.roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_name}
            </option>
          ))}
        </select>
      </form>
      <table className="table sortable table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th
              onClick={() => {
                let newSortType = search.sortType === "asc" ? "desc" : "asc";
                setSearch({
                  ...search,
                  sortBy: "username",
                  sortType: newSortType,
                });
              }}
            >
              Username <i className="fa-solid fa-sort"></i>
            </th>
            <th
              onClick={() => {
                let newSortType = search.sortType === "asc" ? "desc" : "asc";
                setSearch({
                  ...search,
                  sortBy: "email",
                  sortType: newSortType,
                });
              }}
            >
              Email <i className="fa-solid fa-sort"></i>
            </th>
            <th
              onClick={() => {
                let newSortType = search.sortType === "asc" ? "desc" : "asc";
                setSearch({
                  ...search,
                  sortBy: "phone_number",
                  sortType: newSortType,
                });
              }}
            >
              Phone Number <i className="fa-solid fa-sort"></i>
            </th>
            <th
              onClick={() => {
                let newSortType = search.sortType === "asc" ? "desc" : "asc";
                setSearch({
                  ...search,
                  sortBy: "last_login",
                  sortType: newSortType,
                });
              }}
            >
              Last Login <i className="fa-solid fa-sort"></i>
            </th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.account_id}>
              <td>{account.account_id}</td>
              <td>{account.username}</td>
              <td>{account.email}</td>
              <td>{account.phone_number}</td>
              <td>{new Date(account.last_login).toLocaleDateString()}</td>
              <td>{account.status === 1 ? "Active" : "Lock"}</td>
              <td>{account.role?.role_name}</td>
              <td>
                {/* <button
                  onClick={() => {
                    handleEdit(account);
                  }}
                >
                  {account.account_id === editingAccount.account_id
                    ? "Save"
                    : "Edit"}
                </button>
                {account.account_id === editingAccount.account_id && (
                  <button
                    onClick={() => {
                      setEditingAccount({});
                    }}
                  >
                    Cancel
                  </button>
                )} */}
                <button
                  type="button"
                  className="btn btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#accountModal"
                  onClick={() => {
                    setEditingAccount(account);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={pagination.currentPage}
        setPage={(page) => {
          setPagination((prev) => {
            return { ...prev, currentPage: page };
          });
        }}
        total_page={pagination.total_page}
      />
      <AccountModal
        id="accountModal"
        account={editingAccount}
        roles={allReferences.roles}
        setAccount={setEditingAccount}
        setAccounts={setAccounts}
      />
    </div>
  );
};

export default AccountPanel;
