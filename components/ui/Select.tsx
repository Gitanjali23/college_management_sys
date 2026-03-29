import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className={`flex h-12 w-full appearance-none rounded-2xl border bg-zinc-50/50 px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-100 ${
            error ? "border-red-500 ring-red-500/10" : "border-zinc-200 group-hover:border-zinc-300 dark:border-zinc-800 dark:group-hover:border-zinc-700"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
