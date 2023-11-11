import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { apiURL } from "./App";
import slackLogo from './path/slack-logo.jpg';

export default function Login() {
  const { isLogin, setIsLogin, setAccessData } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const res = await fetch(`${apiURL}/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    const data = await res.json();

    if (data.success === false) {
      setError(data.errors[0]);
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      console.log(data);

      let accessToken = await {
        id: data.data.id,
        "access-token": res.headers.get("access-token"),
        client: res.headers.get("client"),
        expiry: res.headers.get("expiry"),
        uid: res.headers.get("uid"),
      };

      console.log(accessToken);

      setAccessData(accessToken);
      setIsLogin(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleLogin();
  }

  if (isLogin) {
    return <Navigate to="/dashboard/" />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img src={slackLogo} alt="Slack Logo" className="mx-auto mb-4" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your Slack account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              Sign in
            </button>
          </div>

          <div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-black-500">
          Not a Member?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-violet-600 hover:text-violet-500"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}