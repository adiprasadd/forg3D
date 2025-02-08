import React from 'react';
import UploadButton from './UploadButton';

const Upload = () => {
  return (
    <div className="flex items-center space-x-6">
      <UploadButton
        onUploadComplete={(result: { url: string; key: string }) => {
          console.log("Upload complete:", result);
          // Redirect to create page with the uploaded file info
          window.location.href = `/create?fileUrl=${encodeURIComponent(
            result.url
          )}&fileId=${result.key}`;
        }}
        label="Upload Model"
      />
    </div>
  );
};

export default Upload;