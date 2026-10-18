"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

type Media =
    | { url: string; type: "image" }
    | { url: string; type: "video" }
    | null;

type EventCardProps = {
    id: string;
    title: string;
    excerpt: string;
    media: Media;
    date: string;
    time: string;
    location: string;
    category: string;
    status: string;
};

const EventCard = ({
    id,
    title,
    excerpt,
    media,
    date,
    time,
    location,
    category,
    status
}: EventCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group bg-white rounded-2xl shadow-md overflow-hidden"
        >
            <Link href={`/events/${id}`}>
                {/* Media */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative h-full w-full"
                    >
                        {/* IMAGE */}
                        {media?.type === "image" && (
                            <img
                                src={media.url}
                                alt={title}
                                className="object-cover h-full w-full"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        )}

                        {/* VIDEO */}
                        {media?.type === "video" && (
                            <video
                                src={media.url}
                                className="h-full w-full object-cover"
                                muted
                                loop
                                playsInline
                            />
                        )}

                        {/* FALLBACK */}
                        {!media && (
                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                No media
                            </div>
                        )}
                    </motion.div>

                    {/* Date badge */}
                    <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
                        {date}
                    </span>
                    {/* Status badge */}
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${
                        status === "ongoing" ? "bg-green-600/90" : 
                        status === "upcoming" ? "bg-blue-600/90" : 
                        status === "completed" ? "bg-gray-700/90" :
                        status === "cancelled" ? "bg-red-600/90" :
                        status === "archived" ? "bg-amber-600/90" :
                        "bg-gray-500/90"
                    }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col h-full">
                    <p className="text-xs font-semibold text-primary mb-1">
                        {category}
                    </p>

                    <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {excerpt}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 mb-1 mt-auto">
                        <Clock size={14} className="mr-1 inline" /> {time}
                    </div>
                    {location && (
                        <div className="flex items-center text-xs text-gray-500 mb-4">
                            <MapPin size={14} className="mr-1 inline" /> {location}
                        </div>
                    )}

                    <span className="inline-flex items-center text-sm font-semibold text-golden-dark group-hover:gap-2 transition-all">
                        View Event <span className="ml-1">→</span>
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

export default EventCard;
