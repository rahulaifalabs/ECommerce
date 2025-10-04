import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";


// ✅ Props type
type AdminHeaderProps = {
  setOpen: (value: boolean) => void; // if it's just a callback
  // OR setOpen: React.Dispatch<React.SetStateAction<boolean>>; // if from useState
};

function AdminHeader({ setOpen }: AdminHeaderProps) {
  const dispatch = useDispatch<AppDispatch>(); // ✅ typed dispatch
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/auth/login");
    dispatch(logoutUser()); // ✅ no TS error now
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
