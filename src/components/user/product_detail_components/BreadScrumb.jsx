import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function BreadScumb({ genreId }) {
  const [genres, sstGenres] = useState({});
  const [breadScrum, setBreadScrum] = useState([]);
  const breadScrumTemp = [];

  // Mẫu chứa breadscrum
  // {
  //   genreId: {genreName: "", parent_id: ""}
  // }

  // Lay genre tuong ung voi productId
  useEffect(() => {
    const fetchGenres = async () => {
      const getGenres = async () => {
        return await axios
          .get(
            `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/detail-product/genre`
          )
          .then((res) => res.data);
      };

      const resultOfGenres = await getGenres();

      const newGenres = {};
      resultOfGenres.genres.forEach((item) => {
        newGenres[item.genre_id] = {
          genreName: item.name,
          parentId: item.parent_id,
        };
      });
      sstGenres(newGenres);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    handleBreadScrum(genreId);
    setBreadScrum(breadScrumTemp);
  }, [genres]);

  const handleBreadScrum = (id) => {
    if (genres[id]) {
      breadScrumTemp.unshift(genres[id].genreName);
      handleBreadScrum(genres[id].parentId);
    } else {
      breadScrumTemp.unshift("Home");
      return;
    }
  };

  return (
    <div className="breadscumb-content">
      <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
        <ol className="breadcrumb">
          {breadScrum.length > 0
            ? breadScrum.map((item) => {
                return (
                  <li className="breadcrumb-item">
                    {item === "Home" ? (
                      <a href="/">{item}</a>
                    ) : (
                      <a href={`/products?category=${item}`}>{item}</a>
                    )}
                  </li>
                );
              })
            : console.log("Khong thanh cong")}
        </ol>
      </nav>
    </div>
  );
}

export default BreadScumb;
