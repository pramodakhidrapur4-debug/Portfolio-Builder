import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-cs7i.onrender.com";

const api=axios.create({
    baseURL: API_URL
})
export const googleauth=(code)=>api.get(`${API_URL}/api/log/googleLog?code=${code}`)
export const signin=(data)=>api.post('/api/user/signin',data)
export const verifyOtp=(data)=>api.post('/api/user/veri',data)
export const log=(data)=>api.post('/api/user/login',data)
export const Formda = (data) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  return api.post("/api/form/fill", data, {
    headers: { token },
  });
};
export const iddata=(id)=>api.get(`/api/form/${id}`)

export const paykey=()=>api.get('/api/payment/getkey')
export const order=(ord)=>api.post('/api/payment/paymentOrder',ord)
export const paymeverifi=(payveri)=>api.post('/api/payment/PaymentVerifi',payveri)
export const prof = () => {
  const token = localStorage.getItem("token");

  return api.get("/api/pro/profile", {
    headers: {
      token,
    },
  });
};


///port-link
export const portLink=()=>{
  const token = localStorage.getItem("token");
  return api.get("/api/pro/port-link", {
    headers: {
      token,
    },
  });
}