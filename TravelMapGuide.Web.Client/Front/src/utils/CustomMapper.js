

export const mapTravelData = (data, selectedUser) => {
  if (selectedUser) {
    return Array.isArray(data) && data.length > 0
      ? data.map((travel) => ({
          key: travel.id,
          location: {
            lat: parseFloat(travel.latitude),
            lng: parseFloat(travel.longitude),
          },
          name: travel.name,
          description: travel.description,
          starReview: travel.starReview,
          cost: travel.cost,
          latitude: travel.latitude,
          longitude: travel.longitude,
          imageUrl: travel.imageUrl,
          user: selectedUser,
          isFeatured: travel.isFeatured,
        }))
      : [];
  } else {
    return data.isSuccess
      ? data.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 100)
          .map((location) => ({
            key: location.id,
            location: {
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude),
            },
            name: location.name,
            description: location.description,
            starReview: location.starReview,
            cost: location.cost,
            latitude: location.latitude,
            longitude: location.longitude,
            imageUrl: location.imageUrl,
            user: {
              username: location.user.username,
              imageUrl: location.user.imageUrl,
              id: location.user.id,
            },
            isFeatured: location.isFeatured,
          }))
      : [];
  }
};

export const mapNewTravelData =(data) => {
  console.log("mapNewTravelData")
  console.log(data)
  console.log(typeof data)

    return {
      key: data.id,
      location: {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      },
      name: data.name,
      description: data.description,
      starReview: data.starReview,
      cost: data.cost,
      latitude: data.latitude,
      longitude: data.longitude,
      imageUrl: data.imageUrl instanceof Blob
        ? URL.createObjectURL(data.imageUrl)
        : data.imageUrl,
      user: data.user,
      isFeatured: data.isFeatured,
    };
  }
