import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

function DownloadDialog({ open, handleClose }) {
    const [loading, setLoading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleDownload = () => {
        setLoading(true);
        fetch('http://54.254.58.42/drive/getClientExecutable')
            .then(response => {
                if (response.ok) return response.blob();
                throw new Error('Network response was not ok.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'client-windows.zip';  // Thiết lập tên file
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setDownloadSuccess(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Download failed:', error);
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Download File</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Click below to download the ZIP file from the server.
                </DialogContentText>
                {loading && <CircularProgress />}
                {!loading && downloadSuccess && (
                    <DialogContentText>Download successful!</DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {!loading && !downloadSuccess && (
                    <Button onClick={handleDownload} color="primary" variant="contained">
                        Download
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default DownloadDialog;
