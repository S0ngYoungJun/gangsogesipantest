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
  ChevronDown,
  Building,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import styles from '@/styles/SideNavbar.module.scss';
import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200); 
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
    setSidebarWidth(isCollapsed ? 180 : 70);
  }
  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <div className={styles.sidebar}  style={{ width: `${sidebarWidth}px` }}>
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
            variant: "default",
            dropdown: { // 드롭다운 메뉴 추가
              items: [
                { icon: UsersRound,title: "팀 설정", href: "/dashbored/users" },
                { icon: UsersRound,title: "권한 설정", href: "/dashbored/users/permissions" }
              ]
            }
          },
          {
            title: "견적 계산기",
            href: "/dashbored/cal",
            icon: Settings,
            variant: "default"
          },
          {
            title: "회원사등록",
            href: "/dashbored/test",
            icon: Building,
            variant: "default"
          },
          {
            title: "회원사관리",
            href: "/dashbored/corporation",
            icon: Building,
            variant: "default"
          },
          {
            title: "엑셀테스트",
            href: "/dashbored/test2",
            icon: Building,
            variant: "default"
          },
         
        ]}
      />
      {/* <div>
        <Button onClick={toggleDropdown} variant="ghost">
          관리자 옵션 {dropdownOpen ? '▼' : '▶'}
        </Button>
        <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
          <ul className={styles.dropdownList}>
            <li><a href="/dashbored/member">관리자 관리</a></li>
            <li><a href="/dashbored/advanced">고급 설정</a></li>
          </ul>
        </div>
      </div> */}
    </div>
  );
}
