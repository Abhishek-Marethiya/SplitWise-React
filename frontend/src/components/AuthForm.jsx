
import { useState } from "react";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.{8,})/;

export default function AuthForm({ type, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "signup" && !passwordRegex.test(form.password)) {
      setError(
        "Password must be 8+ chars, include 1 uppercase, 1 special, 1 number"
      );
      return;
    }
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md">
      {type === "signup" && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {type === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
