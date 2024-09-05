import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        // Token'ı alın ve decode edin
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          if ( userRole=== 'Admin') {
            setIsAdmin(true);

            // Adminse kullanıcı verilerini çek
            const response = await axios.get('https://localhost:7018/api/Travel/GetAdminUserList', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.isSuccess) {
              setUsers(response.data.data);
            } else {
              setError(response.data.message || 'Veri alınırken hata oluştu.');
            }
          } else {
            // Admin değilse yönlendir
            history.push('/not-authorized');
          }
        } else {
          // Token yoksa giriş sayfasına yönlendir
          history.push('/login');
        }
      } catch (err) {
        setError('API isteği sırasında hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [history]);

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Kullanıcı Adı',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'E-posta',
      selector: row => row.email,
    },
    {
      name: 'Rol',
      selector: row => row.role.name,
    },
    {
      name: 'Resim',
      selector: row => (
        <img
          src={`https://localhost:7018/img/${row.imageUrl}`}
          alt={row.username}
          className="h-16 w-16 object-cover"
          onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }}
        />
      ),
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kullanıcı Listesi</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!loading ? (
        <DataTable
          columns={columns}
          data={users}
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

export default UserList;
