import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const fakePromotionResponse = [
  {
    billPromotion_id: 1,
    name: "Black fire day",
    conditional: 40000,
    type: "Phan tram",
    value: 10,
  },
  {
    billPromotion_id: 2,
    name: "Bulul",
    conditional: 100000,
    type: "Truc tiep",
    value: 10000,
  },
];

//api host: http://localhost:8080/api/promotion/bill-promotion HTTP/1.1
async function fetchAllPromotion() {
  let res = await axios.get(
    "http://localhost:8080/api/promotion/bill-promotion"
  );
  return res.data;
}
async function updatePromotion(promotion) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/bill-promotion/${promotion.billPromotion_id}`,
    promotion
  );
  if (res.status !== 200) {
    toast.error("Update promotion failed");
  } else {
    toast.success("Update promotion successfully");
  }
  closeModal();
  return res.data;
}
async function createPromotion(promotion) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/bill-promotion`,
    promotion
  );
  if (res.status !== 200) {
    toast.error("Create promotion failed");
  } else {
    toast.success("Create promotion successfully");
  }
  closeModal();
  return res.data;
}

async function deletePromotion(promotion_id) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/bill-promotion/${promotion_id}`,
    { status: 0 }
  );
  if (res.status !== 200) {
    toast.error("Delete promotion failed");
  } else {
    toast.success("Delete promotion successfully");
  }
  return res.data;
}

function closeModal() {
  let closeButton = document.getElementById("closeButton");
  if (closeButton) {
    closeButton.click();
  }
}

function Promotion() {
  const [promotions, setPromotions] = useState(fakePromotionResponse);
  const [item, setItem] = useState({
    billPromotion_id: 0,
    name: "",
    conditional: 0,
    type: "",
    value: 0,
  });
  const [needReload, setNeedReload] = useState(false);
  const [action, setAction] = useState("new");

  useEffect(() => {
    (async () => {
      let data = await fetchAllPromotion();
      setPromotions(data.promotions);
    })();
  }, []);

  useEffect(() => {
    if (needReload) {
      (async () => {
        let data = await fetchAllPromotion();
        setPromotions(data.promotions);
      })();
      setNeedReload(false);
    }
  }, [needReload]);

  function handleSubmit() {
    if (action === "new") {
      (async () => {
        try {
          let res = await createPromotion(item);
          setNeedReload(true);
        } catch (error) {
          console.log(error);
          toast.error("Action failed");
        }
      })();
    } else {
      (async () => {
        try {
          let res = await updatePromotion(item);
          setNeedReload(true);
        } catch (error) {
          console.log(error);
          toast.error("Action failed");
        }
      })();
    }
  }

  function handleDeletePromotion(promotion_id) {
    return () => {
      (async () => {
        try {
          let res = await deletePromotion(promotion_id);
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
      <h2>Promotion</h2>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#promotionModal"
        onClick={() => {
          setAction("new");
          setItem({
            billPromotion_id: 0,
            name: "",
            conditional: 0,
            type: "",
            value: 0,
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
            <th>Type</th>
            <th>Value</th>
            <th>Condition</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((item) => (
            <tr key={item.billPromotion_id}>
              <td>{item.billPromotion_id}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.value}</td>
              <td>{item.conditional}</td>
              <td>
                <button
                  className="btn btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#promotionModal"
                  onClick={() => {
                    setAction("edit");
                    setItem(item);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeletePromotion(item.billPromotion_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="promotionModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="promotionModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="promotionModalLabel">
                {action === "new" ? "New" : "Edit"} Promotion
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
                    <label htmlFor="promotionName" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="promotionName"
                      value={item.name}
                      onChange={(e) =>
                        setItem({ ...item, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promotionType" className="form-label">
                      Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="promotionType"
                      value={item.type}
                      onChange={(e) =>
                        setItem({ ...item, type: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promotionValue" className="form-label">
                      Value
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="promotionValue"
                      value={item.value}
                      onChange={(e) =>
                        setItem({ ...item, value: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promotionCondition" className="form-label">
                      Condition
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="promotionCondition"
                      value={item.conditional}
                      onChange={(e) =>
                        setItem({ ...item, conditional: e.target.value })
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
    </>
  );
}

export default Promotion;
