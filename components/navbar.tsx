"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const Navbar = () => {
  const [apiLimitCount, setApiLimitCount] = useState(null);
  const [isPro, setIsPro] = useState(null);

  useEffect(() => {
    const fetchApiLimitAndSubscription = async () => {
      const apiLimit = await getApiLimit();
      const subscription = await checkSubscription();
      setApiLimitCount(apiLimit);
      setIsPro(subscription);
    };

    fetchApiLimitAndSubscription();
  }, []);

  return (
    <div className="flex items-center p-4">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;