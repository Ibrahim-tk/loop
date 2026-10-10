'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Star } from '@/components/admin/icons';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface ImageItem {
    id?: string;
    url: string;
    file?: File;
}

interface ImageUploaderProps {
    images: ImageItem[];
    onImagesChange: (images: ImageItem[]) => void;
    onImageDelete?: (imageId: string) => void;
    maxImages?: number;
}

export default function ImageUploader({
    images,
    onImagesChange,
    onImageDelete,
    maxImages = 20,
}: ImageUploaderProps) {
    const [dragOver, setDragOver] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(
        (files: FileList) => {
            const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
            const tooLarge = imageFiles.filter((f) => f.size > MAX_FILE_SIZE);
            const validFiles = imageFiles.filter((f) => f.size <= MAX_FILE_SIZE);

            if (tooLarge.length > 0) {
                toast.error(`${tooLarge.length} file(s) exceed 10MB limit: ${tooLarge.map((f) => f.name).join(', ')}`);
            }

            const newImages = validFiles
                .slice(0, maxImages - images.length)
                .map((file) => ({
                    url: URL.createObjectURL(file),
                    file,
                }));

            onImagesChange([...images, ...newImages]);
        },
        [images, maxImages, onImagesChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    // Clean up blob URLs on unmount
    useEffect(() => {
        return () => {
            images.forEach((img) => {
                if (img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const removeImage = (index: number) => {
        const image = images[index];

        // Revoke blob URL to prevent memory leak
        if (image.url.startsWith('blob:')) {
            URL.revokeObjectURL(image.url);
        }

        // If this is an existing image (has ID), notify parent for database deletion
        if (image.id && onImageDelete) {
            onImageDelete(image.id);
        }

        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleImageError = (index: number) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    const setAsPrimary = (index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        const [movedImage] = newImages.splice(index, 1);
        newImages.unshift(movedImage);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-all ${
                    dragOver
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-white/20 hover:border-white/30 hover:bg-white/5'
                }`}
            >
                <Upload className="h-8 w-8 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">
                    <span className="text-accent-400 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-white/30 text-xs mt-1">
                    PNG, JPG, WEBP up to 10MB ({images.length}/{maxImages})
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
            </div>

            {/* Image grid */}
            {images.length > 0 && (
                <>
                    <p className="text-white/40 text-xs">
                        First image will be used as the main property photo. Click the star to set as primary.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                            <div
                                key={image.id || index}
                                className={`relative group aspect-square rounded-md overflow-hidden bg-white/5 border transition-all ${
                                    index === 0
                                        ? 'border-accent-500 ring-2 ring-accent-500/30'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                {!imageErrors[index] ? (
                                    <Image
                                        src={image.url}
                                        alt={`Upload ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={() => handleImageError(index)}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5">
                                        <ImageIcon className="h-8 w-8 text-white/20 mb-1" />
                                        <span className="text-white/30 text-xs">Failed to load</span>
                                    </div>
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                                {/* Primary badge */}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-accent-500 text-white text-[10px] font-semibold">
                                        PRIMARY
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setAsPrimary(index)}
                                            className="p-2 rounded-md bg-amber-500/80 text-white hover:bg-amber-500 transition-colors"
                                            title="Set as primary"
                                        >
                                            <Star className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-2 rounded-md bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                                        title="Remove image"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* Index badge */}
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index + 1}
                                </div>

                                {/* Existing vs New indicator */}
                                {image.file && (
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/80 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        NEW
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
