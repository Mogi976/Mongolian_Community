import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Categories from "./Categories";
import { FaTrash, FaEdit, FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";

const Home = ({ searchQuery, selectedState, setZoom }) => {
  const { isLoggedIn, user } = useAuth(); // Access isLoggedIn and user from AuthContext
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState([]); // State to store businesses
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();
  console.log("searchQuery: ", searchQuery);
  // Inline styles for categories
  const styles = {
    categoriesContainer: {
      display: "flex",
      gap: "20px",
      padding: "10px 0",
      overflowX: "auto",
      whiteSpace: "nowrap",
    },
    categoryItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "gray",
      minWidth: "80px",
    },
    categoryItemActive: {
      color: "black",
      fontWeight: "bold",
      textDecoration: "underline",
      textDecorationThickness: "4px", // Makes the underline bolder
      // textUnderlineOffset: "3px", // Adjusts the distance of the underline
    },
    categoryItemText: {
      margin: "5px 0 0",
      fontSize: "12px",
    },
    cardImageContainer: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "10px",
    },
    cardImage: {
      height: "200px",
      objectFit: "cover",
      transition: "transform 0.3s ease", // Smooth zoom effect
    },
    cardImageHover: {
      transform: "scale(1.1)", // Zoom in effect
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "16px",
      marginBottom: "20px",
    },
  };

  // Fetch businesses from Firestore
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "businesses"));
        const businessList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusinesses(businessList);
        setZoom(8);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  // Filter businesses by category or favorites
  const filteredBusinesses = businesses.filter((business) => {
    const matchesCategory =
      filterCategory === "" || 
      (filterCategory === "Favorite" ? business.isFavorite : business.category === filterCategory);
    const matchesSearch =
      !searchQuery ||
      business?.businessTitle?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      business?.businessDescription?.toLowerCase().includes(searchQuery?.toLowerCase());
    const matchesState =
      !selectedState || business?.state === selectedState;
    return matchesCategory && matchesSearch && matchesState;
  });

  // Handle delete business
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "businesses", id));
      setBusinesses((prev) => prev.filter((business) => business.id !== id));
      alert("Business deleted successfully.");
    } catch (error) {
      console.error("Error deleting business:", error);
      alert("Failed to delete business. Please try again.");
    }
  };

  // Handle toggle favorite
  const handleFavorite = async (id, isFavorite) => {
    try {
      const businessRef = doc(db, "businesses", id);
      await updateDoc(businessRef, { isFavorite: !isFavorite });
      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === id ? { ...business, isFavorite: !isFavorite } : business
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <Categories
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        styles={styles}
      />
      <div className="row">
        {filteredBusinesses.map((business) => (
          <div className="col-md-4 mb-4" key={business.id} onClick={() => navigate(`/business/${business.id}`)} style={{ cursor: "pointer" }}>
            <div className="card" style={{ border: "none", height: "300px" }}>
              <div
                style={styles.cardImageContainer}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("img").style.transform = "scale(1)";
                }}
              >
                {business.imageBase64 && (
                  <img
                    src={business.imageBase64}
                    className="card-img-top"
                    alt={business.businessTitle}
                    style={styles.cardImage}
                  />
                )}
                {business.isFavorite ? (
                  <FaHeart
                    className="position-absolute top-0 end-0 m-2 text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFavorite(business.id, true)}
                  />
                ) : (
                  <FaRegHeart
                    className="position-absolute top-0 end-0 m-2 text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFavorite(business.id, false)}
                  />
                )}
              </div>
              <div>
                <h5 className="card-title">{business.businessTitle}</h5>
                <p className="card-text">{business.contact}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="card-text mb-0">
                    {business.city}, {business.state}
                  </p>
                  {isLoggedIn && user?.uid === business.createdBy && (
                    <div className="d-flex">
                      <FaEdit
                        className="text-primary me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/business/${business.id})`)}
                      />
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(business.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;