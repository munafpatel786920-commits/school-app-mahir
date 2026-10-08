import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Check, Camera, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  maxDimension?: number;
  shape?: 'square' | 'circle';
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  maxDimension = 400,
  shape = 'square',
  helperText = 'Attach photo from device (JPG, PNG, WebP up to 10MB)'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Compress image on canvas to maintain light localStorage footprint
  const processAndResizeFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP, etc.)');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-preserving resized dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // White background for transparent PNGs converted to JPEG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        setIsProcessing(false);
        alert('Could not decode image file.');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Error reading file.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndResizeFile(file);
    }
    // reset input so the same file can be re-selected if desired
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndResizeFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700 text-xs">
          {label} <span className="text-emerald-600 font-normal">(Attach File)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showUrlInput ? 'Hide URL' : 'Use Web URL'}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Attachment Control */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-3 transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/70'
            : value
            ? 'border-emerald-200 bg-emerald-50/20'
            : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/10'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* Photo Preview Thumbnail */}
          <div
            className={`relative w-16 h-16 shrink-0 overflow-hidden border border-slate-200 bg-white shadow-2xs ${
              shape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <Camera className="w-6 h-6 text-slate-300" />
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          {/* Action and Filename info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{value ? 'Change Photo File' : 'Attach Photo File'}</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {value ? (
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Photo attached & ready
                </span>
              ) : (
                helperText
              )}
            </p>
          </div>
        </div>

        {/* Optional Web URL Input Toggle */}
        {showUrlInput && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste external image URL..."
                value={value.startsWith('data:') ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
