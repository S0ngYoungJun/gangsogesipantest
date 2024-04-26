/** @format */

"use client";

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
        icon: LucideIcon;
        title: string;
        href: string;
      }[];
    };
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string, hasDropdown: boolean) => {
    if (hasDropdown) {
      event.preventDefault();
      setOpenDropdown(openDropdown === href ? null : href);
    }
  };

  return (
    <TooltipProvider>
      <div data-collapsed={isCollapsed} className={cn(styles.container, { [styles.collapsed]: isCollapsed })}>
        <nav className={cn(styles.nav, { [styles.navCollapsed]: isCollapsed })}>
          {links.map((link, index) => (
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, !!link.dropdown)}
                    className={cn(
                      buttonVariants({
                        variant: link.variant,
                        size: "icon"
                      }),
                      styles.iconButton,
                      link.variant === "default" && styles.defaultVariant,
                      link.href === pathName && styles.activeButton
                    )}
                  >
                    <link.icon className={styles.icon} />
                  </a>
                </TooltipTrigger>
                {link.dropdown && openDropdown === link.href && (
                  <TooltipContent side="right" className={styles.tooltipContent}>
                    <ul className={styles.dropdownMenu}>
                      {link.dropdown.items.map((item, idx) => (
                        <li key={idx}>
                          <Link href={item.href}>{item.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                )}
              </Tooltip>
            ) : (
              <div key={index} className={styles.dropdownContainer}>
                <Link
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, !!link.dropdown)}
                  className={cn(buttonVariants({
                    variant: link.variant,
                    size: "sm"
                  }), styles.textButton, link.variant === "default" && styles.defaultTextButton, link.href === pathName && styles.activeButton)}
                >
                  <link.icon className={styles.iconWithText} />
                  {link.title}
                  {link.dropdown && ' ▼'}
                </Link>
                {openDropdown === link.href && (
                  <ul className={styles.dropdownMenu}>
                    {link.dropdown.items.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.href}><item.icon className={styles.dropdownIcon} />{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
