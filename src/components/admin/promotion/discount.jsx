import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ApDungDiscountModal from "./ApDungDiscountModal";

const fakeDiscountResponse = [
  {
    discount_id: 1,
    name: "Back friday",
    percent_value: 20,
    start_at: "2024-11-02T21:43:25Z",
    end_at: "2024-12-02T21:43:26Z",
    status: 1,
  },
  {
    discount_id: 2,
    name: "Lmao",
    percent_value: 10,
    start_at: "2024-11-02T21:43:25Z",
    end_at: "2024-12-02T21:43:26Z",
    status: 1,
  },
  {
    discount_id: 3,
    name: "Bruh bruh",
    percent_value: 20,
    start_at: "2024-11-02T21:43:25Z",
    end_at: "2024-12-02T21:43:26Z",
    status: 1,
  },
];

//api host: http://localhost:8080/api/promotion/discount HTTP/1.1
async function fetchAllDiscount() {
  let res = await axios.get("http://localhost:8080/api/promotion/discount");
  return res.data;
}
async function updateDiscount(discount) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/discount/${discount.discount_id}`,
    discount
  );
  //check res status
  if (res.status !== 200) {
    toast.error("Update discount failed");
  } else {
    toast.success("Update discount successfully");
  }
  closeModal();
  return res.data;
}
async function createDiscount(discount) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/discount`,
    discount
  );
  //check res status
  if (res.status !== 200) {
    toast.error("Create discount failed");
  } else {
    toast.success("Create discount successfully");
  }
  closeModal();
  return res.data;
}

async function deleteDiscount(discount_id) {
  //update status
  let res = await axios.post(
    `http://localhost:8080/api/promotion/discount/${discount_id}`,
    { status: 0 }
  );
  //check res status
  if (res.status !== 200) {
    toast.error("Delete discount failed");
  } else {
    toast.success("Delete discount successfully");
  }
  return res.data;
}

function closeModal() {
  let closeButton = document.getElementById("closeButton");
  if (closeButton) {
    closeButton.click();
  }
}

function Discounts() {
  const [discounts, setDiscounts] = useState(fakeDiscountResponse);
  const [item, setItem] = useState({
    discount_id: 0,
    name: "",
    percent_value: 0,
    start_at: null,
    end_at: null,
    status: 1,
  });
  const [needReload, setNeedReload] = useState(false);
  const [action, setAction] = useState("new");

  useEffect(() => {
    (async () => {
      let data = await fetchAllDiscount();
      setDiscounts(data.discounts);
    })();
  }, []);

  useEffect(() => {
    if (needReload) {
      (async () => {
        let data = await fetchAllDiscount();
        setDiscounts(data.discounts);
      })();
      setNeedReload(false);
    }
  }, [needReload]);

  function handleSubmit() {
    if (action === "new") {
      //create item
      (async () => {
        try {
          let res = await createDiscount(item);
          setNeedReload(true);
        } catch (error) {
          console.log(error);
          toast.error("Action failed");
        }
      })();
    } else {
      //submit item
      (async () => {
        try {
          let res = await updateDiscount(item);
          setNeedReload(true);
        } catch (error) {
          console.log(error);
          toast.error("Action failed");
        }
      })();
    }
  }

  function handleDeleteDiscount(discount_id) {
    return () => {
      (async () => {
        try {
          let res = await deleteDiscount(discount_id);
          setNeedReload(true);
        } catch (error) {
          console.log(error);
          toast.error("Action failed");
        }
      })();
    };
  }

  return (
    <>
      <h2>Discount</h2>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#discountModal"
        onClick={() => {
          setAction("new");
          setItem({
            discount_id: 0,
            name: "",
            percent_value: 0,
            start_at: new Date(),
            end_at: new Date(),
            status: 1,
          });
        }}
      >
        New
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Percent value</th>
            <th>Start at</th>
            <th>End at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((item) => (
            <tr key={item.discount_id}>
              <td>{item.discount_id}</td>
              <td>{item.name}</td>
              <td>{item.percent_value}</td>
              <td>{item.start_at}</td>
              <td>{item.end_at}</td>
              <td>
                <button
                  className="btn btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#discountModal"
                  onClick={() => {
                    setAction("edit");
                    setItem(item);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteDiscount(item.discount_id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#apDungKhuyenMaiModal"
                  onClick={() => setItem(item)}
                >
                  Áp dụng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="discountModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="discountModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="discountModalLabel">
                {action === "new" ? "New" : "Edit"} Discount
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {item && (
                <>
                  <div className="mb-3">
                    <label htmlFor="discountName" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="discountName"
                      value={item.name}
                      onChange={(e) =>
                        setItem({ ...item, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="discountPercent" className="form-label">
                      Percent value
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="discountPercent"
                      value={item.percent_value}
                      onChange={(e) =>
                        setItem({ ...item, percent_value: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="discountStart" className="form-label">
                      Start at
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="discountStart"
                      value={
                        new Date(item.start_at).toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setItem({ ...item, start_at: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="discountEnd" className="form-label">
                      End at
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="discountEnd"
                      value={new Date(item.end_at).toISOString().split("T")[0]}
                      onChange={(e) =>
                        setItem({ ...item, end_at: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="closeButton"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApDungDiscountModal id={"apDungKhuyenMaiModal"} discount={item} />
    </>
  );
}

export default Discounts;
