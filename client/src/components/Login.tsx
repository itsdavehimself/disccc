import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router";
import { fetchUser } from "../app/slices/authSlice";
import { useEffect } from "react";

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
          You handle the putts.
        </h1>
        <div className="flex flex-col text-lg">
          <p>
            We'll handle the group chat, the forecast, and your flaky cousin.
          </p>
        </div>
      </div>
      <form
        className="flex flex-col justify-center items-center w-full gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full">
          <input
            {...register("email", { required: "Please enter your email" })}
            className="outline-1 outline-gray-200 w-full rounded-lg h-10 pl-2"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col w-full">
          <input
            type="password"
            {...register("password", {
              required: "Please enter your password",
            })}
            className="outline-1 outline-gray-200 w-full rounded-lg h-10 pl-2"
            placeholder="Password"
          />
        </div>
        <div className="self-start h-5 text-error-red text-sm">
          {error === "Invalid credentials" ? (
            <p>Something doesn't look right. Check your credentials.</p>
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
        <button className="text-sm hover:cursor-pointer py-2 px-2">
          Forgot password?
        </button>
      </form>
    </div>
  );
};

export default Login;
