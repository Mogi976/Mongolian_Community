import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./utils/Routes";
import MapComponent from "./components/MapComponent";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [location, setLocation] = useState([47.6061, -122.3328]);
  const [zoom, setZoom] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [selectedState, setSelectedState] = useState("Washington");

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header props={{
            selectedLanguage,
            setSelectedLanguage,
            location,
            setLocation,
            theme,
            setTheme,
            setSearchQuery,
            selectedCountry,
            setSelectedCountry,
            selectedState,
            setSelectedState,
          }}/>
          <MapComponent location={location} theme={theme} zoom={zoom} />
          <AppRoutes
            searchQuery={searchQuery}
            setLocation={setLocation}
            setZoom={setZoom}
            selectedState={selectedState}
          />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;