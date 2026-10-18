"use client";

import React, { useState } from 'react';
import * as LucideIcons from "lucide-react";
import { useGetBusinessOverviewQuery } from '@/redux/api/businessApi';
import { useGetAttachmentsQuery } from '@/redux/api/attachementApi';
import { ChevronRight } from 'lucide-react';
import { getFileUrl, getImageUrl } from '@/utils/fileUrl';
import { BusinessOverviewSkeleton } from '@/components/skeletons';

// Helper component to render icons dynamically from strings
const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
    if (!name) return null;
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

const OverviewPage = () => {
    const { data, isLoading } = useGetBusinessOverviewQuery();
    const { data: attachmentsResponse } = useGetAttachmentsQuery();
    const [expandedNetworkOp, setExpandedNetworkOp] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="py-20">
                <BusinessOverviewSkeleton />
            </div>
        );
    }

    if (!data) return null;

    const businessData = data.business_data || [];
    const businessCategories = data.business_categories || [];
    const keyMetrics = data.key_metrics || [];
    const operationsData = data.operations_data || [];
    const networkOperations = data.network_operations || [];
    const rawQuickStats: any = data.quick_stats || { left: [], right: [] };
    const quickStats: any = {
        left: Array.isArray(rawQuickStats.left) ? rawQuickStats.left : (rawQuickStats.left ? [rawQuickStats.left] : []),
        right: Array.isArray(rawQuickStats.right) ? rawQuickStats.right : (rawQuickStats.right ? [rawQuickStats.right] : [])
    };
    const pageMetadata: any = data.page_metadata || {};
    const generalInfo: any = pageMetadata.general_overview_info || {};

    let bgImageUrl = '';
    if (generalInfo.bg_image) {
        if (generalInfo.bg_image.startsWith('/') || generalInfo.bg_image.startsWith('http')) {
             bgImageUrl = generalInfo.bg_image;
             if (!bgImageUrl.startsWith('http')) bgImageUrl = getFileUrl(bgImageUrl);
        } else if (attachmentsResponse?.attachments) {
             const found = attachmentsResponse.attachments.find((a: any) => a.attachment_id === generalInfo.bg_image);
             if (found) {
                 bgImageUrl = getImageUrl(found, 'large');
             }
        }
    }

    return (
        <div className='w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                {/* Left Column - Main Content */}
                <div className='lg:col-span-8 space-y-8'>
                    
                    {/* Key Metrics Grid */}
                    {keyMetrics.length > 0 && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {keyMetrics.map((metric: any, index: number) => (
                                <div
                                    key={index}
                                    className='bg-white rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow'
                                >
                                    <div className='flex items-start justify-between mb-4'>
                                        <div 
                                            className='p-2 rounded-lg text-white' 
                                            style={{ backgroundColor: metric.color || '#3b82f6' }}
                                        >
                                            <IconRenderer name={metric.icon} className="w-5 h-5" />
                                        </div>
                                        {metric.change && (
                                            <span className='px-3 py-1 rounded-full text-sm font-medium bg-[#ba8200]/10 text-[#ba8200]'>
                                                {metric.change}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className='text-2xl font-bold text-heading mb-2'>{metric.value}</h3>
                                    <p className='text-heading font-medium mb-1'>{metric.title}</p>
                                    <p className='text-sm text-muted'>{metric.period}</p>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* General Overview */}
                    {generalInfo && (generalInfo.title || generalInfo.description) && (
                        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-border'>
                            <div className='p-6'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <h2 className='text-2xl font-bold text-heading mb-2'>
                                            {generalInfo.title}
                                        </h2>
                                        <p className='text-muted'>
                                            {generalInfo.description}
                                        </p>
                                    </div>
                                    {generalInfo.right_content?.title && (
                                        <div className='flex items-center gap-2 text-secondary font-medium'>
                                            <IconRenderer name={generalInfo.right_content.icon || 'Box'} className='w-5 h-5' />
                                            <span>{generalInfo.right_content.title}</span>
                                        </div>
                                    )}
                                </div>

                                <div className='mb-8'>
                                    <div 
                                        className='min-h-[350px] md:min-h-[450px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-center bg-cover bg-center relative overflow-hidden'
                                        style={bgImageUrl ? { backgroundImage: `url('${bgImageUrl}')` } : {}}
                                    >
                                        {bgImageUrl && (
                                            <div className="absolute inset-0 bg-black/50"></div>
                                        )}
                                        <div className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-12">
                                            {generalInfo.overlay_text ? (
                                                <p className="text-base sm:text-lg md:text-xl font-semibold text-white">{generalInfo.overlay_text}</p>
                                            ) : (
                                                <p className={`text-sm sm:text-base md:text-lg ${bgImageUrl ? 'text-white' : 'text-muted'}`}>
                                                    {generalInfo.right_content?.description}
                                                </p>
                                            )}
                                            <IconRenderer name={generalInfo.right_content?.icon || 'Box'} className={`w-16 h-16 md:w-20 md:h-20 mx-auto ${bgImageUrl ? 'text-white' : 'text-footer'}`} />
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {generalInfo.features && generalInfo.features.length > 0 && generalInfo.features.map((feature: any, fIndex: number) => (
                                        <div key={`feat-${fIndex}`} className='flex items-center gap-3 p-3 bg-background-secondary rounded-lg'>
                                            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                                                <IconRenderer name={feature.icon || 'CheckCircle'} className='w-4 h-4 text-secondary' />
                                            </div>
                                            <span className='text-muted'>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Operations Table */}
                    {operationsData.length > 0 && (
                        <div className='bg-white rounded-xl border border-border shadow-lg overflow-hidden'>
                            <div className='p-6 border-b border-border'>
                                <h3 className='text-2xl font-bold text-heading flex items-center gap-2'>
                                    <IconRenderer name={pageMetadata.operations_table_info?.icon || 'MapPin'} className='w-6 h-6 text-secondary' />
                                    {pageMetadata.operations_table_info?.title || 'Business Operations'}
                                </h3>
                                <p className='text-muted mt-2'>
                                    {pageMetadata.operations_table_info?.description || 'Overview of key business areas and infrastructure'}
                                </p>
                            </div>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-background-secondary'>
                                        <tr>
                                            <th className='py-3 px-6 text-left text-sm font-semibold text-heading'>Business Area</th>
                                            <th className='py-3 px-6 text-left text-sm font-semibold text-heading'>Strategic Focus</th>
                                            <th className='py-3 px-6 text-left text-sm font-semibold text-heading'>Infrastructure</th>
                                            <th className='py-3 px-6 text-left text-sm font-semibold text-heading'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {operationsData.map((dataItem: any, index: number) => (
                                            <tr key={index} className='hover:bg-background-secondary transition-colors'>
                                                <td className='py-4 px-6'>
                                                    <div className='font-medium text-heading'>{dataItem.area}</div>
                                                </td>
                                                <td className='py-4 px-6'>
                                                    <span className='font-semibold text-heading'>{dataItem.focus}</span>
                                                </td>
                                                <td className='py-4 px-6'>
                                                    <div className='font-semibold text-heading'>{dataItem.infrastructure}</div>
                                                </td>
                                                <td className='py-4 px-6'>
                                                    <div className='flex items-center gap-1' style={{ color: dataItem.statusColor || '#16a34a' }}>
                                                        <IconRenderer name={dataItem.statusIcon || 'TrendingUp'} className='w-4 h-4' />
                                                        <span className='font-medium'>{dataItem.status}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar Content */}
                <div className='lg:col-span-4 space-y-8'>
                    {/* Business Categories / Key Verticals */}
                    {businessCategories.length > 0 && (
                        <div className='bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl p-6 border border-[#ba8200]/20'>
                            <h3 className='text-2xl font-bold text-heading mb-6 flex items-center gap-2'>
                                <IconRenderer name={pageMetadata.key_verticals_info?.icon || 'PieChart'} className='w-6 h-6' />
                                {pageMetadata.key_verticals_info?.title || 'Key Verticals'}
                            </h3>
                            <div className={`space-y-4 ${businessCategories.length > 3 ? 'lg:max-h-[550px] lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none]' : ''}`}>
                                {businessCategories.map((category: any, index: number) => (
                                    <div
                                        key={index}
                                        className='bg-white p-4 rounded-lg border border-slate-200 hover:border-[#ba8200] transition-colors'
                                    >
                                        <div className='flex items-center justify-between mb-3'>
                                            <div className='flex items-center gap-2'>
                                                <div className='p-2 bg-[#ba8200]/10 rounded-lg' style={{ color: category.color || '#ba8200' }}>
                                                    <IconRenderer name={category.icon || 'Package'} className="w-5 h-5" />
                                                </div>
                                                <h4 className='font-bold text-heading'>{category.title}</h4>
                                            </div>
                                            {category.growth && (
                                                <span className='px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium'>
                                                    {category.growth}
                                                </span>
                                            )}
                                        </div>
                                        {category.description && (
                                            <div className='mb-3'>
                                                <p className='text-sm text-muted mb-2'>{category.description}</p>
                                            </div>
                                        )}
                                        {category.topFocus && category.topFocus.length > 0 && category.topFocus[0] !== '' && (
                                            <div className='pt-3 border-t border-gray-100'>
                                                <p className='text-sm font-medium text-muted mb-2'>Focus Areas:</p>
                                                <div className='flex flex-wrap gap-2'>
                                                    {category.topFocus.map((focus: string, idx: number) => (
                                                        focus ? (
                                                            <span key={idx} className='px-2 py-1 bg-background-secondary text-muted text-xs rounded'>
                                                                {focus}
                                                            </span>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Network Operations */}
                    {networkOperations.length > 0 && (
                        <div className='bg-white rounded-xl border border-border p-6 shadow-sm'>
                            <h3 className='text-2xl font-bold text-heading mb-2 flex items-center gap-2'>
                                <IconRenderer name={pageMetadata.network_operations_info?.icon || 'Truck'} className='w-6 h-6' />
                                {pageMetadata.network_operations_info?.title || 'Network Operations'}
                            </h3>
                            {pageMetadata.network_operations_info?.description && (
                                <p className="text-muted mb-6">{pageMetadata.network_operations_info.description}</p>
                            )}
                            <div className={`space-y-4 ${networkOperations.length > 5 ? 'lg:max-h-[400px] lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none]' : ''}`}>
                                {networkOperations.map((tool: any, index: number) => (
                                    <div
                                        key={index}
                                        className='flex flex-col p-3 bg-background-secondary rounded-lg hover:bg-secondary/10 transition-colors group cursor-pointer'
                                        onClick={() => setExpandedNetworkOp(expandedNetworkOp === index ? null : index)}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <div className='p-2 bg-[#ba8200]/10 rounded-lg text-primary'>
                                                    <IconRenderer name={tool.icon || 'Truck'} className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className='font-medium text-heading group-hover:text-secondary'>{tool.title}</p>
                                                    <p className='text-sm text-muted'>{tool.description}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 text-footer group-hover:text-secondary transition-transform ${expandedNetworkOp === index ? 'rotate-90' : ''}`} />
                                        </div>
                                        {expandedNetworkOp === index && tool.full_description && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <p className="text-sm text-muted">{tool.full_description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Footer */}
            {((quickStats.left && quickStats.left.length > 0) || (quickStats.right && quickStats.right.length > 0)) && (
                <div className='mt-12 pt-8 border-t border-border'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
                        <div className="flex gap-8">
                            {quickStats.left?.map((stat: any, index: number) => (
                                <div key={`left-${index}`}>
                                    <p className='text-sm text-muted mb-2'>{stat.subtitle}</p>
                                    <p className='font-medium text-heading'>{stat.title}</p>
                                </div>
                            ))}
                        </div>
                        <div className='flex items-center gap-6'>
                            {quickStats.right?.map((stat: any, index: number) => (
                                <React.Fragment key={`right-${index}`}>
                                    <div className='text-center'>
                                        <p className='text-2xl font-bold text-heading'>{stat.title}</p>
                                        <p className='text-sm text-muted'>{stat.subtitle}</p>
                                    </div>
                                    {index < quickStats.right.length - 1 && (
                                        <div className='h-8 w-px bg-gray-300'></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OverviewPage