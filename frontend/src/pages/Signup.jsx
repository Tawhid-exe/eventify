import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("https://eventify-9enr.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleSignup} className="p-6 bg-white shadow-xl rounded-xl w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>
        <input type="text" placeholder="Name" className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setPassword(e.target.value)} />
        <select className="border p-2 mb-3 w-full rounded" onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded">Signup</button>
      </form>
    </div>

  );
}

export default Signup;
