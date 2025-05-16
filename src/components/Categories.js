import React from "react";
import {
  FaStar,
  FaGraduationCap,
  FaDumbbell,
  FaBuilding,
  FaUtensils,
  FaCut,
  FaBell,
  FaShoppingBag,
  FaFutbol,
  FaLaptop,
  FaPlane,
  FaEllipsisH,
  FaHeart,
} from "react-icons/fa";

const Categories = ({ filterCategory, setFilterCategory, styles }) => {
  const categories = [
    { name: "All", icon: <FaStar size={24} />, value: "" },
    { name: "Education", icon: <FaGraduationCap size={24} />, value: "Education" },
    { name: "Gym", icon: <FaDumbbell size={24} />, value: "Gym" },
    { name: "Hotel", icon: <FaBuilding size={24} />, value: "Hotel" },
    { name: "Restaurant", icon: <FaUtensils size={24} />, value: "Restaurant" },
    { name: "Salon", icon: <FaCut size={24} />, value: "Salon" },
    { name: "Service", icon: <FaBell size={24} />, value: "Service" },
    { name: "Shop", icon: <FaShoppingBag size={24} />, value: "Shop" },
    { name: "Sports", icon: <FaFutbol size={24} />, value: "Sports" },
    { name: "Technology", icon: <FaLaptop size={24} />, value: "Technology" },
    { name: "Travel", icon: <FaPlane size={24} />, value: "Travel" },
    { name: "Other", icon: <FaEllipsisH size={24} />, value: "Other" },
    { name: "Favorite", icon: <FaHeart size={24} />, value: "Favorite" },
  ];

  return (
    <div style={styles.categoriesContainer}>
      {categories.map((category) => (
        <div
          key={category.value}
          style={{
            ...styles.categoryItem,
            ...(filterCategory === category.value ? styles.categoryItemActive : {}),
          }}
          onClick={() => setFilterCategory(category.value)}
        >
          {category.icon}
          <p style={styles.categoryItemText}>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Categories;