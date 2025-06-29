import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../app/hooks";
import { fetchUser } from "../app/slices/authSlice";
import { Link } from "react-router";
import ValidatedInput from "./ValidatedInput";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

type Inputs = {
  email: string;
  password: string;
};

const Register: React.FC = () => {
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
      const response = await fetch(`${apiUrl}/api/auth/register`, {
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
          : errorData?.message || "Registration failed";
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
          Join the squad
        </h1>
        <div className="flex flex-col">
          <p>
            It's just bad throws, worse plans, and somehow... the best time
            ever.
          </p>
        </div>
      </div>
      <form
        className="flex flex-col justify-center items-center w-full gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ValidatedInput
          register={register("email", { required: "Please enter your email" })}
          error={errors.email}
          placeholder="Email"
          type="email"
        />
        <ValidatedInput
          register={register("password", {
            required: "Please enter your password",
          })}
          error={errors.password}
          placeholder="Password"
          type="password"
        />
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
          Sign Up
        </button>
        <Link to="/login" className="text-sm hover:cursor-pointer py-2 px-2">
          Already got an account?
        </Link>
      </form>
    </div>
  );
};

export default Register;
