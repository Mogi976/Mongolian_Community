import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useTranslation } from "react-i18next";
import { languageFlags } from "../utils/common";
import locationData from "../utils/locations.json";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Header = ({ props }) => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const {
    selectedLanguage,
    setSelectedLanguage,
    setLocation,
    theme,
    setTheme,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedState,
    setSelectedState
  } = props;
  const [showModal, setShowModal] = useState(false);
  // const [searchInput, setSearchInput] = useState("");

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setSearchQuery(searchInput);
  // };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.body.className = theme === "light" ? "bg-dark text-white" : "bg-light text-dark";
  };

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSaveLocation = () => {
    if (selectedCountry && selectedState) {
      const coords = locationData[selectedCountry].states[selectedState];
      setLocation(coords);
      setShowModal(false);
    } else {
      alert("Please select both a country and a state.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      // setIsLoggedIn(false); // Update the isLoggedIn state
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-${theme} bg-${theme} w-100`}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Side: Title and Menu */}
        <div className="d-flex align-items-center">
          <a className="navbar-brand" href="#">
            {t("title")}
          </a>
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                {i18n.t("home")}
              </a>
            </li>
            { isLoggedIn && (
              <li className="nav-item">
                <a className="nav-link" href="/add">
                  {i18n.t("addBusiness")}
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                {i18n.t("contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Center: Search Input and Location Pin */}
        <div className="position-relative">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t("search")}
              aria-label="Search"
              aria-describedby="locationDropdown"
              style={{ width: "300px" }}
              onChange={(e) => setSearchQuery(e.target.value)}
              // value={searchInput}
            />
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="locationDropdown"
              onClick={() => setShowModal(!showModal)}
            >
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </div>

          {showModal && (
            <div
              className="dropdown-menu show w-100"
              style={{ position: "absolute", top: "100%", zIndex: 1050 }}
            >
              <div className="p-3">
                <div className="mb-3">
                  <label htmlFor="countrySelect" className="form-label">
                    {t("country")}
                  </label>
                  <select
                    id="countrySelect"
                    className="form-select"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState("");
                    }}
                  >
                    <option value="">{t("selectCountry")}</option>
                    {Object.keys(locationData).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCountry && (
                  <div className="mb-3">
                    <label htmlFor="stateSelect" className="form-label">
                      {t("state")}
                    </label>
                    <select
                      id="stateSelect"
                      className="form-select"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">{t("selectState")}</option>
                      {Object.keys(locationData[selectedCountry].states).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className="btn btn-primary w-100"
                  onClick={handleSaveLocation}
                >
                  {t("save")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Profile, Language, Theme Toggle */}
        <div className="d-flex align-items-center">
        <button
            className="btn btn btn-light dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle text-secondary"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <button className="dropdown-item" onClick={toggleTheme}>
                <i className="bi bi-moon"></i> {theme === "light" ? t("darkMode") : t("lightMode")}
              </button>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <a className="dropdown-item" href="#">
                    {i18n.t("settings")}
                  </a>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> {i18n.t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/auth")} // Navigate to Auth page
                >
                  <i className="bi bi-box-arrow-in-right"></i> {i18n.t("login")}
                </button>
              </li>
            )}
          </ul>

          <div className="dropdown me-3">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {languageFlags[selectedLanguage]}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("mn")}>
                  {languageFlags["mn"]} Монгол
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("en")}>
                  {languageFlags["en"]} English
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage("cn")}>
                  {languageFlags["cn"]} 中文
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
