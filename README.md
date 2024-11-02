# Explore Our Travel Project! 🌍🚀

In this project, we have developed a platform where users can share their travel experiences on a map and showcase the places they have visited. We are thrilled to present this project together with my teammate [Ekrem Güneş](https://github.com/ekremgunes).

## 🔹 Key Features

- **🐳 Deployment with Docker and Nginx:** Quick scalability through automated container configuration.
- **💳 Purchase Integration with Iyzico:** Secure payment integration to enhance user transactions.
- **🛠️ MongoDB Data Management:** Robust and reliable data management to improve user experience.
- **📄 Logging with NLog:** Detailed log records for important messages and errors.
- **🔒 Authorization with JWT:** A secure method for user authentication.
- **🗺️ Google Maps API Integration:** Allows users to visualize locations on an interactive map.
- **⭐ Travel Ratings and Memories:** Ability to rate each trip on a scale of 1 to 5, and enrich content with photos, comments, expenses, and selected location details.

## 🛠️ Setup Instructions

### 1. **Remote MongoDB Connection**
Before starting, ensure you have a remote MongoDB connection via AtlasDB. In your `appsettings.json` file, fill in the following connection strings:

```json
"ConnectionStrings": {
  "MongoDB": "your remote mongodb address"
},
"DatabaseConfiguration": {
  "LocalConnection": "your remote mongo address",
  "DatabaseName": "TravelMapGuide"
}

````

### 2. JWT Configuration
To configure JWT authentication, you need to set the JWT options in your appsettings.json file. Add the following configuration:

```json
"Jwt": {
  "SecretKey": "your secret",
  "Issuer": "myApp",
  "Audience": "myAppUsers",
  "ExpiryInHours": 1
}
```

### 3. Iyzico Payment Integration
For the payment infrastructure using Iyzico, fill in the following section in your appsettings.json on the server side:

```json
"IyzipayOptions": {
  "ApiKey": "**",
  "SecretKey": "**",
  "BaseUrl": "iyzico base url"
}
```

### 4. Google Maps Integration

Firstly, obtain an API key from Google Cloud Console. Then, update the Keys.js file located in TravelMapGuide.Client.Front with the following structure:

```js
export const KEYS = {
  MAP_API_KEY: "**don't try the older one we deleted :)**",
}
```
Next, Here you will need to integrate the map design by filling the mapId field. Add the mapId field in MapContainer.jsx from the Front components

```html
    <Map
        style={{
          width: selectedLocation ? "100%" : "100%",
          height: "100vh",
        }}
        defaultZoom={3}
        defaultCenter={{ lat: 37.870737, lng: 32.504982 }}
        mapId="Your Map Id"
        options={options}
      >
```

Make sure to place these settings in the TravelMapGuide.Server project.

### 5. **AWS, Docker, and Jenkins Documentation**

#### Using with Docker Desktop

After entering the project directory, running the following that code is enough to get a container example in the Desktop version (Linux Container).

```
docker-compose up --build -d
```

<br>
For more information on using AWS, Docker, and Jenkins, please refer to our Medium article: 
<br>

[Medium Article on AWS, Docker, and Jenkins source -1](https://medium.com/@gunesekrem.com/aws-linuxta-docker-ve-jenkins-ile-net-projesine-ci-cd-pipeline-24af27ec412e).

[Medium Article on AWS, Docker, and Jenkins source -2](https://medium.com/@gunesekrem.com/aws-linuxta-docker-ve-jenkins-ile-net-projesine-ci-cd-pipeline-24af27ec412e).



<img src="./monkey.jpg">
<p><b>We work hard 🙉!</p> 