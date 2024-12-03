import { toast } from "react-toastify";
import { updateAccount } from "../../services/accountService";

const Modal = ({ id, account, roles, setAccounts, setAccount }) => {
  const handleSubmit = async () => {
    let update = await updateAccount(account);
    if (!update) {
      toast.error("Update failed");
      return;
    }
    toast.success("Update success");
    setAccounts((prevAccounts) => {
      return prevAccounts.map((acc) => {
        if (acc.account_id === account.account_id) {
          return account;
        }
        return acc;
      });
    });
  };

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Edit Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form className="">
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={account.username}
                  value={account.username}
                  onChange={(e) => {
                    setAccount({
                      ...account,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue={account.email}
                  value={account.email}
                  onChange={(e) => {
                    setAccount({
                      ...account,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="*****"
                  autoComplete="off"
                  defaultValue={""}
                  onChange={(e) => {
                    setAccount({
                      ...account,
                      password: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone number</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={account.phone_number}
                  value={account.phone_number}
                  onChange={(e) => {
                    setAccount({
                      ...account,
                      phone_number: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last login</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={new Date(
                    account.last_login
                  ).toLocaleDateString()}
                  value={new Date(account.last_login).toLocaleDateString()}
                  disabled
                />
              </div>
              <div className="row">
                <div className="col">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select col"
                    defaultValue={account.status}
                    value={account.status}
                    onChange={(e) => {
                      setAccount({
                        ...account,
                        status: e.target.value,
                      });
                    }}
                  >
                    <option value="1">Active</option>
                    <option value="0">Lock</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    defaultValue={account.role_id}
                    value={account.role_id}
                    onChange={(e) => {
                      setAccount({
                        ...account,
                        role_id: e.target.value,
                        role: roles.find(
                          (role) => role.role_id === parseInt(e.target.value)
                        ),
                      });
                    }}
                  >
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
