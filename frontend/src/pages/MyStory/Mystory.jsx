import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../redux/features/ProductSlice";
import { productSchema } from "../../schema/ProductCreateSchema";
import { SlClose } from "react-icons/sl";
import { useFormik } from "formik";
import CategorySelect from "../../components/catSelect/CategorySelect";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./Datalar.scss";

const Mystory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { t } = useTranslation();
  const [supportReplies, setSupportReplies] = useState([]);


  const myStoryProducts = products.filter(
    (product) =>
      product?.author?.toLowerCase() === user?.existUser?.username?.toLowerCase()
  );

  useEffect(() => {
    const fetchUserSupport = async () => {
      const res = await axios.get(`http://localhost:5000/api/support/user/${user?.existUser?.username}`);
      setMySupportMessages(res.data);
    };
    fetchUserSupport();
  }, []);


  useEffect(() => {

    const fetchSupportReplies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/support/replied/${user?.existUser?.username}`,
          { withCredentials: true }
        );
        setSupportReplies(res.data);
      } catch (error) {
        console.error("Error fetching support replies:", error);
      }
    };

    if (user?.existUser?.username) {
      fetchSupportReplies();
    }
  }, [user?.existUser?.username]);


  useEffect(() => {
    if (editProductId) {
      const product = products.find((p) => p._id === editProductId);
      if (product) {
        setPreviewImage(`http://localhost:5000/${product.image}`);
      }
    }
  }, [editProductId, products]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/support/user/${user?.existUser?.username}`);
        setSupportReplies(res.data);
      } catch (err) {
        console.error("❌ Replied messages alınmadı:", err);
      }
    };

    fetchReplies();
  }, [user]);
  {
    supportReplies?.map((msg) => (
      <div key={msg._id} className="border p-3 mb-4 rounded">
        <h5>{msg.title}</h5>
        <p>{msg.description}</p>
        {msg.image && (
          <img
            src={`http://localhost:5000/uploads/support/${msg.image}`}
            alt="Support"
            style={{ width: "150px", borderRadius: "8px" }}
          />
        )}
        <div className="admin-reply mt-3 p-2 bg-light">
          <strong>Admin's Reply:</strong>
          <p>{msg.adminReply}</p>
        </div>
      </div>
    ))
  }


  useEffect(() => {
    myStoryProducts.forEach(async (product) => {
      try {
        const reviewResponse = await axios.get(
          `http://localhost:5000/api/reviews/${product._id}`,
          { withCredentials: true }
        );
        const reviewData = reviewResponse.data;

        const averageRating =
          reviewData.reviews && reviewData.reviews.length > 0
            ? reviewData.reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            ) / reviewData.reviews.length
            : 0;

        setReviews((prevReviews) => ({
          ...prevReviews,
          [product._id]: {
            rating: averageRating,
            reviewCount: reviewData.reviews.length,
            comments: reviewData.reviews.flatMap((r) => r.comments || []), // şərhləri də topla
          },
        }));

      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    });
  }, [myStoryProducts]);

  const {
    values,
    handleChange,
    setFieldValue,
    errors,
    resetForm,
    handleSubmit,
  } = useFormik({

    validationSchema: productSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("author", user?.existUser?.username);
      selectedCategories.forEach((cat) => {
        formData.append("categories[]", cat.value);
      });

      try {
        if (editProductId) {
          await dispatch(
            updateProduct({ id: editProductId, updatedData: formData }),
            toast.success("Your message status updated!")
          );
        } else {
          await dispatch(addProduct(formData));
          toast.success("Message sent succesfuly!");
        }
        resetForm();
        setOpen(false);
        setEditProductId(null);
        setPreviewImage("");
        setSelectedCategories([]);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setSelectedCategories(
      product.categories.map((cat) => ({ value: cat, label: cat }))
    );
    setFieldValue("image", product.image);
    setFieldValue("title", product.title);
    setFieldValue("description", product.description);

    setFieldValue("categories", product.categories);
    setOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setOpen(false);
    setEditProductId(null);
    setPreviewImage("");
    setSelectedCategories([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };
  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }


  return (

    <div className="container mt-5">
      {supportReplies.length > 0 && (
        <div className="mt-5">
          <h2>{t("supportReplies") || "Support Replies"}</h2>
          <div className="support-replies-list d-flex flex-column gap-3">
            {supportReplies.map((reply) => (
              <div key={reply._id} className="p-3 border rounded">
                <h5>{reply.title}</h5>
                <p>{reply.description}</p>
                <div className="mt-2">
                  <strong>Admin Response:</strong>
                  <p style={{ whiteSpace: "pre-line" }}>{reply.adminReply}</p>
                </div>
                <div className="text-muted mt-2">
                  {timeAgo(reply.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "110px" }}></div>
      {open && (
        <>
          <div className="overlay" onClick={handleCloseForm}></div>

          <form
            encType="multipart/form-data"
            className="form"
            onSubmit={handleSubmit}
          >
            <div className="d-flex justify-content-between">
              <h3>{editProductId ? "Edit Book" : "Create Book"}</h3>

              <SlClose onClick={handleCloseForm} className="customXBTN" />
            </div>
            <div className="form-group">
              <label htmlFor="image">{t("image")}</label>
              <div className="text-danger">{errors.image}</div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Current Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              )}

              <input
                type="file"
                id="image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">{t("title")}</label>
              <div className="text-danger">{errors.title}</div>
              <input
                type="text"
                id="title"
                className="form-control"
                onChange={handleChange}
                value={values.title}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">{t("description")}</label>
              <div className="text-danger">{errors.description}</div>
              <textarea
                id="description"
                className="form-control"
                onChange={handleChange}
                value={values.description}
              />
            </div>
            {/* <div className="form-group">
              <label htmlFor="author">Author</label>
              <div className="text-danger">{errors.author}</div>
              <input
                type="text"
                id="author"
                className="form-control"
                onChange={handleChange}
                value={values.author}
              />
            </div> */}
            <div className="form-group">
              <label htmlFor="categories">{t("categories")}</label>
              <div className="text-danger">{errors.categories}</div>
              <CategorySelect
                categories={["Romance", "Fantasy", "Horror", "Mystery", "Drama"]}
                selectedCategories={selectedCategories}
                setSelectedCategories={(categories) => {
                  setSelectedCategories(categories);
                  setFieldValue(
                    "categories",
                    categories.map((cat) => cat.value)
                  );
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {editProductId ? "Update" : "Add"}
            </button>
          </form>
        </>
      )}
      <div className="row">
        <div className="col-md-12">
          <h2 className="message-heading">{t("adminRepliedMessages")}</h2>
          {myStoryProducts.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "30px" }}>
            </p>
          ) : (
            <div className="wishlist-items d-flex flex-column gap-3">
              {myStoryProducts.map((product) => (
                <div key={product._id} className="wishlist-item row p-3">
                  <div className="col-sm-2">
                    <img
                      style={{
                        width: "100%",
                        cursor: "pointer",
                      }}
                      src={`http://localhost:5000/${product.image}`}
                      alt={product.title}
                      className="wishlist-img"
                      onClick={() => navigate(`/productdetail/${product._id}`)}
                    />
                  </div>
                  <div className="col-sm-10 d-flex flex-column justify-content-between mt-2">
                    <div className="d-flex justify-content-between ">
                      <h3 style={{ fontWeight: "bold" }}>{product.title}</h3>
                    </div>
                    <p>Author: {product.author}</p>

                    <div className="d-flex gap-1 align-items-center ">
                      Rating:{" "}
                      {reviews[product._id] ? (
                        <>
                          <div className="d-flex gap-1 align-items-center ">
                            <StarRatings
                              rating={reviews[product._id].rating}
                              starRatedColor="gold"
                              numberOfStars={5}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                            <div>
                              ({reviews[product._id].rating.toFixed(1)})
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="d-flex gap-1 align-items-center ">
                            <StarRatings
                              starRatedColor="gold"
                              numberOfStars={5}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                            <div>(0.0)</div>
                          </div>
                        </>
                      )}
                    </div>

                    {reviews[product._id]?.comments?.length > 0 && (
                      <div className="mt-2">
                        <strong>Comments:</strong>
                        <ul style={{ paddingLeft: "15px" }}>
                          {reviews[product._id].comments.map((comment) => (
                            <li key={comment._id}>
                              <strong>{comment.username}:</strong> {comment.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}


                    <p style={{ color: "#595959", marginTop: "5px" }}>
                      {product.description.length > 300
                        ? product.description.slice(0, 550) + "..."
                        : product.description}
                    </p>

                    <div
                      className="d-flex gap-2 justify-content-between"
                      style={{ color: "#595959" }}
                    >
                      <p className="d-flex gap-1">
                        Categories:
                        {product?.categories.map((cat, index) => (
                          <span key={index}>{cat}</span>
                        ))}
                      </p>
                    </div>
                    <div className="d-flex gap-2 justify-content-between mb-2 flex-wrap">
                      <div>
                        Created:{" "}
                        {new Date(product.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>

                      <div>Updated: {timeAgo(product.updatedAt)}</div>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEditProduct(product)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => dispatch(deleteProduct(product._id))}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mystory;
