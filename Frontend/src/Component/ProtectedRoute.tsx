import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/todoApi";
import { setLoginData } from "../features/Profile/ProfileSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await checkAuth();
        setAuthenticated(result.authenticated === true);
        console.log("User is authenticated");
        dispatch(setLoginData(
          {
            email:result.email,
            username:result.username,
            role:result.role
          }
        ))
      } catch (error) {
        console.log("User is not authenticated");
        setAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (authenticated === null) {
    return <div className="flex items-center justify-center h-full w-full">
      <div>
       <h1 className="flex text-2xl items-center justify-center mt-10">
       Checking authentication...
        </h1> 
        </div>
        </div>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;