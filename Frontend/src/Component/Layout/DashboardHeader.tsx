import { Avatar, Button, Hamburger, Tooltip, Text, Popover, PopoverTrigger, PopoverSurface } from "@fluentui/react-components";
import { AlertRegular , ArrowRight20Regular } from "@fluentui/react-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import catimage from "../../assets/cat.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  isNavOpen: boolean;
  onOpenNav: () => void;
}

const DashboardHeader = ({ title, subtitle, isNavOpen, onOpenNav }: DashboardHeaderProps) => {
  const { username, email } = useSelector((state: RootState) => state.profile);
  const [open,setOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-3">
        {!isNavOpen && (
          <Tooltip content="Open Navigation" relationship="label">
            <Hamburger onClick={onOpenNav} />
          </Tooltip>
        )}
        <div>
          <Text weight="semibold" size={500} block>{title}</Text>
          <Text size={200} className="text-gray-500">{subtitle}</Text>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex items-center gap-4">
          <Button appearance="subtle" icon={<AlertRegular />} />
          {/* <Avatar
            // name={username}
            image={{ src: catimage }}
            size={32}
            color="purple"
          /> */}
          {/* <h2 className="text-sm font-semibold text-gray-900">
              {username}
            </h2> */}
          <Popover
           open={open}
           onOpenChange={(_, data) => setOpen(data.open)}
           positioning={{
            offset: {
              mainAxis: 16,
            },
          }}>
            <PopoverTrigger disableButtonEnhancement>
              <Avatar
                image={{ src: catimage }}
                size={32}
                color="purple"
                className="cursor-pointer"
              />
            </PopoverTrigger>

            <PopoverSurface className="!rounded-2xl">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    image={{ src: catimage }}
                    size={56}
                    color="purple"
                  />
                  <p className="mt-2 text-sm font-semibold text-gray-900 break-all">
                    {username}
                  </p>
                  <p className="mt-0.5 max-w-full text-xs text-gray-500 break-all">
                    {email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    appearance="transparent"
                    className="!flex-1 !rounded-lg !text-[#4F46E5] gap-1"
                    onClick={() => {
                      navigate("\Profile");
                      setOpen(false);
                    }}
                  >
                    Profile<ArrowRight20Regular />
                  </Button>
                  {/* <Button
                    appearance="primary"
                    className="!flex-1 !rounded-lg"
                  >
                    Logout
                  </Button> */}
                </div>

              </div>
            </PopoverSurface>
          </Popover>


        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;