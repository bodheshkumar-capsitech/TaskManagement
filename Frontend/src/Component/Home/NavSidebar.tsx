import type { DrawerProps } from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import {
    AppItem,
    Hamburger,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    NavSectionHeader,
    NavDrawerFooter,
    NavItem,
    Dialog,
    DialogTrigger,
    Button,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogActions,
    DialogContent,
    Avatar,
    Spinner,
} from "@fluentui/react-components";

import {
    Tooltip,
    makeStyles,
    useRestoreFocusTarget,
} from "@fluentui/react-components";
import {
    Person24Color,
    TaskListSquarePerson24Filled,
    ArrowExit24Filled,
    ClipboardTask24Regular,
    Board24Regular,
} from "@fluentui/react-icons";
import { Outlet, useNavigate, useLocation, data } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../../api/todoApi";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearDashboardStats } from "../../features/Dashboard/dashboardSlice";
import { useDispatch } from "react-redux";
import DashboardHeader from "../Layout/DashboardHeader";
import { CheckSquare } from "lucide-react";
import catimage from "../../assets/cat.png"




const useStyles = makeStyles({
    root: {
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
    },

    nav: {
        width: "260px",
        minWidth: "260px",
        height: "100vh",
    },

    content: {
        flex: 1,
        minWidth: 0,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    field: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "16px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },

});

type DrawerType = Required<DrawerProps>["type"];

export const NavSidebar = (): JSXElement => {

    const styles = useStyles();
    const [isOpen, setIsOpen] = useState(true);
    const [type, setType] = useState<DrawerType>("inline");
    const isMultiple = true; // never toggled — constant instead of dead state
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(AuthContext);
    const { email, firstname } = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch();
    const queryclient = useQueryClient();
    const [title, setTitle] = useState("Dashboard");
    const [subtitle, setSubtitle] = useState("Overview of your projects and tasks");
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        return checkScreensize();
    }, []);

    useLayoutEffect(() => {
        contentchecker();
        if (isMobile) {
            setIsOpen(false);
        }
    }, [location.pathname, isMobile]);

    const checkScreensize = useCallback(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const updateResponsiveState = () => {
            const mobile = mediaQuery.matches;
            setIsMobile(mobile);
            setType(mobile ? "overlay" : "inline");
            setIsOpen(!mobile);
        };

        updateResponsiveState();
        mediaQuery.addEventListener("change", updateResponsiveState);

        return () => {
            mediaQuery.removeEventListener("change", updateResponsiveState);
        };
    }, []);


    const onLogout = async () => {
        logoutMutation.mutate();
    }

    const logoutMutation = useMutation(
        {
            mutationFn: async () => {
                return await logout();
            },

            onSuccess: () => {
                context?.logoutUser();
                dispatch(clearDashboardStats());
                queryclient.clear();
                navigate("/");
                toast.dismiss();
                toast.success("Logged out sucessfully");
            },

            onError: () => {
                toast.dismiss();
                toast.error("failed to logout");
            }
        }
    );


    const getSelectedValue = () => {
        switch (true) {
            case location.pathname === "/dashboard":
                return "1";
            case location.pathname.startsWith("/home/"):
                return "2";
            case location.pathname === "/ProjectPage":
                return "2";
            case location.pathname === "/TaskPage":
                return "3";
            case location.pathname === "/Profile":
                return "4";
            case location.pathname === "/UsersPage":
                return "5";
            default:
                return "1";
        }
    };

    const selectedValue = getSelectedValue();
    const contentchecker = () => {
        if (location.pathname === "/dashboard") {
            setTitle("Dashboard");
            setSubtitle("Overview of your projects and tasks");
            return;
        } else if (location.pathname === "/ProjectPage") {
            setTitle("Projects");
            setSubtitle("Manage all your projects");
            return;
        } else if (location.pathname === "/TaskPage") {
            setTitle("My Tasks");
            setSubtitle("Manage all your tasks across projects");
            return;
        } else if (location.pathname === "/Profile") {
            setTitle("Profile");
            setSubtitle("Manage your account information and settings");
            return;
        } else if (location.pathname.startsWith("/home/")) {
            setTitle("My Tasks");
            setSubtitle("Manage all your tasks across projects");
            return;
        }
        else if (location.pathname === "/UsersPage") {
            setTitle("Users");
            setSubtitle("Manage all users and their access");
            return;
        }
    };

    return (
        <div className={`${styles.root} bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff]`}>
            <NavDrawer
                selectedValue={selectedValue}
                open={isOpen}
                type={type}
                multiple={isMultiple}
                className={styles.nav}
                onOpenChange={(_, data) => {
                    if (isMobile) {
                        setIsOpen(data.open);
                    }
                }
                }
                onNavItemSelect={(_, data) => {

                    switch (data.value) {
                        case "1":
                            navigate("/dashboard");
                            break;
                        case "2":
                            navigate("/ProjectPage");
                            break;
                        case "3":
                            navigate("/TaskPage");
                            break;
                        case "4":
                            navigate("/Profile");
                            break;
                        case "5":
                            navigate("/UsersPage")
                            break
                        default:
                            break;
                    }
                }}
            >
                <NavDrawerHeader className="!bg-white">
                    {isMobile &&
                        <Tooltip content="Close Navigation" relationship="label">
                            <Hamburger onClick={() => setIsOpen(!isOpen)} />
                        </Tooltip>}
                    <div className="flex items-center gap-3 m-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <CheckSquare size={18} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-semibold text-[#0F172A] leading-tight">
                                TaskFlow
                            </span>
                            <span className="text-[11px] text-[#64748B] mt-1">
                                Project Management
                            </span>
                        </div>
                    </div>
                </NavDrawerHeader>
                <NavDrawerBody className="!bg-white">
                    <NavSectionHeader className="text-gray-500">Main Menu</NavSectionHeader>

                    <NavItem icon={<Board24Regular />} value="1" className={selectedValue === "1" ? "!bg-[#EEF2FF] !rounded-full !text-[#4F46E5]" : "!bg-white"}>
                        Dashboard
                    </NavItem>
                    <NavItem icon={<TaskListSquarePerson24Filled />} value="2" className={selectedValue === "2" ? "!bg-[#EEF2FF] !rounded-full !text-[#4F46E5]" : "!bg-white"}>
                        Projects
                    </NavItem>
                    <NavItem icon={<ClipboardTask24Regular />} value="3" className={selectedValue === "3" ? "!bg-[#EEF2FF] !rounded-full !text-[#4F46E5]" : "!bg-white"}>
                        My Tasks
                    </NavItem>
                    <NavItem
                        icon={<Person24Color />}
                        value="4"
                        className={selectedValue === "4" ? "!bg-[#EEF2FF] !rounded-full !text-[#4F46E5]" : "!bg-white"}
                    >
                        Profile
                    </NavItem>
                     <NavItem
                        icon={<Person24Color />}
                        value="5"
                        className={selectedValue === "5" ? "!bg-[#EEF2FF] !rounded-full !text-[#4F46E5]" : "!bg-white"}
                    >
                        Users
                    </NavItem>
                </NavDrawerBody>
                <NavDrawerFooter className="bg-white !py-4 !gap-2">

                    <Dialog>
                        <DialogTrigger disableButtonEnhancement>
                            <AppItem
                                icon={<ArrowExit24Filled />}
                                className="!text-[#E7000B] !font-normal !bg-white"
                            >
                                Sign Out
                            </AppItem>
                        </DialogTrigger>

                        <DialogSurface className="!rounded-2xl !max-w-[384px] !sm:max-h-[223px]">
                            <DialogBody>
                                <DialogTitle className="!my-1">
                                    Sign Out?
                                </DialogTitle>
                                <DialogContent className="!mt-2">
                                    Are you sure you want to sign out? You will need to sign in again to access your projects.
                                </DialogContent>
                                <DialogActions className="!mt-2">
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary" className="!rounded-xl">
                                            Cancel
                                        </Button>
                                    </DialogTrigger>
                                    <Button
                                        appearance="primary"
                                        onClick={onLogout}
                                        disabled={logoutMutation.isPending}
                                        className="!bg-[#E7000B] !rounded-xl"
                                    >
                                        {logoutMutation.isPending
                                            ? (<div className="flex items-center gap-2"><Spinner size="tiny" /> Signing Out... </div>)
                                            : "Sign Out"
                                        }
                                    </Button>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                    <div className="flex flex-row bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff] rounded-xl p-2">
                        <div className="flex items-center gap-4">
                            <Avatar
                                // name={username}
                                image={{ src: catimage }}
                                size={32}
                                color="purple"
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {firstname}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {email}
                                </p>
                            </div>

                        </div>
                    </div>

                </NavDrawerFooter>
            </NavDrawer>

            <div className={styles.content}>
                {/* {isOpen && 
                <Tooltip content="Toggle navigation pane" relationship="label">
                    <Hamburger
                        onClick={() => setIsOpen(!isOpen)}
                        {...restoreFocusTargetAttributes}
                        aria-expanded={isOpen}
                    />
                </Tooltip>} */}
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    isNavOpen={isOpen}
                    onOpenNav={() => setIsOpen(!isOpen)}
                />
                <div className={styles.field}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NavSidebar;