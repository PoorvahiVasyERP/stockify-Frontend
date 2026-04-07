import React from "react";
import "./Button.css";

export default function Button({
  children,
  onClick,
  variant = "primary", // Variants: 'add', 'edit', 'delete', 'comment', 'primary'
  type = "button",
  disabled = false,
  className = "",
  icon = null,
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-btn custom-btn-${variant} ${className}`}
      style={style}
    >
      {icon && <i className={icon} style={{ marginRight: children ? "8px" : "0" }}></i>}
      {children}
    </button>
  );
}
