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
import styles from '@/styles/SideNavbar.module.scss';
import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className={styles.sidebar}>
      {!mobileWidth && (
        <div className={styles.toggleButton}>
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className={styles.button}
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
            variant: "default"
          },
          {
            title: "담당자 관리",
            href: "/dashbored/users",
            icon: UsersRound,
            variant: "default"
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
            variant: "default"
          }
        ]}
      />
    </div>
  );
}
