"use client";

import React, { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = "*/*", label = "Upload File" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {label}
      </label>
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-900 group ${
          isDragging 
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500" 
            : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 dark:hover:bg-zinc-800"
        }`}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileInput}
          accept={accept}
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center p-4 text-center z-10 w-full">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 dark:bg-blue-900/30 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate w-full max-w-[200px]">
              {selectedFile.name}
            </p>
            <p className="text-xs text-zinc-500 mt-1 mb-2">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button 
              onClick={clearFile}
              className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-3 py-1 bg-red-50 rounded-lg dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors pointer-events-auto"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            <div className={`p-3 rounded-full mb-3 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-black shadow-sm transition-transform group-hover:scale-110 ${isDragging ? "text-blue-500 scale-110" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            </div>
            <p className="mb-1 text-sm font-bold text-zinc-700 dark:text-zinc-300">
              <span className="text-blue-500 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
