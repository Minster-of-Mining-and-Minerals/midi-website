"use client";

import React, { useState } from "react";
import { CheckCircle2, MessageSquare, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGetNewsFeedbackCountQuery, useRecordNewsFeedbackMutation, useGetNewsFeedbacksQuery } from "@/redux/api/newsApi";
import { notify, extractErrorMessage } from "@/utils/notification";
import { formatLongDate } from "@/utils/datetime";

interface NewsFeedbackProps {
    newsId: string;
}

const NewsFeedback: React.FC<NewsFeedbackProps> = ({ newsId }) => {
    const [fullname, setFullname] = useState("");
    const [thought, setThought] = useState("");

    const [recordFeedback, { isLoading }] = useRecordNewsFeedbackMutation();
    const { data: feedbackCount } = useGetNewsFeedbackCountQuery(newsId, { pollingInterval: 15000, refetchOnFocus: true });
    const { data: feedbacks = [] } = useGetNewsFeedbacksQuery({ news_id: newsId }, { pollingInterval: 15000, refetchOnFocus: true });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullname.trim() || !thought.trim()) {
            notify.warning("Full name and thought are required.");
            return;
        }

        try {
            await recordFeedback({
                news_id: newsId,
                fullname,
                thought,
            }).unwrap();

            notify.success("Thank you! Your feedback has been submitted for review.");
            setFullname("");
            setThought("");
        } catch (error) {
            console.error("Feedback submit failed:", error);
            notify.error(extractErrorMessage(error, "Failed to submit feedback. Please try again."));
        }
    };

    return (
        <div id="feedback-section" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Article Feedback</h2>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MessageSquare size={18} />
                        <span>{feedbackCount?.feedback_count ?? 0} Comments</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        maxLength={100}
                        className="focus-visible:ring-primary"
                    />

                    <Textarea
                        placeholder="Your thoughts about this article..."
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        className="focus-visible:ring-primary"
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-white px-8"
                        >
                            {isLoading ? "Submitting..." : "Post Comment"}
                        </Button>
                    </div>
                </form>
            </div>

            {feedbacks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b">
                        Published Comments
                    </h3>
                    <div className="space-y-6">
                        {feedbacks.map((item) => (
                            <div key={item.news_feedback_id} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <UserCircle2 size={22} />
                                    </div>
                                </div>
                                <div className="flex-grow space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-semibold text-gray-900 truncate">
                                            {item.fullname}
                                        </h4>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {formatLongDate(item.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.thought}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsFeedback;
