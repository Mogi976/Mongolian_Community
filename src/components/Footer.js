import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* About Me Section */}
          <div className="col-md-6 mb-4">
            <h5 className="mb-3">About Me</h5>
            <div className="d-flex">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQHKCQuaOYWNkA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696273666259?e=1751500800&v=beta&t=7RONrb4XOrhTOm5oVXl78JcNH3JXCYfVKKvUByNmSpU"
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <p>
                I am a student at the University of Washington, majoring in Applied Computing and Data Science. 
                I am passionate about technology, data analysis, and solving real-world problems through innovative solutions. 
                Feel free to connect with me or follow me on social media!
              </p>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="col-md-6 text-md-end mb-4">
            <h5 className="mb-3">Follow Me</h5>
            <div className="d-flex justify-content-md-end mb-3">
              <a
                href="https://www.facebook.com/mogivandan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="bi bi-facebook" style={{ fontSize: "1.5rem" }}></i>
              </a>
              <a
                href="https://www.instagram.com/elise.vandan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="bi bi-instagram" style={{ fontSize: "1.5rem" }}></i>
              </a>
              <a
                href="https://www.linkedin.com/in/mogi-vandan-4a11ba162"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="bi bi-linkedin" style={{ fontSize: "1.5rem" }}></i>
              </a>
            </div>

            {/* Contact Information */}
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                <a href="mailto:mv2023@uw.edu" className="text-white text-decoration-none">
                  mv2023@uw.edu
                </a>
              </li>
              <li>
                <i className="bi bi-geo-alt-fill me-2"></i>
                Bothel, WA, USA
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;