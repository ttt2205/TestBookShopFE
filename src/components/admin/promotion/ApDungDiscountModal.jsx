import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";

const genresData = [
  {
    genre_id: 1,
    name: "Fiction",
    parent_id: null,
  },
  {
    genre_id: 2,
    name: "Science Fiction",
    parent_id: 1,
  },
  {
    genre_id: 3,
    name: "Fantasy",
    parent_id: 1,
  },
  {
    genre_id: 4,
    name: "Mystery",
    parent_id: 1,
  },
  {
    genre_id: 5,
    name: "Romance",
    parent_id: 1,
  },
  {
    genre_id: 6,
    name: "Horror",
    parent_id: 1,
  },
  {
    genre_id: 7,
    name: "Non-Fiction",
    parent_id: null,
  },
  {
    genre_id: 8,
    name: "Biography",
    parent_id: 7,
  },
  {
    genre_id: 9,
    name: "History",
    parent_id: 7,
  },
  {
    genre_id: 10,
    name: "Science",
    parent_id: 7,
  },
  {
    genre_id: 11,
    name: "Self-Help",
    parent_id: 7,
  },
];

async function fetchAllGenres() {
  let res = await axios.get("http://localhost:8080/api/promotion/genre");
  if (res.status !== 200) {
    toast.error("Fetch genres failed");
  }
  return res.data;
}

async function applyDiscount(discount, genres) {
  let res = await axios.post(
    `http://localhost:8080/api/promotion/apply-discount/${discount.discount_id}`,
    { genres }
  );
  if (res.status !== 200) {
    toast.error("Apply discount failed");
  } else {
    toast.success("Apply discount successfully");
  }
  return res.data;
}

function Modal({ id, discount }) {
  // const [genres, setGenres] = useState(genresData);
  const [genreTree, setGenreTree] = useState(
    genresData
      .filter((genre) => genre.parent_id === null)
      .map((genre) => {
        let children = genresData
          .filter((g) => g.parent_id === genre.genre_id)
          .map((i) => ({
            ...i,
            isChecked: false,
          }));
        return { ...genre, children, isChecked: false };
      })
  );

  const handleChangeParent = (e, genre_id) => {
    const newGenreTree = genreTree.map((genre) => {
      if (genre.genre_id === genre_id) {
        const updatedChildren = genre.children.map((child) => ({
          ...child,
          isChecked: e.target.checked,
        }));
        return {
          ...genre,
          isChecked: e.target.checked,
          children: updatedChildren,
        };
      }
      return { ...genre }; // Đảm bảo sao chép từng đối tượng
    });

    setGenreTree(newGenreTree);
  };

  const handleChangeChild = (e, parent_id, child_id) => {
    const newGenreTree = genreTree.map((genre) => {
      if (genre.genre_id === parent_id) {
        const updatedChildren = genre.children.map((child) => {
          if (child.genre_id === child_id) {
            return { ...child, isChecked: e.target.checked };
          }
          return { ...child };
        });

        // Nếu tất cả các con được chọn, chọn cả cha. Nếu không, bỏ chọn cha.
        const allChecked = updatedChildren.every((child) => child.isChecked);
        return {
          ...genre,
          isChecked: allChecked,
          children: updatedChildren,
        };
      }
      return { ...genre }; // Sao chép các genre khác
    });

    setGenreTree(newGenreTree);
  };

  const handleSubmit = () => {
    if (!discount) {
      console.log("Discount is required");
      return;
    }
    const selectedGenres = genreTree
      .map((genre) => {
        if (genre.children.length > 0) {
          return genre.children
            .filter((child) => child.isChecked)
            .map((child) => child.genre_id);
        } else {
          return genre.genre_id;
        }
      })
      .flat();

    try {
      applyDiscount(discount, selectedGenres);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let data = await fetchAllGenres();
        let genres = data.genres;
        setGenreTree(
          genres
            .filter((genre) => genre.parent_id === null)
            .map((genre) => {
              let children = genres
                .filter((g) => g.parent_id === genre.genre_id)
                .map((i) => ({
                  ...i,
                  isChecked: false,
                }));
              return { ...genre, children, isChecked: false };
            })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Apply Discount
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Áp dụng khuyến mãi{" "}
              <b>
                {discount && `${discount.name} với mã ${discount.discount_id}`}
              </b>{" "}
              cho:
            </p>
            {genreTree &&
              genreTree.map((genre) => (
                <div key={genre.genre_id} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id={`default-${genre.genre_id}`}
                    label={genre.name}
                    style={{ fontWeight: "bold" }}
                    onChange={(e) => handleChangeParent(e, genre.genre_id)}
                    checked={genre.isChecked} // Sử dụng `checked` thay vì `value`
                  />
                  <div className="card-body">
                    {genre.children &&
                      genre.children.map((child) => (
                        <Form.Check
                          type="checkbox"
                          id={`default-${child.genre_id}`}
                          label={child.name}
                          style={{ marginLeft: "20px" }}
                          checked={child.isChecked} // Sử dụng `checked` thay vì `value`
                          key={child.genre_id}
                          onChange={(e) =>
                            handleChangeChild(e, genre.genre_id, child.genre_id)
                          }
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit()}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
