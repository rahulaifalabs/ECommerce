// AUTO-CONVERTED: extension changed to TypeScript. Fully typed
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "@/store/store";

// ------------------- Types -------------------
interface LoginFormData {
  email: string;
  password: string;
}

// ------------------- Initial State -------------------
const initialState: LoginFormData = {
  email: "",
  password: "",
};

// ------------------- Component -------------------
function AuthLogin() {
  const [formData, setFormData] = useState<LoginFormData>(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // ------------------- Form Submit -------------------
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const resultAction = await dispatch(loginUser(formData));

      // unwrap() will throw if the thunk was rejected
      const data = (resultAction as any).payload;

      if (data?.success) {
        toast({
          title: data?.message ?? "Login successful",
        });
      } else {
        toast({
          title: data?.message ?? "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don&apos;t have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
