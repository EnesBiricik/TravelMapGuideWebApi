import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

function TravelList() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Token'i al (localStorage veya sessionStorage)
    const token = localStorage.getItem('jwtToken');

    const fetchTravels = async () => {
      try {
        if (!token) {
          setError('Kullanıcı token bulunamadı.');
          return;
        }
        console.log("before")
        const response = await fetch("https://localhost:7018/api/Travel/GetTravelByUserId", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`, // JWT'yi Bearer ile gönderiyoruz
          }
        });

        const data = await response.json();
        console.log(data)

        if (response.ok && isMounted) {
          if (data != null) {
            setTravels(data);
          } else {
            setError(data.message || 'Veri alınırken hata oluştu.');
          }
        } else {
          setError('API isteği sırasında hata oluştu.');
        }
      } catch (err) {
        if (isMounted) {
          setError('API isteği sırasında hata oluştu.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTravels();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'İsim',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Açıklama',
      selector: row => row.description,
    },
    {
      name: 'Enlem',
      selector: row => row.latitude,
      sortable: true,
    },
    {
      name: 'Boylam',
      selector: row => row.longitude,
      sortable: true,
    },
    {
      name: 'Tarih',
      selector: row => new Date(row.date).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Yıldız',
      selector: row => row.starReview,
      sortable: true,
    },
    {
      name: 'Maliyet',
      selector: row => row.cost,
      sortable: true,
    },
    {
      name: 'Resim',
      selector: row => <img 
      src={`https://localhost:7018/img/${row.imageUrl}`} 
      alt={row.name} 
      className="h-16 w-16 object-cover" 
      onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }} 
    />,
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Travel Listesi</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!loading ? (
        <DataTable
          columns={columns}
          data={travels}
          pagination
          highlightOnHover
          striped
          subHeader
          subHeaderComponent={<input type="text" placeholder="Ara" className="w-full p-2 border" />}
          persistTableHead
        />
      ) : (
        <p>Veri yükleniyor...</p>
      )}
    </div>
  );
}

export default TravelList;
