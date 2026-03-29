import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", children, ...props }) => {
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xl shadow-zinc-950/10 dark:shadow-none",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold tracking-tight transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
