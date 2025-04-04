// components/MainSection.tsx
import React, { useState, DragEvent, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';

const MainSection: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleMerge = async () => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setMergedBlob(blob);
  };

  const handleDownload = () => {
    if (!mergedBlob) return;

    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Merge your PDF files easily
      </h1>

      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="w-full max-w-xl border-4 border-dashed border-indigo-400 rounded-xl p-10 text-center text-gray-600 cursor-pointer hover:bg-indigo-50 transition"
      >
        <p className="mb-4">Drag & drop your PDF files here</p>
        <p className="mb-2">or</p>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded file:border-0 file:cursor-pointer text-sm"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 w-full max-w-xl bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Files selected:</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Merge Button */}
      {files.length > 0 && !mergedBlob && (
        <button
          onClick={handleMerge}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Merge PDF
        </button>
      )}

      {/* Download Button */}
      {mergedBlob && (
        <button
          onClick={handleDownload}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Download Merged PDF
        </button>
      )}
    </main>
  );
};

export default MainSection;
