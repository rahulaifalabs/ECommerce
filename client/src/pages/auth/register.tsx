// AUTO-CONVERTED: extension changed to TypeScript. Fully typed
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser, AuthResponse, AuthCredentials } from "@/store/auth-slice";
import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";

// ------------------- Types -------------------
interface RegisterFormData extends AuthCredentials {
  userName: string;
}

// ------------------- Initial State -------------------
const initialState: RegisterFormData = {
  userName: "",
  email: "",
  password: "",
};

// ------------------- Component -------------------
function AuthRegister() {
  const [formData, setFormData] = useState<RegisterFormData>(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------- Form Submit -------------------
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      const payload = (data as { payload: AuthResponse }).payload;

      if (payload?.success) {
        toast({
          title: payload.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: payload?.message ?? "Registration failed",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Register Form */}
      <CommonForm
        formControls={registerFormControls}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
