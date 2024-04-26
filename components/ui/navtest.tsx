/** @format */

"use client"

import Link from "next/link";
import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import styles from '@/styles/Nav.module.scss';

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
    dropdown?: {
      items: {
        title: string;
        href: string;
      }[];
    };
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault(); // 링크의 기본 동작 방지
    setOpenDropdown(openDropdown === href ? null : href);
  };

  return (
    <TooltipProvider>
      <div data-collapsed={isCollapsed} className={cn(styles.container, { [styles.collapsed]: isCollapsed })}>
        <nav className={cn(styles.nav, { [styles.navCollapsed]: isCollapsed })}>
          {links.map((link, index) => (
            link.dropdown ? (
              <div key={index} className={styles.dropdownContainer}>
                <a
                  href={link.href}
                  onClick={(e) => toggleDropdown(e, link.href)}
                  className={cn(buttonVariants({
                    variant: link.variant,
                    size: "sm"
                  }), styles.textButton, link.variant === "default" && styles.defaultTextButton, link.href === pathName && styles.activeButton)}
                >
                  <link.icon className={styles.iconWithText} />
                  {link.title}
                </a>
                {openDropdown === link.href && (
                  <ul className={styles.dropdownMenu}>
                    {link.dropdown.items.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.href} className={styles.dropdownItem}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({
                    variant: link.href === pathName ? "default" : "ghost",
                    size: "sm"
                  }),
                  styles.textButton,
                  link.variant === "default" && styles.defaultTextButton,
                  link.href === pathName && styles.activeButton
                )}
              >
                <link.icon className={styles.iconWithText} />
                {link.title}
                {link.label && (
                  <span className={styles.labelWithText}>
                    {link.label}
                  </span>
                )}
              </Link>
            )
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
