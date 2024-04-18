/** @format */
"use client";

import { useState } from "react";
import { Nav } from "./ui/nav";

type Props = {};

import {
  ShoppingCart,
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "./ui/button";

import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="relative min-w-[80px] border-r px-3  pb-10 pt-24 ">
      {!mobileWidth && (
        <div className="absolute right-[-15px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="p-2 rounded-full "
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "메인화면",
            href: "/dashbored",
            icon: LayoutDashboard,
            variant: "default"
          },
          {
            title: "관리자 관리",
            href: "/dashbored/member",
            icon: UserRoundCheck,
            variant: "ghost"
          },
          {
            title: "담당자 관리",
            href: "/dashbored/users",
            icon: UsersRound,
            variant: "ghost"
          },
          // {
          //   title: "Ordrs",
          //   href: "/orders",
          //   icon: ShoppingCart,
          //   variant: "ghost"
          // },
          // {
          //   title: "Settings",
          //   href: "/settings",
          //   icon: Settings,
          //   variant: "ghost"
          // }
          {
            title: "견적 계산기",
            href: "/dashbored/cal",
            icon: Settings,
            variant: "ghost"
          }
        ]}
      />
    </div>
  );
}
