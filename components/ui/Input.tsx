import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        {...props}
        className={`flex h-12 w-full rounded-2xl border bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-100 placeholder:font-medium ${
          error ? "border-red-500 ring-red-500/10" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
        }`}
      />
      {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
