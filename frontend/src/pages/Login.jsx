import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("https://eventify-9enr.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Success - login worked
        alert(`Login successful! Welcome ${data.role}!`);
        // Store token and role for later use
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
      } else {
        // Error from server
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Network error - make sure backend is running!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-xl rounded-xl w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 mb-3 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border p-2 mb-3 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
