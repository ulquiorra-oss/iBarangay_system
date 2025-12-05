// IconSymbol.tsx
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Simple mapping without complex types
const MAPPING: Record<string, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  // Navigation & Home
  "house.fill": "home",
  "house": "home",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.up": "keyboard-arrow-up",
  "chevron.down": "keyboard-arrow-down",
  "arrow.clockwise": "refresh",
  "arrow.counterclockwise": "refresh",

  // Communication & Social
  "paperplane.fill": "send",
  "paperplane": "send",
  "envelope.fill": "mail",
  "envelope": "mail",
  "phone.fill": "phone",
  "phone": "phone",
  "message.fill": "chat",
  "message": "chat",
  "bell.fill": "notifications",
  "bell": "notifications-none",
  "heart.fill": "favorite",
  "heart": "favorite-border",

  // Actions & Controls
  "plus": "add",
  "minus": "remove",
  "xmark": "close",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "check-circle-outline",
  "checkmark.square.fill": "check-box",
  "checkmark.square": "check-box-outline-blank",
  "multiply": "clear",
  "trash.fill": "delete",
  "trash": "delete-outline",

  // Editing & Creation
  "pencil": "edit",
  "pencil.and.list.clipboard": "edit-note",
  "square.and.pencil": "edit",
  "doc.text.fill": "description",
  "doc.text": "description",
  "folder.fill": "folder",
  "folder": "folder-open",
  "doc.fill": "insert-drive-file",
  "doc": "insert-drive-file",

  // Media & Content
  "photo.fill": "image",
  "photo": "image",
  "camera.fill": "camera-alt",
  "camera": "camera-alt",
  "video.fill": "videocam",
  "video": "videocam-off",
  "music.note": "music-note",
  "speaker.wave.2.fill": "volume-up",
  "speaker.slash.fill": "volume-off",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",

  // System & Settings
  "gear": "settings",
  "gearshape.fill": "settings",
  "slider.horizontal.3": "tune",
  "info.circle.fill": "info",
  "info.circle": "info",
  "exclamationmark.triangle.fill": "warning",
  "exclamationmark.triangle": "warning",
  "questionmark.circle.fill": "help",
  "questionmark.circle": "help-outline",

  // Shapes & Symbols
  "square": "square",
  "circle": "circle",
  "triangle.fill": "change-history",
  "star.fill": "star",
  "star": "star-border",
  "bookmark.fill": "bookmark",
  "bookmark": "bookmark-border",

  // Technology & Code
  "chevron.left.forwardslash.chevron.right": "code",
  "qrcode.viewfinder": "qr-code",
  "wifi": "wifi",
  "antenna.radiowaves.left.and.right": "signal-cellular-alt",
  "battery.100": "battery-full",
  "battery.25": "battery-2-bar",
  "lock.fill": "lock", // Keep this one
  "lock.open.fill": "lock-open",

  // Shopping & Commerce
  "cart.fill": "shopping-cart",
  "cart": "shopping-cart",
  "creditcard.fill": "credit-card",
  "creditcard": "credit-card",
  "dollarsign.circle.fill": "monetization-on",
  "bag.fill": "shopping-bag",
  "bag": "shopping-bag",

  // Location & Maps
  "location.fill": "location-on",
  "location": "location-on",
  "map.fill": "map",
  "map": "map",
  "compass.drawing": "explore",

  // Time & Calendar
  "clock.fill": "access-time",
  "clock": "access-time",
  "calendar": "event",
  "timer": "timer",

  // User & Profile
  "person": "person",
  "person.fill": "person",
  "person.2.fill": "group",
  "person.2": "group",
  "person.crop.circle.fill": "account-circle",
  "person.crop.circle": "account-circle",

  // Additional icons for your ResidentDashboard
  "list.bullet": "format-list-bulleted",
  "phone.circle": "call",
  "megaphone": "volume-up",
  "person.circle": "account-circle",

  // Sharing & Export
  "square.and.arrow.up": "share",
  "square.and.arrow.down": "download",
  "arrow.up.doc.fill": "upload-file",
  "link": "link",

  // Search & Discovery
  "magnifyingglass": "search",
  "line.3.horizontal.decrease": "filter-list",
  "arrow.up.arrow.down": "sort",

  // Visibility & Display
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "lightbulb.fill": "lightbulb",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",

  // Verification icons
  "checkmark.seal.fill": "verified",
  "rectangle.portrait.and.arrow.right": "logout",
  // REMOVED DUPLICATE: "lock.fill": "lock", // This was the duplicate
  "arrow.down.circle": "download",
};

export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  const materialIconName = MAPPING[name] || "help";
  
  return (
    <MaterialIcons
      name={materialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
}