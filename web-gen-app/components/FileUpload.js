import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

export default FileUpload;
