import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-cs7i.onrender.com";

const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token; // Fallback for old routes
    }

    console.log("Authorization being sent:", config.headers.Authorization);
    return config;
  },
  (error) => Promise.reject(error)
);

export const googleauth = (code) => api.get(`${API_URL}/api/log/googleLog?code=${code}`)
export const signin = (data) => api.post('/api/user/signin', data)
export const verifyOtp = (data) => api.post('/api/user/veri', data)
export const log = (data) => api.post('/api/user/login', data)

export const Formda = async (data) => {
  try {
    const response = await api.post("/api/form/fill", data, {
      timeout: 60000
    });
    return response;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Portfolio request timed out");
    }

    console.error(
      "Portfolio creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const iddata = (id) => api.get(`/api/form/${id}`)

export const paykey = () => api.get('/api/payment/getkey')
export const order = (ord) => api.post('/api/payment/paymentOrder', ord)
export const paymeverifi = (payveri) => api.post('/api/payment/PaymentVerifi', payveri)

export const prof = () => {
  return api.get("/api/pro/profile");
};

///port-link
export const portLink = () => {
  return api.get("/api/pro/port-link");
}