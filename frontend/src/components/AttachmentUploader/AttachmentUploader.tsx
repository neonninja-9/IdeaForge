import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { FileText, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import uploadService from "../../services/uploadService";
import type { Attachment } from "../../types/idea.types";

interface AttachmentUploaderProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
}

export default function AttachmentUploader({
  attachments,
  onChange,
  maxFiles = 5,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    if (attachments.length + fileArray.length > maxFiles) {
      setUploadError(`You can attach up to ${maxFiles} files per idea.`);
      return;
    }

    setIsUploading(true);
    const newAttachments: Attachment[] = [...attachments];

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 10MB file limit.`);
        continue;
      }
      try {
        const uploaded = await uploadService.uploadFile(file);
        newAttachments.push(uploaded);
      } catch (err: any) {
        console.error("Upload failed for:", file.name, err);
        setUploadError(`Failed to upload "${file.name}". ${err.message || ""}`);
      }
    }

    onChange(newAttachments);
    setIsUploading(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Visuals & Artifacts <span className="font-normal text-slate-400 dark:text-slate-500">optional (mockups, wireframes, specs)</span>
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {attachments.length}/{maxFiles}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drop area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10"
            : "border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625]/60 hover:border-indigo-300 dark:hover:border-indigo-500/40"
        }`}
      >
        <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
          {isUploading ? (
            <LoaderCircle size={20} className="animate-spin text-indigo-600" />
          ) : (
            <UploadCloud size={20} />
          )}
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {isUploading ? "Uploading files..." : "Click or drag images, mockups, or briefs here"}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
          Supports PNG, JPG, WEBP, PDF up to 10MB
        </p>
      </div>

      {uploadError && (
        <p className="text-xs font-medium text-rose-500">{uploadError}</p>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {attachments.map((att, idx) => {
            const isImg = att.type?.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(att.url);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-2.5 transition hover:border-slate-200 dark:hover:border-white/10"
              >
                {isImg ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="size-10 rounded-lg object-cover bg-slate-200 dark:bg-black/40 shrink-0"
                  />
                ) : (
                  <div className="grid size-10 place-items-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText size={18} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">{att.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {att.size ? `${(att.size / 1024).toFixed(0)} KB` : "Uploaded"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition"
                  aria-label="Remove attachment"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
