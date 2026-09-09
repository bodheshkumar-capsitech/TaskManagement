import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  Text,
  type CheckboxOnChangeData,
} from "@fluentui/react-components";

import {
  Delete24Regular,
  Mail24Regular,
  Person24Regular,
  ShieldPersonRegular,
} from "@fluentui/react-icons";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { deleteuser } from "../../api/todoApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import catimage from "../../assets/cat.png"

const ProfilePage = () => {
  const { email, firstname, role } = useSelector((state: RootState) => state.profile)
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked));
  };

  const onDeleteAccount = async () => {
    // try{
    //   await deleteuser();
    //   navigate("/")
    //   toast.dismiss();
    //   toast.success("Account deleted sucessfully");
    //   console.log("Delete account sucessfully");
    // }

    // catch
    // {
    //   toast.dismiss();
    //   toast.error("Failed to delete the account");
    // }

    deleteMutation.mutate()
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deleteuser();
    },

    onSuccess: () => {
      navigate("/")
      toast.dismiss();
      toast.success("Account deleted sucessfully");
      console.log("Delete account sucessfully");
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete the account");
    }

  })

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your account information and settings.
        </p>
      </div>

      <Card className="!rounded-xl shadow-sm border border-[#aeacd4]">

        <CardHeader
          header={
            <div>
              <Text
                size={500}
                weight="semibold"
              >
                Personal Information
              </Text>

              <p className="text-sm text-gray-500 mt-1">
                Your account information
              </p>
            </div>
          }
        />

        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 mb-7">

            <Avatar
              // name={username}
              image={{ src: catimage }}
              size={64}
              color="colorful"
            />

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {firstname}
              </h2>

              <p className="text-sm text-gray-500">
                {email}
              </p>
            </div>

          </div>


          <Divider className="mb-6" />

          <div className="mb-5">
            <Field label="Username">
              <Input
                value={firstname}
                readOnly
                contentBefore={
                  <Person24Regular />
                }
              />

            </Field>

          </div>

          <div className="mb-5">
            <Field label="Email address">
              <Input
                value={email}
                readOnly
                contentBefore={
                  <Mail24Regular />
                }
              />
            </Field>

          </div>

          <div>
            <Field label="Role">

              <Input
                value={role}
                readOnly
                contentBefore={
                  <ShieldPersonRegular />
                }
              />
            </Field>

          </div>

        </div>

      </Card>

      <Card className="!rounded-xl shadow-sm mt-6 border border-red-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <Delete24Regular className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-600">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600 m-2 max-w-2xl">
                Permanently delete your account and all associated data.
                This action cannot be undone.
              </p>
              <Dialog modalType="non-modal">
                <DialogTrigger disableButtonEnhancement>
                  <Button className="!bg-red-600 !rounded-xl" appearance="primary" onClick={() => setChecked(false)}>Delete</Button>
                </DialogTrigger>
                <DialogSurface className="!rounded-2xl !max-w-[384px] !sm:max-h-[223px]">
                  <DialogBody>
                    <DialogTitle> Delete</DialogTitle>
                    <DialogContent>
                      <p>
                        Are you sure you want to delete your account?
                      </p>
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        className="my-2"
                        label="Yes, delete this account and all its associated resources"
                      />
                    </DialogContent>
                    <DialogActions>
                      <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary" className="!rounded-xl" onClick={() => setChecked(false)}>Cancel</Button>
                      </DialogTrigger>
                      <Button appearance="primary" className={!checked ? "!bg-red-400 !rounded-xl !text-gray-300" : "!bg-red-600 !rounded-xl"} onClick={onDeleteAccount} disabled={deleteMutation.isPending || !checked}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogActions>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
