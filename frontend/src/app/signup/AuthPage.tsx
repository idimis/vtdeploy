import { useRouter } from 'next/router';
import React, { useState } from 'react';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      router.push('/account');
    } else {
      alert('Please enter valid credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border rounded w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 p-2 border rounded w-64"
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default AuthPage;
