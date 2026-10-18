import { FileText, Upload, Clock, Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';



const applicationProcess = [
    { step: 1, title: "Account Registration", description: "Create your verified applicant account", duration: "Instant" },
    { step: 2, title: "Application Form", description: "Complete the digital application form", duration: "1-2 days" },
    { step: 3, title: "Document Upload", description: "Submit required supporting documents", duration: "1-3 days" },
    { step: 4, title: "Fee Payment", description: "Pay applicable fees online", duration: "Instant" },
    { step: 5, title: "Review Process", description: "Technical and compliance review", duration: "30-90 days" },
    { step: 6, title: "Decision & License", description: "Receive decision and download license", duration: "1-2 days" }
]

const requiredDocuments = [
    { title: "Company Registration", format: "PDF", mandatory: true },
    { title: "Technical Proposal", format: "PDF", mandatory: true },
    { title: "Environmental Impact Assessment", format: "PDF", mandatory: true },
    { title: "Financial Capability Proof", format: "PDF/Excel", mandatory: true },
    { title: "Community Development Plan", format: "PDF", mandatory: false },
    { title: "Safety Management Plan", format: "PDF", mandatory: true }
]

const ApplicationPage = () => {
    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>

            <div className='w-7xl mx-auto px-6 py-12'>


                {/* Application Process Timeline */}
                <div className='mb-16'>
                    <h3 className='text-3xl font-bold text-heading mb-10 text-center'>
                        Application Process Timeline
                    </h3>
                    <div className='relative'>
                        {/* Timeline line */}
                        <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#ba8200] to-green-600 hidden lg:block' />

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {applicationProcess.map((process, index) => (
                                <div
                                    key={index}
                                    className={`relative ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12 lg:mt-24'}`}
                                >
                                    <div className='bg-white p-6 rounded-xl border border-border shadow-lg'>
                                        <div className='flex items-center justify-between lg:justify-start lg:flex-row-reverse gap-4 mb-4'>
                                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#ba8200] to-[#e5af37] flex items-center justify-center text-white font-bold text-lg'>
                                                {process.step}
                                            </div>
                                            <h4 className='text-xl font-bold text-heading'>{process.title}</h4>
                                        </div>
                                        <p className='text-muted mb-3'>{process.description}</p>
                                        <div className='flex items-center gap-2 text-secondary font-medium'>
                                            <Clock className='w-4 h-4' />
                                            <span>{process.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Required Documents & Quick Actions */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Required Documents */}
                    <div className='bg-white rounded-xl border border-border p-8 shadow-lg'>
                        <h3 className='text-2xl font-bold text-heading mb-6 flex items-center gap-3'>
                            <FileText className='w-6 h-6 text-secondary' />
                            Required Documents
                        </h3>
                        <div className='space-y-4'>
                            {requiredDocuments.map((doc, index) => (
                                <div
                                    key={index}
                                    className='flex items-center justify-between p-4 bg-background-secondary rounded-lg hover:bg-secondary/10 transition-colors'
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doc.mandatory ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-secondary'}`}>
                                            {doc.mandatory ? '!' : '✓'}
                                        </div>
                                        <div>
                                            <p className='font-medium text-heading'>{doc.title}</p>
                                            <p className='text-sm text-muted'>{doc.format} format</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${doc.mandatory ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-secondary'}`}>
                                        {doc.mandatory ? 'Required' : 'Optional'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className='space-y-6'>
                        <div className='bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-xl p-8 border border-[#ba8200]/20'>
                            <h3 className='text-2xl font-bold text-heading mb-6'>Ready to Apply?</h3>
                            <div className='space-y-4'>
                                <button className='w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2'>
                                    <Upload className='w-5 h-5' />
                                    Start New Application
                                </button>
                                <button className='w-full border-2 border-secondary text-secondary py-4 rounded-lg font-semibold hover:bg-secondary/10 transition-colors'>
                                    Track Existing Application
                                </button>
                                <button className='w-full border border-border text-muted py-4 rounded-lg font-semibold hover:bg-background-secondary transition-colors'>
                                    Download Application Guide
                                </button>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className='bg-white rounded-xl border border-border p-6'>
                            <div className='flex items-start gap-3 mb-4'>
                                <AlertCircle className='w-6 h-6 text-amber-500 flex-shrink-0 mt-1' />
                                <div>
                                    <h4 className='font-bold text-heading mb-2'>Need Assistance?</h4>
                                    <p className='text-muted mb-3'>
                                        Our licensing support team is available to guide you through the application process.
                                    </p>
                                    <div className='space-y-2'>
                                        <p className='text-sm text-muted'>Email: licensing@mines.gov.et</p>
                                        <p className='text-sm text-muted'>Phone: +251 11 123 4567</p>
                                        <p className='text-sm text-muted'>Office Hours: 8:30 AM - 5:30 PM (EAT)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationPage