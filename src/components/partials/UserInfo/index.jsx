import { Button } from "@/components/ui/Button";
import { Drawer, DrawerBackdrop, DrawerContent } from "@/components/ui/Drawer";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import { User } from "lucide-react";
import { useState } from "react";

const UserInfo = () => {
  const { userInfo } = useAuthenticationState();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-0 top-0">
      <Drawer asPortal={true} isOpen={isOpen} setIsOpen={setIsOpen}>
        <DrawerBackdrop />
        <DrawerContent
          size="sm"
          className="dark rounded-r-[1rem] border-none border-foreground bg-primary py-4 text-title"
        >
          <div className="space-y-2 p-4 px-4 text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full border-2 border-dashed border-current text-title">
              <User className="size-12" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">{userInfo?.name}</h3>
              <p className="leading-tight">{userInfo?.phone}</p>
              <p className="leading-tight">{userInfo?.email}</p>
            </div>
          </div>
          <hr className="border-foreground" />
          <div className="flex items-center gap-1 p-2 px-4 capitalize text-title">
            <span className="w-20">Region</span> :{" "}
            <span className="font-medium">{userInfo?.region?.[0]?.name}</span>
          </div>
          <hr className="border-foreground" />
          <div className="flex items-center gap-1 p-2 px-4 capitalize text-title">
            <span className="w-20">Area</span> :{" "}
            <span className="font-medium">{userInfo?.area?.[0]?.name}</span>
          </div>
          <hr className="border-foreground" />
          <div className="flex items-center gap-1 p-2 px-4 capitalize text-title">
            <span className="w-20">Territory</span> :{" "}
            <span className="font-medium">
              {userInfo?.territory?.[0]?.name}
            </span>
          </div>
          <hr className="border-foreground" />
          <div className="flex items-center gap-1 p-2 px-4 capitalize text-title">
            <span className="w-20">Total Outlet</span> :{" "}
            <span className="font-medium">{userInfo?.outletCode?.length}</span>
          </div>
          <hr className="border-foreground" />
          <div className="flex items-center gap-1 p-2 px-4 capitalize text-title">
            <span className="w-20">Enroll ID</span> :{" "}
            <span className="font-medium">{userInfo?.enrollId}</span>
          </div>
          <hr className="border-foreground" />
        </DrawerContent>
      </Drawer>
      <Button
        className="group absolute left-0 top-[calc(50%-1.25rem)] z-10 h-10 rounded-l-none rounded-r-full active:scale-100"
        shape="icon"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0 m-auto inline-flex size-7 items-center justify-center rounded-full border-2 border-dashed border-current group-hover:animate-spin" />
        <User className="size-4" strokeWidth={2.5} />
      </Button>
    </div>
  );
};

export default UserInfo;
