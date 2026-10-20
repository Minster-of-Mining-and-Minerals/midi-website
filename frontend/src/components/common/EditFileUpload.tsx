"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Upload, Loader2, Eye, X, FileIcon, ImageIcon, VideoIcon, FileText } from "lucide-react";
import {
    useUploadAttachmentsMutation,
    useDeleteAttachmentMutation,
    useGetAttachmentsQuery,
} from "@/redux/api/attachementApi";
import { getFileUrl, getImageUrl } from "@/utils/fileUrl";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { notify } from "@/utils/notification";

export type UploadedFileInfo = {
    attachment_id: string;
    file_name: string;
    file_path?: string;
    previewUrl?: string | null;
    category?: "headline" | "footer";
    isBlob?: boolean;
    file_type: 'image' | 'video' | 'pdf' | 'document';
};

interface FileUploadFieldProps {
    id: string;
    label: string;
    value: string[];
    onChange: (value: string[], files?: UploadedFileInfo[]) => void;
    required?: boolean;
    accept?: string;
    error?: string;
    className?: string;
    labelClass?: string;
    fieldClass?: string;
    multiple?: boolean;
    showPreview?: boolean;
    category?: "headline" | "footer";
    onDelete?: (attachmentId: string) => void;
}

// Helper function to determine file type
const getFileTypeFromName = (fileName: string): 'image' | 'video' | 'pdf' | 'document' => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        return 'image';
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v', '3gp'].includes(extension)) {
        return 'video';
    }
    if (extension === 'pdf') {
        return 'pdf';
    }
    return 'document';
};

// Helper to get icon based on file type
const getFileIcon = (fileType: string) => {
    switch (fileType) {
        case 'image':
            return <ImageIcon className="w-4 h-4" />;
        case 'video':
            return <VideoIcon className="w-4 h-4" />;
        case 'pdf':
            return <FileText className="w-4 h-4" />;
        default:
            return <FileIcon className="w-4 h-4" />;
    }
};

