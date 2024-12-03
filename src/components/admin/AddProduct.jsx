import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import { useState } from "react";
import {
  getProductById,
  updateProduct,
  getAllReferences,
  createProduct,
} from "services/productServices";
import { toast } from "react-toastify";
import ImageCarousel from "components/admin/ImageCarousel";

export async function loader({ params }) {
  const allReferences = await getAllReferences();
  console.log(allReferences);
  return { allReferences };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  // Lấy tất cả các file từ input file (giả sử input có tên "images")
  const newImages = formData.getAll("new_images"); // Thay "images" bằng tên của input file
  console.log(newImages);
  const updates = Object.fromEntries(formData);
  console.log(updates);
  // return null;
  try {
    await createProduct(formData);
    toast.success("Add product success");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }

  return redirect(`/dashboard/products/`);
}

export default function EditProduct() {
  const { allReferences } = useLoaderData();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const submit = useSubmit();

  const validate = (form) => {
    const newErrors = {};
    // Lấy giá trị từ các input và kiểm tra tính hợp lệ
    const title = form.title.value.trim();
    const numPage = form.num_page.value.trim();
    const size = form.size.value.trim();
    const weight = form.weight.value.trim();
    const publication_year = form.publication_year.value.trim();
    const images = form.new_images.files;
    const author_id = form.author_id.value;
    //regex
    const sizeRegex = /^\d{1,3}x\d{1,3}[A-Za-z]{2}$/;

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!numPage || isNaN(numPage)) {
      newErrors.num_page = "Number of pages must be a number";
    }
    if (numPage < 0) {
      newErrors.num_page = "Number of pages must be greater than 0";
    }
    if (sizeRegex.test(size) === false) {
      newErrors.size = "Size format is invalid, ex: 100x200cm";
    }
    if (weight < 0 || weight === "") {
      newErrors.weight = "Weight must be greater than 0";
    }
    if (publication_year < 0) {
      newErrors.publication_year = "Publication year must be greater than 0";
    }
    if (images.length === 0) {
      newErrors.images = "At least 1 image is required";
    }
    if (author_id.length === 0) {
      newErrors.author_id = "At least 1 author is required";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let newErrors = validate(event.currentTarget);
    // Nếu có lỗi, hiển thị thông báo lỗi
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Lỗi nhập liệu, vui lòng kiểm tra lại");
    } else {
      setErrors({});
      submit(formData, { method: "post", encType: "multipart/form-data" });
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit} className="bold-label-form">
      <div className="row">
        <div className="col col-md-auto col-lg-6">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" name="title" />
            {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
          </div>
          <div className="row">
            <div className="form-group col">
              <label className="form-label">Num Page</label>
              <input type="number" className="form-control" name="num_page" />
              {errors.num_page && (
                <p style={{ color: "red" }}>{errors.num_page}</p>
              )}
            </div>
            <div className="form-group col">
              <label className="form-label">Size</label>
              <input type="text" className="form-control" name="size" />
              {errors.size && <p style={{ color: "red" }}>{errors.size}</p>}
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label className="form-label">Weight</label>
              <input type="text" className="form-control" name="weight" />
              {errors.weight && <p style={{ color: "red" }}>{errors.weight}</p>}
            </div>
            <div className="form-group col">
              <label className="form-label">Publication Year</label>
              <input
                type="number"
                className="form-control"
                name="publication_year"
              />
              {errors.publication_year && (
                <p style={{ color: "red" }}>{errors.publication_year}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status_id">
                {allReferences.bookstatus.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col form-group">
              <label className="form-label">Language</label>
              <select className="form-select" name="language_id">
                {allReferences.languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.language_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col form-group">
              <label className="form-label">Publisher</label>
              <select className="form-select" name="publisher_id">
                {allReferences.publishers.map((publisher) => (
                  <option
                    key={publisher.publisher_id}
                    value={publisher.publisher_id}
                  >
                    {publisher.name}
                  </option>
                ))}
              </select>
              {errors.publisher_id && (
                <p style={{ color: "red" }}>{errors.publisher_id}</p>
              )}
            </div>
            <div className="col form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" name="genre_id">
                {allReferences.genres.map((genre) => {
                  let parent = allReferences.genres.find(
                    (g) => g.genre_id === genre.parent_id
                  );
                  return (
                    <option key={genre.genre_id} value={genre.genre_id}>
                      {parent ? `${parent.name} - ` : ""} {genre.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col form-group">
              <label className="form-label">Discount</label>
              <select
                className="form-select"
                name="discount_id"
                multiple={true}
                size={3}
              >
                {allReferences.discounts.map((discount) => (
                  <option
                    key={discount.discount_id}
                    value={discount.discount_id}
                  >
                    {`${discount.name} (${discount.percent_value}%)`}
                  </option>
                ))}
              </select>
            </div>
            <div className="col form-group">
              <label className="form-label">Authors</label>
              <select
                className="form-select"
                multiple={true}
                size={3}
                name="author_id"
              >
                {allReferences.authors.map((author) => (
                  <option key={author.author_id} value={author.author_id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.author_id && (
                <p style={{ color: "red" }}>{errors.author_id}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col col-md-auto col-lg-6 d-flex flex-column">
          <ImageCarousel
            product={null}
            deletedImages={[]}
            setDeletedImages={() => {}}
            errors={errors}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col form-group">
          <label className="form-label">Cover Format</label>
          <select className="form-select" name="cover_format_id">
            {allReferences.coverformats.map((coverformat) => (
              <option key={coverformat.cover_id} value={coverformat.cover_id}>
                {coverformat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col form-group">
          <label className="form-label">Description</label>
          <textarea type="text" className="form-control" name="decription" />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <button
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      >
        Cancel
      </button>
    </Form>
  );
}
