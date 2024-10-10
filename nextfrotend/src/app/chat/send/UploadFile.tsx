"use client"
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
interface UploadFileProps {
    onFileSelect: (file: File) => void;
}
export default function UplaodFile({ onFileSelect }: UploadFileProps) {
    const toast = useRef<Toast>(null);

    const onSelect = (e: any) => {
        console.log(123, e)
        if (e.files && e.files.length > 0) {
            onFileSelect(e.files[0]);
        }
    }
    return (
        <div className='mr-2'>
            <Toast ref={toast}></Toast>
            <FileUpload mode="basic" name="demo[]" accept="*" maxFileSize={1000000} customUpload onSelect={onSelect} auto chooseLabel="文件" />
        </div>
    )
}