"use client";
import React, { useState, useEffect,Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/register/verify-email?token=${token}`)
        .then((res) => {
          setMessage(res.data.message);
          setSuccess(true);
          setLoading(false);
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.error || err.response?.data?.message || "Verification failed.";
          setMessage(errorMessage);
          setError(errorMessage);
          setLoading(false);
        });
    } else {
      setMessage("Invalid or missing token.");
      setError("Invalid or missing token.");
      setLoading(false);
    }
  }, [token]);

  const handleRedirect = () => {
    router.push('/Login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
  <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
    {loading ? (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-400">Verifying your account...</p>
      </div>
    ) : error ? (
      <div className="text-center">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    ) : success ? (
      <div className="text-center">
        <p className="text-green-400 font-semibold">{message}</p>
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 transition-all"
          onClick={handleRedirect}
        >
          Go to Login
        </button>
      </div>
    ) : null}
  </div>
</div>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
};

export default Page;