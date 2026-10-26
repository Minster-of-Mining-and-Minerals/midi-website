// components/news/NewsDocuments.tsx
import React from 'react';
import { FileText, File } from 'lucide-react';

interface Attachment {
    category: string;
    attachment: {
        attachment_id: string;
        file_name: string;
        file_path: string;
    };
}

interface NewsDocumentsProps {
    attachments: Attachment[];
}

const NewsDocuments: React.FC<NewsDocumentsProps> = ({ attachments }) => {
    const footerDocuments = attachments.filter(att => att.category === 'footer');

    if (footerDocuments.length === 0) return null;

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Attached Documents</h3>
            <div className="space-y-3">
                {footerDocuments.map((doc) => (
                    <a
                        key={doc.attachment.attachment_id}
                        href={`${process.env.NEXT_PUBLIC_BASE || 'http://localhost:4000'}/uploads/${doc.attachment.file_path.replace(/^uploads[\\/]/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <div className="p-2 bg-white rounded-lg">
                            {doc.attachment.file_name.endsWith('.pdf') ? (
                                <FileText className="w-5 h-5 text-primary" />
                            ) : (
                                <File className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                            {doc.attachment.file_name}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default NewsDocuments;