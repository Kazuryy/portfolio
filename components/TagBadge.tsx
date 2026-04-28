"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TagConfig {
  color: string;
  bgColor: string;
  darkColor: string;
  darkBgColor: string;
}

interface TagBadgeProps {
  tag: string;
  config: TagConfig;
  size?: "sm" | "xs";
}

export function TagBadge({ tag, config, size = "xs" }: TagBadgeProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const bgColor = isDark ? config.darkBgColor : config.bgColor;
  const textColor = isDark ? config.darkColor : config.color;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
        size === "sm" ? "text-sm" : "text-xs"
      }`}
      style={{
        backgroundColor: mounted ? bgColor : config.bgColor,
        color: mounted ? textColor : config.color,
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      {tag}
    </span>
  );
}
