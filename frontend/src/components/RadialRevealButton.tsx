"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useAnimate,
  useReducedMotion,
  type AnimationPlaybackControls,
  type Transition,
} from "framer-motion";
import { Link } from "react-router-dom";

const radiusFromPercent = (w: number, h: number, pct: number) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100);

export type IconConfig = {
  type?: "symbol" | "image";
  symbol?: string;
  image?: string | { src?: string; srcSet?: string; alt?: string };
  color?: string;
  hoverColor?: string;
  size?: number;
  padding?: number;
  rounded?: number;
  side?: "left" | "right";
};

type HoverConfig = {
  fill?: string;
  textColor?: string;
};

type Colors = {
  fill?: string;
  textColor?: string;
  hoverFill?: string;
  hoverTextColor?: string;
};

type BorderConfig = {
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderStyle?: string;
  borderColor?: string;
};

export type RadialRevealButtonProps = {
  label?: string;
  children?: React.ReactNode;
  font?: React.CSSProperties;
  showText?: boolean;
  padding?: string;
  rounded?: number;
  fill?: string;
  textColor?: string;
  colors?: Colors;
  addIcon?: boolean;
  icon?: IconConfig;
  gap?: number;
  border?: BorderConfig;
  hover?: HoverConfig;
  link?: string;
  to?: string;
  transition?: Transition;
  newTab?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<any>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
};

type BandWidths = { top: number; right: number; bottom: number; left: number };

