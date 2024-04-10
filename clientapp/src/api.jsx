// api.js

// Hàm gửi yêu cầu API với token
export const sendRequestWithToken = async (url, token, method = 'GET', body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    };
  
    const config = {
      method,
      headers,
    };
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error('Response was not ok.');
      }
      return response.json();
    } catch (error) {
      console.error('Error sending request:', error.message);
      throw error;
    }
  };
  