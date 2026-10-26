// components/news/NewsMediaGallery.tsx
import React, { useState } from 'react';
import { extractAllHeadlineAttachments } from '@/utils/newsMapper';
import { useReactToNewsMutation } from '@/redux/api/newsApi';
import { notify } from '@/utils/notification';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import ShareMenu from '@/components/common/ShareMenu';

interface Attachment {
    category: string;
    attachment: {
        attachment_id: string;
        file_name: string;
        file_path: string;
    };
}

interface NewsMediaGalleryProps {
    attachments: Attachment[];
    title: string;
    news_id: string;
    initialLikes?: number;
    initialDislikes?: number;
    userReaction?: 'like' | 'dislike' | null;
}

const NewsMediaGallery: React.FC<NewsMediaGalleryProps> = ({
    attachments,
    title,
    news_id,
    initialLikes = 0,
    initialDislikes = 0,
    userReaction: initialUserReaction = null
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(initialUserReaction);
    const [isProcessing, setIsProcessing] = useState(false);

    const [reactToNews] = useReactToNewsMutation();

    // Filter headline attachments
    const headlineMedia = extractAllHeadlineAttachments(attachments);

    const handleReaction = async (reaction: 'like' | 'dislike') => {
        if (isProcessing || userReaction === reaction) return;

        setIsProcessing(true);

        const previousLikes = likes;
        const previousDislikes = dislikes;
        const previousUserReaction = userReaction;

        try {
            const response = await reactToNews({ news_id, reaction }).unwrap();

            if (response?.metadata) {
                setLikes(response.metadata.like_count ?? likes);
                setDislikes(response.metadata.dislike_count ?? dislikes);
            }

            if (response?.user_reaction !== undefined) {
                setUserReaction(response.user_reaction);
            }
        } catch (error) {
            setLikes(previousLikes);
            setDislikes(previousDislikes);
            setUserReaction(previousUserReaction);
            notify.error('Failed to register reaction');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Media Display (articles without headline media still get the interaction bar) */}
            {headlineMedia.length > 0 && (
                <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-100">
                    {headlineMedia[activeIndex]?.type === 'image' && (
                        <img
                            src={headlineMedia[activeIndex].url}
                            alt={title}
                            className="object-cover h-full w-full"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                        />
                    )}
                    {headlineMedia[activeIndex]?.type === 'video' && (
                        <video
                            src={headlineMedia[activeIndex].url}
                            className="h-full w-full object-cover"
                            controls
                            loop
                            playsInline
                        />
                    )}
    
                    {/* Navigation buttons */}
                    {headlineMedia.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveIndex(prev =>
                                    prev === 0 ? headlineMedia.length - 1 : prev - 1
                                )}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                                aria-label="Previous media"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setActiveIndex(prev =>
                                    prev === headlineMedia.length - 1 ? 0 : prev + 1
                                )}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                                aria-label="Next media"
                            >
                                →
                            </button>
                        </>
                    )}
    
                    {/* Media counter */}
                    {headlineMedia.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                            {activeIndex + 1} / {headlineMedia.length}
                        </div>
                    )}
                </div>
            )}

            {/* Interaction Bar - Below the main media */}
            <div className="flex items-center justify-end px-4 pt-2">
                <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                        onClick={() => handleReaction('like')}
                        disabled={isProcessing || userReaction === 'like'}
                        className={`flex items-center gap-1 transition-colors ${userReaction === 'like'
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                            }`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${userReaction === 'like' ? 'fill-primary/20' : ''}`} />
                        <span className="text-sm font-medium">{likes}</span>
                    </button>

                    {/* Dislike Button */}
                    <button
                        onClick={() => handleReaction('dislike')}
                        disabled={isProcessing || userReaction === 'dislike'}
                        className={`flex items-center gap-1 transition-colors ${userReaction === 'dislike'
                            ? 'text-slate-900'
                            : 'text-gray-600 hover:text-slate-900'
                            }`}
                    >
                        <ThumbsDown className={`w-5 h-5 ${userReaction === 'dislike' ? 'fill-slate-300' : ''}`} />
                        <span className="text-sm font-medium">{dislikes}</span>
                    </button>

                    {/* Share */}
                    <ShareMenu title={title}>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </ShareMenu>
                </div>
            </div>

            {/* Thumbnails */}
            {headlineMedia.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                    {headlineMedia.map((media, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex
                                ? 'border-primary scale-105'
                                : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            {media.type === 'image' ? (
                                <img
                                    src={media.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <video
                                    src={media.url}
                                    className="object-cover h-full w-full"
                                    muted
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsMediaGallery;