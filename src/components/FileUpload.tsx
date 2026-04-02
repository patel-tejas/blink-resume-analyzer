"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const err = fileRejections[0].errors[0];
        if (err.message.includes("larger")) {
          setError("File too large. Maximum size is 5MB.");
        } else {
          setError("Only PDF files are accepted.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: isProcessing,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center flex flex-col items-center">
      <motion.div
        {...(getRootProps() as any)}
        className={`relative cursor-pointer transition-all duration-300 w-full rounded-2xl p-6 border-2 border-dashed ${isProcessing
            ? "opacity-50 cursor-not-allowed border-slate-200"
            : isDragActive
              ? "border-blue-400 bg-white/80 shadow-lg"
              : "border-slate-300 bg-white/40 hover:bg-white/80 hover:border-slate-400 backdrop-blur-sm"
          }`}
        whileHover={!isProcessing ? { scale: 1.01 } : undefined}
        whileTap={!isProcessing ? { scale: 0.99 } : undefined}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-4 bg-white border border-slate-200 shadow-sm rounded-full px-5 py-2.5 mx-auto w-max"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent-dim)" }}>
                <FileText size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-left flex-1 min-w-[120px]">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-600">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={removeFile}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
                >
                  <X size={16} style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center"
            >
              <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-800 font-semibold transition-colors ${isDragActive ? 'border-blue-400 shadow-md text-blue-600' : 'hover:border-slate-300 hover:shadow-md'}`}>
                <Upload size={16} className={isDragActive ? 'text-blue-500' : 'text-slate-600'} />
                <span className="text-sm">Upload Resume</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">
                or drag & drop PDF here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* <p className="mt-4 text-xs font-medium text-slate-500">*no signup required</p> */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl text-sm"
            style={{
              background: "var(--error-dim)",
              color: "var(--error)",
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
