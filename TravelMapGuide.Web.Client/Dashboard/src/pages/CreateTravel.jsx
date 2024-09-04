import React, { useState } from 'react'
import CTA from '../components/CTA'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { Input, Label, Textarea } from '@windmill/react-ui'
import MapComponent from '../components/MapComponent'
import { jwtDecode } from "jwt-decode";

function CreateTravel() {
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [rating, setRating] = useState(0);
  const [cost, setCost] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null); // Resim dosyası için
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

 const handleSubmit = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token || typeof token !== 'string') {
    console.error('Invalid or missing JWT token.');
    return;
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const formData = new FormData();
  formData.append('userId', userId);  // Bu, server tarafında `CreateTravelModel`de UserId ile eşleşmeli
  formData.append('name', name);
  formData.append('description', comment);
  formData.append('latitude', location.lat.toString());
  formData.append('longitude', location.lng.toString());
  formData.append('date', new Date().toISOString());
  formData.append('starReview', rating);
  formData.append('cost', cost);
  if (image) {
    formData.append('image', image);
  }

  try {
    console.log("create",location.lat, location.lng);
    const response = await fetch("https://localhost:7018/api/Travel/Post", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`, // Content-Type başlığını eklemiyoruz
      },
      body: formData
    });

    if (response.ok) {
      console.log("Travel data successfully submitted");
      setIsModalOpen(false);
    } else {
      const errorData = await response.json();
      console.error("Failed to submit travel data:", errorData);
    }
  } catch (error) {
    console.error("Error submitting travel data:", error);
  }
};

  return (
    <>
      <PageTitle>Create Travel</PageTitle>
      <CTA />

      <button
        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        Ekle
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg h-[50vh]">
            <SectionTitle>Create Travel</SectionTitle>

            {/* Map Section */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Location</span>
                <MapComponent onLocationSelect={handleLocationSelect} />
                {location.lat && location.lng && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected Location: {`Lat: ${location.lat}, Lng: ${location.lng}`}
                  </p>
                )}
              </Label>
            </div>

            {/* Name Input */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Name</span>
                <Input
                  className="mt-1"
                  placeholder="Jane Doe"
                  onChange={(e) => setName(e.target.value)}
                />
              </Label>
            </div>

            {/* Rating Input */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Rating (1-5)</span>
                <Input
                  type="number"
                  className="mt-1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="1"
                  max="5"
                  placeholder="Enter a rating between 1 and 5"
                />
              </Label>
            </div>

            {/* Amount Input */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Amount ($)</span>
                <Input
                  type="number"
                  className="mt-1"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  min="1"
                  placeholder="Enter an amount"
                />
              </Label>
            </div>

            {/* Comment Input */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Comment</span>
                <Textarea
                  className="mt-1"
                  rows="3"
                  placeholder="Enter your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Label>
            </div>

            {/* Image Input */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <Label>
                <span>Image</span>
                <Input
                  type="file"
                  className="mt-1"
                  onChange={handleImageChange}
                />
              </Label>
            </div>

            {/* Submit Button */}
            <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
              <button
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="ml-4 px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateTravel;