const num = (v: any) => {
  const parsed = parseFloat(String(v ?? ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const bandWidthsOf = (b: BorderConfig | undefined): BandWidths => {
  const fused = num(b?.borderWidth);
  return {
    top: b?.borderTopWidth !== undefined ? num(b.borderTopWidth) : fused,
    right: b?.borderRightWidth !== undefined ? num(b.borderRightWidth) : fused,
    bottom:
      b?.borderBottomWidth !== undefined ? num(b.borderBottomWidth) : fused,
    left: b?.borderLeftWidth !== undefined ? num(b.borderLeftWidth) : fused,
  };
};

const innerRadiusOf = (radius: number, b: BandWidths): string => {
  const inset = (v: number) => `${Math.max(0, radius - v)}px`;
  return (
    `${inset(b.left)} ${inset(b.right)} ${inset(b.right)} ${inset(b.left)}` +
    ` / ${inset(b.top)} ${inset(b.top)} ${inset(b.bottom)} ${inset(b.bottom)}`
  );
};

const DEFAULT_TRANSITION: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.45,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DEFAULT_FONT: React.CSSProperties = {
  fontFamily: "inherit",
  fontWeight: 500,
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  letterSpacing: "0em",
  textAlign: "center",
};

const DEFAULT_COLORS: Colors = {
  fill: "#5683da",
  hoverFill: "#6f98ee",
  textColor: "#FFFFFF",
  hoverTextColor: "#FFFFFF",
};

const DEFAULT_ICON: IconConfig = {
  type: "symbol",
  symbol: "→",
  image: "",
  color: "#FFFFFF",
  hoverColor: "#FFFFFF",
  size: 16,
  padding: 0,
  rounded: 0,
  side: "left",
};

const DEFAULT_BORDER: BorderConfig = {
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "transparent",
};

export default function RadialRevealButton({
  label,
  children,
  font = DEFAULT_FONT,
  showText = true,
  padding = "8px 20px",
  rounded = 100,
  fill: fillProp,
  textColor: textColorProp,
  colors = DEFAULT_COLORS,
  addIcon = false,
  icon = DEFAULT_ICON,
  gap = 8,
  border = DEFAULT_BORDER,
  hover = {},
  link = "",
  to = "",
  transition = DEFAULT_TRANSITION,
  newTab = false,
  style,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  "aria-label": ariaLabelProp,
}: RadialRevealButtonProps) {
  const fill = colors?.fill ?? fillProp ?? "#5683da";
  const textColor = colors?.textColor ?? textColorProp ?? "#FFFFFF";
  const {
    fill: hoverFill = colors?.hoverFill ?? "#6f98ee",
    textColor: hoverTextColor = colors?.hoverTextColor ?? "#FFFFFF",
  } = hover;

  const [scope, animate] = useAnimate();

  const [radiusBox, setRadiusBox] = useState({ w: 0, h: 0 });
  useIsoLayoutEffect(() => {
    const el = scope.current as HTMLElement | null;
    if (!el) return;
    const read = () =>
      setRadiusBox((prev) =>
        prev.w === el.offsetWidth && prev.h === el.offsetHeight
          ? prev
          : { w: el.offsetWidth, h: el.offsetHeight }
      );
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);
  const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const clipCtrl = useRef<AnimationPlaybackControls | null>(null);
  const reducedMotion = useReducedMotion();

  const clip = useRef({ r: 0, x: 100, y: 100, max: 160 });

  const fontStyles = (font ?? {}) as React.CSSProperties;
  const band = bandWidthsOf(border);

  const applyClip = () => {
    const el = overlayRef.current;
    if (!el) return;
    const { r, x, y } = clip.current;
    const value = `circle(${r}% at ${x}% ${y}%)`;
    el.style.clipPath = value;
    (el.style as any).webkitClipPath = value;
  };

  const anchorTo = (e: React.PointerEvent) => {
    const el = overlayRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const unit = Math.hypot(r.width, r.height) / Math.SQRT2;
    const far = Math.max(
      Math.hypot(px, py),
      Math.hypot(r.width - px, py),
      Math.hypot(px, r.height - py),
      Math.hypot(r.width - px, r.height - py)
    );
    clip.current.x = (px / r.width) * 100;
    clip.current.y = (py / r.height) * 100;
    clip.current.max = (far / unit) * 100 + 2;
  };

  const growTo = (toRadius: number) => {
    clipCtrl.current?.stop();
    if (reducedMotion) {
      clip.current.r = toRadius;
      applyClip();
      return;
    }
    clipCtrl.current = animate(clip.current.r, toRadius, {
      ...(transition as any),
      onUpdate: (v: number) => {
        clip.current.r = v;
        applyClip();
      },
    });
  };

  const onEnter = (e: React.PointerEvent) => {
    if (disabled) return;
    anchorTo(e);
    applyClip();
    growTo(clip.current.max);
  };

  const onLeave = (e: React.PointerEvent) => {
    if (disabled) return;
    if (clip.current.r >= clip.current.max - 0.5) {
      anchorTo(e);
      clip.current.r = clip.current.max;
      applyClip();
    }
    growTo(0);
  };

  useIsoLayoutEffect(() => {
    applyClip();
    return () => clipCtrl.current?.stop();
  }, []);

  const displayContent = children ?? label;

  const tagProps: any = {
    "aria-label": showText ? ariaLabelProp : ariaLabelProp || (typeof displayContent === "string" ? displayContent : undefined),
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
  };

  const {
    type: iconKind = "symbol",
    symbol: iconSymbol = "→",
    image,
    color: iconColor = "#FFFFFF",
    hoverColor: iconHoverColor = "#FFFFFF",
    side: iconSide = "left",
    size: iconSize = 16,
    padding: iconPaddingProp = 0,
    rounded: iconRounded = 0,
  } = icon;
  const iconSrc =
    typeof image === "string" ? image : image && image.src ? image.src : "";
  const iconMode = iconKind === "image" && iconSrc ? "image" : "symbol";
  const iconPx = Math.max(1, Math.round(iconSize));
  const iconPadPx = Math.max(0, Math.round(iconPaddingProp));
  const iconRadius = radiusFromPercent(iconPx, iconPx, iconRounded);
  const gapPx = Math.max(0, Math.round(gap));
  const hasIcon = addIcon;

  const faceStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    gap: hasIcon && showText ? gapPx : 0,
    flexDirection: iconSide === "right" ? "row-reverse" : "row",
  };

  const renderContent = (isHoverFace: boolean) => (
    <>
      {hasIcon &&
        (iconMode === "image" ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              width: iconPx,
              height: iconPx,
              margin: iconPadPx,
              objectFit: iconRadius > 0 ? "cover" : "contain",
              borderRadius: Math.min(iconRadius, iconPx / 2),
              display: "block",
              flex: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              fontSize: iconPx,
              margin: iconPadPx,
              lineHeight: 1,
              color: isHoverFace ? iconHoverColor : iconColor,
              flex: "none",
              pointerEvents: "none",
            }}
          >
            {iconSymbol}
          </span>
        ))}
      {showText && <span>{displayContent}</span>}
    </>
  );

  const buttonStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radiusPx,
    borderWidth: border?.borderWidth,
    borderStyle: border?.borderStyle,
    borderColor: border?.borderColor,
    backgroundColor: fill,
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    overflow: "hidden",
    boxSizing: "border-box",
    userSelect: "none",
    ...fontStyles,
    ...style,
  };

  const innerElement = (
    <>
      <span style={{ ...faceStyle, color: textColor }}>{renderContent(false)}</span>
      <span
        ref={overlayRef}
        aria-hidden
        style={{
          ...faceStyle,
          position: "absolute",
          inset: 0,
          backgroundColor: hoverFill,
          color: hoverTextColor,
          pointerEvents: "none",
          borderRadius: innerRadiusOf(radiusPx, band),
          clipPath: "circle(0% at 100% 100%)",
          WebkitClipPath: "circle(0% at 100% 100%)",
        }}
      >
        {renderContent(true)}
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        {...tagProps}
        ref={scope}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        className={className}
        style={buttonStyle}
      >
        {innerElement}
      </Link>
    );
  }

  if (link) {
    return (
      <a
        href={link}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        {...tagProps}
        ref={scope}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        className={className}
        style={buttonStyle}
      >
        {innerElement}
      </a>
    );
  }

  return (
    <button
      type={type}
      {...tagProps}
      ref={scope}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={className}
      style={buttonStyle}
    >
      {innerElement}
    </button>
  );
}
