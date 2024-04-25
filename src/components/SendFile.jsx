import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function FileUpload({ deviceId }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        // Chỉ lấy file đầu tiên
        setFile(acceptedFiles[0]);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);
        fetch(`http://54.254.58.42/drive/send-file/${deviceId}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setMessage('File uploaded successfully');
            console.log('Success:', data);
        })
        .catch(error => {
            setMessage('File upload failed');
            console.error('Error:', error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div>
            <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            {file && <p>File ready to be uploaded: {file.name}</p>}
            <Button
                variant="contained"
                color="primary"
                onClick={uploadFile}
                disabled={!file || isLoading}
            >
                Upload
            </Button>
            {isLoading && <CircularProgress />}
            {message && <p>{message}</p>}
        </div>
    );
}

export default FileUpload;
