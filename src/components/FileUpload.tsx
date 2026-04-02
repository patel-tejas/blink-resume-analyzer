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
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        {...(getRootProps() as any)}
        className={`relative cursor-pointer rounded-2xl p-10 text-center transition-all duration-300 ${
          isProcessing
            ? "opacity-50 cursor-not-allowed border-2 border-dashed border-white/5"
            : isDragActive
            ? "dropzone-active"
            : "dropzone-idle"
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
              className="flex items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-dim)" }}>
                <FileText size={22} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-600">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={removeFile}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
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
            >
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "var(--accent-dim)" }}
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                <Upload
                  size={26}
                  style={{ color: isDragActive ? "var(--accent-light)" : "var(--accent)" }}
                />
              </motion.div>
              <p className="text-base font-medium mb-1 text-slate-900">
                {isDragActive ? "Drop your resume here" : "Drop your resume PDF"}
              </p>
              <p className="text-sm text-slate-600">
                or click to browse · PDF only · max 5MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
