import React from 'react';

function NotAuthorized() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Yetkisiz Erişim</h1>
      <p>Bu sayfayı görüntülemek için admin yetkisine sahip olmanız gerekmektedir.</p>
    </div>
  );
}

export default NotAuthorized;
