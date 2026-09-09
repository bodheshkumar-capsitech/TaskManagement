import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  Spinner,
} from "@fluentui/react-components";
import type { SpinnerProps } from "@fluentui/react-components";
import { CheckSquare } from "lucide-react";
import { login, register, checkAuth } from "../api/todoApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { setEmail, setLoginData } from "../features/Profile/ProfileSlice";


const LoginPage = (props: Partial<SpinnerProps>) => {
  const [email, setUsername] = useState("");
  const [passworddata, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [fullname, setfullname] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);
  const [fullnameError, setFullnameError] = useState<string | undefined>(undefined);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loginUser } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const authData = await checkAuth();
        if (authData.authenticated) {
          navigate("/Dashboard");

        }
      } catch {
        console.log("User is not authenticated");
      }
    };

    checkUserAuth();
  }, [navigate]);

  const switchToRegister = () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setFullnameError(undefined);
    setUsername("");
    setPassword("");
    setMode("register");
  };

  const switchToLogin = () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setFullnameError(undefined);
    setUsername("");
    setPassword("");
    setfullname("");
    setMode("login");
  };

  const onlogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!passworddata.trim()) {
      setPasswordError("Password is required");
      return
    }

    if (passworddata.length <= 5) {
      setPasswordError("Password must be atleast 6 character long...")
      return
    }

    loginMutation.mutate({ email: email, password: passworddata });

    // try {
    //   await login(email, passworddata)
    //   loginUser()
    //   // dispatch(loginredux())
    //   setUsername("")
    //   setPassword("")
    //   toast.dismiss();
    //   toast.success("Login sucessfull")
    //   navigate("/ProjectPage")
    // }
    // catch {
    // console.log("invalid credential");
    // toast.error("Invalid credential") 
    // }

  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      return await login(email, password);
    },

    onSuccess: (data) => {
      SaveProfileInfo(data.email, data.firstname, data.role)
      loginUser()
      // dispatch(loginredux())
      setUsername("")
      setPassword("")
      toast.dismiss();
      toast.success("Login sucessfull")
      // navigate("/ProjectPage")
      // navigate("/Navbar")
      navigate("/Dashboard")

    },

    onError: () => {
      toast.dismiss();
      toast.error("Invalid credential");
    }
  });


  const registerMutation = useMutation({
    mutationFn: async ({ email, password, fullname }: { email: string, password: string, fullname: string }) => {
      return await register(email, password, fullname);
    },

    onSuccess: (data) => {
      if (data) {
        setUsername("");
        setPassword("");
        setConfirmpassword("");
        setfullname("");
        toast.dismiss();
        toast.success("User registered successfully");
        switchToLogin();
      }
      else if (data === false) {
        toast.dismiss();
        toast.info("User already registered");
      }
    },

    onError: () => {
      toast.dismiss();
      toast.info("User already registered");
    }
  })

  const onregister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!fullname.trim()) {
      setFullnameError("Name is required");
      return;
    }

    if (fullname.trim().length < 4) {
      setFullnameError("Name must be at least 4 characters long");
      return;
    }


    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!passworddata.trim()) {
      setPasswordError("Password is required");
      return
    }

    if (passworddata.trim().length < 6) {
      setPasswordError("Password must be greater than 6 letters");
      return
    }


    if (!confirmpassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }

    if (confirmpassword.trim().length < 6) {
      setConfirmPasswordError("Password must be greater than 6 letters");
      return
    }

    if (passworddata !== confirmpassword) {
      setConfirmPasswordError("Password and confirm password do not match");
      return;
    }

    registerMutation.mutate({ email: email, password: passworddata, fullname: fullname })

    // try {
    //   var res = await register(email, passworddata)
    //   console.log("the register response is ", res)
    //   if (res) {
    //     setUsername("")
    //     setPassword("")
    //     toast.dismiss();
    //     toast.success("User register sucessfully");
    //   }

    //   else if (res === false) {
    //     toast.dismiss();
    //     toast.info("User already registered");
    //   }
    // }

    // catch {
    //   toast.dismiss();
    //   toast.error("Failed to register");
    // }

  }

  const SaveProfileInfo = (email: string, firstname: string, role: string) => {

    dispatch(
      setLoginData({
        email,
        firstname,
        role,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff] flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center mb-9">
        <div className="w-12 h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-sm">
          <CheckSquare size={22} className="text-white" />
        </div>

        <h1 className="text-[20px] font-bold text-gray-900 mt-3">
          TaskFlow
        </h1>

        <p className="text-[13px] text-[#64748b] mt-1">
          Project Management Platform
        </p>
      </div>

      <Card className="w-full
        max-w-[382px]
        bg-white
        !rounded-2xl
        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
        border-0
        p-8
        "
      >
        {mode === "login" ? (
          <>

            <div className="m-4">

              <h2 className="text-[22px] font-bold text-gray-900">
                Welcome back
              </h2>

              <p className="text-[14px] text-[#64748b] mt-1">
                Sign in to manage your projects and tasks
              </p>

            </div>


            <form
              onSubmit={(e) => {
                e.preventDefault();
                onlogin(e);
              }}
            >

              <div className="flex flex-col gap-5 m-4">
                <Field
                  label="Email address"
                  validationState={emailError ? "error" : undefined}
                  validationMessage={emailError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(_, data) => {
                      setUsername(data.value);

                      if (data.value.trim()) {
                        setEmailError(undefined);
                      }
                    }}
                  />
                </Field>

                <Field
                  label="Password"
                  validationState={passwordError ? "error" : undefined}
                  validationMessage={passwordError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    type="password"
                    placeholder="Enter your password"
                    value={passworddata}
                    onChange={(_, data) => {
                      setPassword(data.value);

                      if (data.value.trim()) {
                        setPasswordError(undefined);
                      }
                    }}
                  />
                </Field>

                <div className="flex items-center justify-between -mt-1">

                  {/* <Checkbox
                label="Remember me"
              /> */}

                  {/* <button
                    type="button"
                    className="
                text-[14px]
                text-[#4F46E5]
                font-medium
                hover:underline
                bg-transparent
                border-0
                cursor-pointer
              "
                    onClick={() => {
                      // forgot password logic
                    }}
                  >
                    Forgot password?
                  </button> */}

                </div>

                <Button
                  appearance="primary"
                  size="large"
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="
              w-full
              h-10
             !rounded-2xl
              !bg-[#4F46E5]
              hover:!bg-[#4338ca]
              font-semibold
            "
                >
                  {loginMutation.isPending ? (<div className="flex items-center gap-2"> <Spinner size="tiny" /> Signin...</div>) : "Sign in"}
                </Button>

                <div className="text-center text-[14px] text-[#64748b] mt-0 mb-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToRegister}
                    disabled={registerMutation.isPending}
                    className="
                text-[#4F46E5]
                font-medium
                hover:underline
                bg-transparent
                border-0
                p-0
                cursor-pointer
              "
                  >
                    Create account
                  </button>
                </div>
              </div>
            </form>
          </>) : (

          <>
            <div className="m-4">
              <h2 className="text-[22px] font-bold text-gray-900">
                Create account
              </h2>
              <p className="text-[14px] text-[#64748b] mt-1">
                Start managing your projects today
              </p>
            </div>

            <form onSubmit={onregister}>
              <div className="flex flex-col gap-5 m-4">
                <Field label="Full name"
                  validationState={fullnameError ? "error" : undefined}
                  validationMessage={fullnameError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    placeholder="Enter your name..."
                    value={fullname}
                    onChange={(_, data) => {
                      setfullname(data.value);
                      if (data.value.trim().length >= 4) {
                        setFullnameError(undefined);
                      }
                    }}
                  />
                </Field>

                <Field
                  label="Email address"
                  validationState={emailError ? "error" : undefined}
                  validationMessage={emailError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(_, data) => {
                      setUsername(data.value);
                      if (data.value.trim()) {
                        setEmailError(undefined);
                      }
                    }}
                  />
                </Field>

                <Field
                  label="Password"
                  validationState={passwordError ? "error" : undefined}
                  validationMessage={passwordError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    type="password"
                    placeholder="Create a password"
                    value={passworddata}
                    onChange={(_, data) => {
                      setPassword(data.value);
                      if (data.value.trim()) {
                        setPasswordError(undefined);
                      }
                    }}
                  />
                </Field>

                <Field
                  label="Confirm Password"
                  validationState={confirmPasswordError ? "error" : undefined}
                  validationMessage={confirmPasswordError}
                >
                  <Input
                    className="w-full !rounded-xl"
                    size="large"
                    type="password"
                    placeholder="Create a password"
                    value={confirmpassword}
                    onChange={(_, data) => {
                      setConfirmpassword(data.value);
                    }}
                  />
                </Field>

                <Button
                  appearance="primary"
                  size="large"
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-10 !rounded-2xl !bg-[#4F46E5] hover:!bg-[#4338ca] font-semibold"
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center gap-2"> 
                    <Spinner size="tiny" />
                      Creating account ...
                    </div>
                    ) : "Create Account"}
                </Button>

                <div className="text-center text-[14px] text-[#64748b] mt-0 mb-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-[#4F46E5] font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>
          </>
        )}


      </Card>

      <p className="text-[12px] text-[#94a3b8] mt-6 text-center">
        By signing in, you agree to our{" "}
        <button
          type="button"
          className="hover:underline"
        >
          Terms of Service
        </button>
        {" "}and{" "}
        <button
          type="button"
          className="hover:underline"
        >
          Privacy Policy
        </button>
        .
      </p>
    </div>
  );
};

export default LoginPage;