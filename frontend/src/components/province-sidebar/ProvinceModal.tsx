"use client";

type Props = {
  previewImage: string | null;
  previewVideo: string | null;
  onClose: () => void;
};

export default function ProvinceModal({
  previewImage,
  previewVideo,
  onClose,
}: Props) {
  if (!previewImage && !previewVideo) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-3xl cursor-pointer"
        >
          ✕
        </button>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full max-h-[85vh] object-contain rounded-xl"
          />
        )}

        {previewVideo && (
          <video
            src={previewVideo}
            controls
            autoPlay
            className="w-full max-h-[85vh] rounded-xl"
          />
        )}
      </div>
    </div>
  );
}