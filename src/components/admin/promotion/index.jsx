import { useState } from "react";
import Discounts from "./discount";
import Promotions from "./promotion";

const Index = () => {
  const [panel, setPanel] = useState("promotion");
  return (
    <div>
      <div className="d-inline-flex">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            onChange={(e) => setPanel("promotion")}
            defaultChecked={true}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            Promotion
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            onChange={(e) => setPanel("discount")}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            Discount
          </label>
        </div>
      </div>
      {panel === "promotion" && <Promotions key={"promotion"} />}
      {panel === "discount" && <Discounts key={"discount"} />}
    </div>
  );
};

export default Index;
