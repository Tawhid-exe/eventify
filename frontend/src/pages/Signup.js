import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="p-6 bg-white shadow rounded">
        <h1 className="text-2xl mb-4">Signup</h1>
        <input type="text" placeholder="Name" className="border p-2 mb-2 w-full"
          onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="border p-2 mb-2 w-full"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 mb-2 w-full"
          onChange={(e) => setPassword(e.target.value)} />
        <select className="border p-2 mb-2 w-full" onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
