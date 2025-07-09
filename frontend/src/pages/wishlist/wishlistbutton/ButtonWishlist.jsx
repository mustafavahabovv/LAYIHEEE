import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToWishlist, updateWishlistStatus } from "../../../redux/features/WishlistSlice";
import "./Wishlistbutton.css";
import axios from "axios"; // ✅ ADD: Stripe üçün lazım
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";


const ButtonWishlist = ({ productId }) => {
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const userId = user?.existUser?._id;

  const [selectedStatus, setSelectedStatus] = useState(null);

  const currentStatus = wishlist.find(item => item?.product?._id === productId)?.status || null;

  const navigate = useNavigate();


  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  if (!userId) return null;

  const handleStatusChange = (status) => {
    if (currentStatus && currentStatus === status) {
      toast.info("This movie is already in your wishlist with the selected status.");
      return;
    }

    if (currentStatus) {
      dispatch(updateWishlistStatus({ userId, productId, status }));
      toast.success("Wishlist status updated!");
    } else {
      dispatch(addToWishlist({ userId, productId, status }));
      toast.success("Movie added to wishlist!");
    }

    setSelectedStatus(status);
  };

  // ✅ ADD: Ödəniş funksiyası
  const handlePayment = () => {
    navigate("/payment", {
      state: {
        productId,
        amount: 10, // Əgər məhsulun qiyməti varsa, onu ötür
      },
    });
  };


  return (
    <div className="d-flex flex-column gap-2">

      {/* 💳 Ödəniş düyməsi yalnız alreadyRead olduqda çıxır */}
      {selectedStatus === "alreadyRead" && (
        <button className="btn btn-warning" onClick={handlePayment}>
          💳 Ödəniş Et
        </button>
      )}

      <div className="d-flex gap-2 flex-wrap">
        <button
          onClick={() => handleStatusChange("wantToRead")}
          className={`btn ${selectedStatus === "wantToRead" ? "btn-success" : "btn-outline-success"}`}
        >
          {selectedStatus === "wantToBuy"
            ? `✅ ${t("wantToBuy")}`
            : t("wantToBuy")}
        </button>

        <button
          onClick={() => {
            handleStatusChange("alreadyRead");
          }}
          className={`btn ${selectedStatus === "toBeBought" ? "btn-success" : "btn-outline-success"}`}
        >
          {selectedStatus === "toBeBought"
            ? `✅ ${t("toBeBought")}`
            : t("toBeBought")}
        </button>
      </div>
    </div>
  );

};

export default ButtonWishlist;
