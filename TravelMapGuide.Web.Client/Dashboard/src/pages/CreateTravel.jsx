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

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const handleSubmit = async () => {
    
    const token = localStorage.getItem('jwtToken');
    console.log("token: ",token)
    if (!token || typeof token !== 'string') {
      console.error('Invalid or missing JWT token.');
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const travelData = {
      userId: userId,
      name: name,
      description: comment,
      latitude: location.lat,
      longitude: location.lng,
      date: new Date(),
      starReview: rating,
      cost: cost
    };

    console.log(travelData)

    try {
      const response = await fetch("https://localhost:7018/api/Travel/Post", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify(travelData)
      });

      if (response.ok) {
        console.log("Travel data successfully submitted");
      } else {
        console.error("Failed to submit travel data");
      }
    } catch (error) {
      console.error("Error submitting travel data:", error);
    }
  };

  return (
    <>
      <PageTitle>Create Travel</PageTitle>
      <CTA />
      <SectionTitle>Elements</SectionTitle>

      {/* Map Section */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Amount ($)</span>
          <Input 
            type="number" 
            className="mt-1" 
            value={cost} 
            onChange={(e) => setCost(Number(e.target.value))} 
            min="1" 
            max="5" 
            placeholder="Enter a amount" 
          />
        </Label>
      </div>

      {/* Comment Input */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
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

      {/* Submit Button */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <button 
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  )
}

export default CreateTravel
