import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext"; // Import useAuth for authentication
import EditBusiness from "./EditBusiness"; // Import the reusable EditBusiness component
import { FaStar } from "react-icons/fa";

const BusinessDetails = ({ setLocation, setZoom }) => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [rating, setRating] = useState(0); // Current user's rating
  const [averageRating, setAverageRating] = useState(0); // Average rating
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const docRef = doc(db, "businesses", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const businessData = docSnap.data();
          setBusiness(businessData);

          const commentsRef = collection(db, "businesses", id, "comments");
          const commentsSnap = await getDocs(commentsRef);
          const commentsList = commentsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentsList);

          // Fetch ratings
          const ratingsRef = collection(db, "businesses", id, "ratings");
          const ratingsSnap = await getDocs(ratingsRef);
          const ratingsList = ratingsSnap.docs.map((doc) => doc.data().rating);
          const totalRatings = ratingsList.reduce((sum, r) => sum + r, 0);
          const avgRating = ratingsList.length > 0 ? totalRatings / ratingsList.length : 0;
          setAverageRating(avgRating.toFixed(1));

          // Check if the user has already rated
          if (user) {
            const userRating = ratingsSnap.docs.find((doc) => doc.data().userId === user.uid);
            if (userRating) {
              setRating(userRating.data().rating);
            }
          }

          // Construct the address string
          const address = `${businessData.street}, ${businessData.city}, ${businessData.state} ${businessData.zipCode}`;

          // Fetch latitude and longitude from OpenStreetMap API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
          );
          console.log("address: ", address);
          const data = await response.json();
          console.log("data: ", data);

          if (data.length > 0) {
            const { lat, lon } = data[0];
            console.log(parseFloat(lat), parseFloat(lon));
            setLocation([parseFloat(lat), parseFloat(lon)]); // Update the map location in the header
            setZoom(20);
          } else {
            console.error("No location found for the given address.");
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id, setLocation, setZoom]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this business?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "businesses", id));
        alert("Business deleted successfully.");
        navigate("/"); // Navigate back to the home page after deletion
      } catch (error) {
        console.error("Error deleting business:", error);
        alert("Failed to delete the business. Please try again.");
      }
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const docRef = doc(db, "businesses", id);
      await updateDoc(docRef, formData);
      alert("Business updated successfully!");
      setBusiness(formData); // Update the local state with the new data
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating business:", error);
      alert("Failed to update the business. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "businesses", id, "comments");
      const newCommentData = {
        text: newComment,
        createdBy: user.uid,
        createdAt: new Date(),
        userName: user.email || "Anonymous",
      };
      await addDoc(commentsRef, newCommentData);
      setComments((prev) => [...prev, newCommentData]); // Update local state
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddRating = async (newRating) => {
    if (!user) {
      alert("You must be logged in to rate this business.");
      return;
    }
    console.log("newRating: ", newRating);
    try {
      const ratingsRef = collection(db, "businesses", id, "ratings");
      const userRatingQuery = query(ratingsRef, where("userId", "==", user.uid)); // Create a query
      const ratingsSnap = await getDocs(userRatingQuery); // Execute the query
  
      if (!ratingsSnap.empty) {
        // Update existing rating
        const ratingDocId = ratingsSnap.docs[0].id;
        const ratingDocRef = doc(db, "businesses", id, "ratings", ratingDocId);
        await updateDoc(ratingDocRef, { rating: newRating });
      } else {
        // Add new rating
        await addDoc(ratingsRef, {
          userId: user.uid,
          rating: newRating,
        });
      }
  
      setRating(newRating);
      alert("Thank you for rating!");
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!business) {
    return <div>Business not found.</div>;
  }

  return (
    <div className="container mt-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {business.businessTitle}
          </li>
        </ol>
      </nav>

      {isEditing ? (
        // Render the EditBusiness for editing
        <div>
          <h2>Edit Business</h2>
          <EditBusiness
            initialData={business} // Pass the current business data as initial values
            onSubmit={handleEditSubmit} // Handle form submission
            isEdit={true} // Indicate that this is an edit operation
          />
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setIsEditing(false)} // Cancel editing
          >
            Cancel
          </button>
        </div>
      ) : (
        // Render the business details
        <div>
          <h2>{business.businessTitle}</h2>
          <img
            src={business.imageBase64}
            alt={business.businessTitle}
            style={{ borderRadius: "10px", marginBottom: "20px", width: "50%" }}
          />
          <p><strong>Description:</strong> {business.description}</p>
          <p><strong>Contact:</strong> {business.contact}</p>
          <p><strong>Category:</strong> {business.category}</p>
          <p><strong>Location:</strong> {business.street}, {business.city}, {business.state} {business.zipCode}</p>

          {/* Buttons */}
          <div className="mt-4 mb-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate(-1)} // Navigate back to the previous page
            >
              Back
            </button>
            {user?.uid === business.createdBy && ( // Show Edit and Delete buttons only if the user is the creator
              <>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => setIsEditing(true)} // Enter edit mode
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete} // Delete the business
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Rating Section */}
      <div className="mt-4">
        <h4>Average Rating: {averageRating} / 5</h4>
        <div className="d-flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              color={star <= rating ? "gold" : "gray"}
              style={{ cursor: "pointer" }}
              onClick={() => handleAddRating(star)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3>Comments</h3>
        <div className="mb-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-3 mb-2 rounded">
              <p><strong>{comment.userName}:</strong> {comment.text}</p>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleAddComment}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;