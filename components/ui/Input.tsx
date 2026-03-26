import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        {...props}
        className={`flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm transition-all placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-zinc-900 dark:border-zinc-800 ${
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
