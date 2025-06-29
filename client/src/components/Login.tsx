import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router";
import { fetchUser } from "../app/slices/authSlice";
import { Link } from "react-router";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

type Inputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    const subscription = watch(() => {
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  const onSubmit: SubmitHandler<Inputs> = async (data): Promise<void> => {
    if (!errors.email && !errors.password) {
      setError(null);
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        const message = Array.isArray(errorData)
          ? errorData.join(", ")
          : errorData?.message || "Login failed";
        setError(message);
        return;
      }

      setError(null);
      await dispatch(fetchUser());
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Network or server error:", err.message);
        setError("Something went wrong: " + err.message);
      } else {
        console.error("Unknown error:", err);
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white justify-center items-center px-10 gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="self-start text-6xl font-bold text-text">
          Welcome back
        </h1>
        <div className="flex flex-col">
          <p>We'll handle the scheduling.</p>
          <p>You just keep hitting first available.</p>
        </div>
      </div>
      <form
        className="flex flex-col justify-center items-center w-full gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email", { required: "Please enter your email" })}
          className={`outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200
    ${
      errors.email
        ? "outline-error-red"
        : "outline-gray-200 hover:outline-black focus:outline-1 focus:outline-primary"
    }`}
          placeholder="Email"
        />
        <div className="flex flex-col w-full">
          <input
            type="password"
            {...register("password", {
              required: "Please enter your password",
            })}
            className={`outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200
    ${
      errors.password
        ? "outline-error-red"
        : "outline-gray-200 hover:outline-black focus:outline-1 focus:outline-primary"
    }`}
            placeholder="Password"
          />
        </div>
        <div className="self-start min-h-5 text-error-red text-sm">
          {error === "Invalid credentials" ? (
            <p>Something doesn't look right. Check your credentials.</p>
          ) : error ? (
            <div className="self-start text-error-red text-sm space-y-1">
              {error.split(",").map((msg, idx) => (
                <p key={idx}>{msg.trim()}</p>
              ))}
            </div>
          ) : errors.email?.message ? (
            <p>{errors.email.message}</p>
          ) : errors.password?.message ? (
            <p>{errors.password.message}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full rounded-lg h-10 font-bold hover:cursor-pointer hover:bg-hover transition-all duration-200"
        >
          Sign In
        </button>
        <Link to="/forgot" className="text-sm hover:cursor-pointer py-2 px-2">
          Forgot password?
        </Link>
      </form>
    </div>
  );
};

export default Login;
