"use client";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

interface Props {
    content: string | any;
}

const NewsContentRenderer = ({ content }: Props) => {
    if (!content) return null;

    let htmlContent = "";

    // Check if content is a Quill Delta JSON string
    if (typeof content === "string") {
        if (content.trim().startsWith("{") && content.includes('"ops"')) {
            try {
                const delta = JSON.parse(content);
                if (delta && delta.ops) {
                    const converter = new QuillDeltaToHtmlConverter(delta.ops, {
                        paragraphTag: "p",
                    });
                    htmlContent = converter.convert();
                }
            } catch (error) {
                console.error("Invalid JSON content, falling back to raw string:", error);
                htmlContent = content; // Fallback to treating it as HTML/text
            }
        } else {
            // It's likely raw HTML
            htmlContent = content;
        }
    } else if (typeof content === "object" && content.ops) {
        // It's a Delta object
        const converter = new QuillDeltaToHtmlConverter(content.ops, {
            paragraphTag: "p",
        });
        htmlContent = converter.convert();
    }

    return (
        <div
            className="news-content prose prose-slate max-w-none break-words dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default NewsContentRenderer;