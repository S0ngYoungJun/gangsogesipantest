/** @format */

"use client";

import Link from "next/link";
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
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();
  links.forEach(link => {
    console.log(`Current path: ${pathName}, Link path: ${link.href}`);
  });

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className={cn(styles.container, { [styles.collapsed]: isCollapsed })}
      >
        <nav className={cn(styles.nav, { [styles.navCollapsed]: isCollapsed })}>
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.href === pathName ? "default" : "ghost",
                        size: "icon"
                      }),
                      styles.iconButton,
                      link.variant === "default" && styles.defaultVariant,
                      link.href === pathName && styles.activeButton
                    )}
                  >
                    <link.icon className={styles.icon} />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={styles.tooltipContent}
                >
                  {link.title}
                  {link.label && (
                    <span className={styles.label}>
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
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
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}