export const EditFileUpload: React.FC<FileUploadFieldProps> = ({
    id,
    label,
    value = [],
    onChange,
    required = false,
    accept = "image/*,.pdf",
    error,
    className = "",
    labelClass = "",
    fieldClass = "",
    multiple = true,
    showPreview = true,
    category,
    onDelete,
}) => {
    const [uploadAttachments, { isLoading: isUploading }] = useUploadAttachmentsMutation();
    const [deleteAttachment] = useDeleteAttachmentMutation();
    const { data: attachmentsResponse } = useGetAttachmentsQuery();

    const [files, setFiles] = useState<UploadedFileInfo[]>([]);
    const [previewFile, setPreviewFile] = useState<UploadedFileInfo | null>(null);

    // Initialize with existing attachments
    useEffect(() => {
        if (!attachmentsResponse || value.length === 0) return;

        const all = attachmentsResponse.attachments || [];
        const mapped = value
            .map((id) => {
                const found = all.find((a) => a.attachment_id === id);
                if (found) {
                    return {
                        attachment_id: found.attachment_id,
                        file_name: found.file_name,
                        file_path: found.file_path,
                        previewUrl: getImageUrl(found, "large"),
                        category,
                        isBlob: false,
                        file_type: getFileTypeFromName(found.file_name),
                    };
                }
                return null;
            })
            .filter(Boolean) as UploadedFileInfo[];

        if (mapped.length > 0) {
            setFiles(mapped);
        }
    }, [attachmentsResponse, value, category]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach((f) => {
                if (f.isBlob && f.previewUrl) {
                    URL.revokeObjectURL(f.previewUrl);
                }
            });
        };
    }, [files]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const uploadPromises = Array.from(selectedFiles).map(async (file) => {
            try {
                const result = await uploadAttachments({ files: [file] }).unwrap();
                if (result.attachments.length > 0) {
                    const uploaded = result.attachments[0];

                    // Create blob URL for preview
                    const previewUrl = URL.createObjectURL(file);

                    // Determine file type
                    const file_type = getFileTypeFromName(uploaded.file_name);

                    return {
                        attachment_id: uploaded.attachment_id,
                        file_name: uploaded.file_name,
                        file_path: uploaded.file_path,
                        previewUrl,
                        category,
                        isBlob: true,
                        file_type,
                    };
                }
                return null;
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                notify.error(`Failed to upload ${file.name}`);
                return null;
            }
        });

        const uploadedFiles = (await Promise.all(uploadPromises)).filter(
            Boolean
        ) as UploadedFileInfo[];

        if (uploadedFiles.length > 0) {
            const updatedFiles = [...files, ...uploadedFiles];
            setFiles(updatedFiles);

            // Pass both IDs and full file info to parent
            onChange(
                updatedFiles.map((f) => f.attachment_id),
                updatedFiles
            );

            uploadedFiles.forEach((f) => {
                notify.success(`${f.file_name} uploaded successfully`);
            });
        }

        // Clear the input
        e.target.value = '';
    };

    const handleDelete = async (attachmentId: string) => {
        try {
            const fileToDelete = files.find(f => f.attachment_id === attachmentId);

            if (!fileToDelete) return;

            // Call the external onDelete handler if provided (for parent component to handle)
            if (onDelete) {
                onDelete(attachmentId);
            } else {
                // Otherwise handle internally
                // Only call API for non-blob files (already uploaded to server)
                if (!fileToDelete.isBlob) {
                    await deleteAttachment(attachmentId).unwrap();
                }
            }

            // Clean up blob URL if it exists
            if (fileToDelete.isBlob && fileToDelete.previewUrl) {
                URL.revokeObjectURL(fileToDelete.previewUrl);
            }

            // Update local state
            const updatedFiles = files.filter((f) => f.attachment_id !== attachmentId);
            setFiles(updatedFiles);

            // Notify parent
            onChange(
                updatedFiles.map((f) => f.attachment_id),
                updatedFiles
            );

            notify.success("File removed successfully");
        } catch (error) {
            console.error("Failed to delete file:", error);
            notify.error("Failed to delete file");
        }
    };

    const getPreviewContent = (file: UploadedFileInfo) => {
        const previewUrl = file.isBlob ? file.previewUrl : getImageUrl(file as any, "large");

        if (!previewUrl) return null;

        switch (file.file_type) {
            case 'image':
                return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={previewUrl}
                        alt={file.file_name}
                        className="w-full h-auto max-h-[70vh] object-contain"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                    />
                );
            case 'video':
                return (
                    <video controls className="w-full h-auto max-h-[70vh]">
                        <source src={previewUrl} type="video/mp4" />
                        <source src={previewUrl} type="video/mov" />
                        <source src={previewUrl} type="video/avi" />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'pdf':
                return (
                    <iframe
                        src={previewUrl}
                        className="w-full h-[70vh]"
                        title={file.file_name}
                    />
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[70vh]">
                        <FileIcon className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600">Cannot preview this file type.</p>
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            Download {file.file_name}
                        </a>
                    </div>
                );
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label
                htmlFor={id}
                className={`${labelClass ?? "text-sm font-medium"} cursor-pointer`}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            <div
                className={`${fieldClass} mt-2 relative flex flex-col items-center justify-center border border-[#B1C9E3] rounded-md border-dashed p-3 hover:bg-gray-50 transition cursor-pointer ${error ? "border-red-500" : ""
                    }`}
            >
                <input
                    id={id}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {isUploading ? (
                    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <p className="text-sm text-gray-600">Click or drag to upload</p>
                        {accept && (
                            <p className="text-xs text-muted-foreground">
                                Accepted: {accept.replace(/,/g, ', ')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Uploaded files preview */}
            {files.length > 0 && showPreview && (
                <div className="space-y-2 mt-2">
                    <p className="text-sm font-medium text-gray-700">
                        Uploaded Files ({files.length})
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {files.map((file) => (
                            <div
                                key={file.attachment_id}
                                className="flex items-center justify-between border border-gray-200 rounded-md p-2 bg-card hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex-shrink-0 text-gray-500">
                                        {getFileIcon(file.file_type)}
                                    </div>
                                    <span className="text-sm text-gray-700 truncate">
                                        {file.file_name}
                                    </span>
                                    {file.isBlob && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                            New
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPreviewFile(file)}
                                        className="w-8 h-8 text-primary hover:bg-gray-200"
                                        title="Preview"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(file.attachment_id)}
                                        className="w-8 h-8 text-red-600 hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Preview Modal */}
            {previewFile && showPreview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold truncate">
                                {previewFile.file_name}
                            </h3>
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                                onClick={() => setPreviewFile(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            {getPreviewContent(previewFile)}
                        </div>

                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPreviewFile(null)}
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    const url = previewFile.isBlob
                                        ? previewFile.previewUrl
                                        : getImageUrl(previewFile as any, "large");
                                    if (url) {
                                        window.open(url, '_blank');
                                    }
                                }}
                            >
                                Open in New Tab
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};