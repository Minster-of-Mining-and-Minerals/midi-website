"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useCreateWarehouseMutation,
    useAddWarehouseImageMutation,
} from '@/redux/api/businessApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft } from 'lucide-react';
import { notify, extractErrorMessage } from '@/utils/notification';
import { EditFileUpload, UploadedFileInfo } from '@/components/common/EditFileUpload';
import { ComponentGuard } from "@/components/auth/ComponentGuard";

const CreateWarehousePage = () => {
    const router = useRouter();
    const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
    const [addWarehouseImage] = useAddWarehouseImageMutation();

    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [order, setOrder] = useState<number>(0);

    const [imageIds, setImageIds] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedFileInfo[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !region) {
            notify.error("Name and Region are required.");
            return;
        }

        try {
            notify.loading("Creating facility...", { id: "create-warehouse" });
            const result = await createWarehouse({
                name,
                region,
                city,
                area,
                address,
                description,
                status,
                order
            }).unwrap();

            notify.success("Facility created successfully!", { id: "create-warehouse" });

            // Handle image uploads
            if (result.warehouse_id && uploadedImages.length > 0) {
                notify.loading("Saving images...", { id: "upload-images" });
                for (const file of uploadedImages) {
                    if (file.file_path) {
                        await addWarehouseImage({
                            warehouseId: result.warehouse_id,
                            image_url: file.file_path,
                            order: 0
                        }).unwrap();
                    }
                }
                notify.success("Images saved successfully!", { id: "upload-images" });
            }

            router.push('/admin/businesses/warehousing');
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to create warehouse.'), { id: "create-warehouse" });
        }
    };

    return (
        <div className="p-6 w-full mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.push('/admin/businesses/warehousing')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Facility</h1>
                    <p className="text-muted-foreground mt-1">Create a new warehousing facility.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Facility Name <span className="text-red-500">*</span></label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Central Hub"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Region <span className="text-red-500">*</span></label>
                        <Input
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            placeholder="e.g., Addis Ababa"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g., Addis Ababa"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Area (e.g., 3,200 m²)</label>
                        <Input
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="e.g., 3,200 m²"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-border p-2 rounded-md bg-card text-card-foreground text-sm h-10"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Under Construction">Under Construction</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Order</label>
                        <Input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(Number(e.target.value))}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Detailed address"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Details about the facility..."
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Facility Images</h3>
                    <EditFileUpload
                        id="warehouse-images"
                        label="Upload Images"
                        accept="image/*"
                        value={imageIds}
                        onChange={(ids, files) => {
                            setImageIds(ids);
                            if (files) setUploadedImages(files);
                        }}
                        multiple={true}
                        showPreview={true}
                    />
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/businesses/warehousing')}>
                        Cancel
                    </Button>
                    <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                        <Button type="submit" disabled={isCreating} className="flex items-center gap-2">
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Create Facility
                        </Button>
                    </ComponentGuard>
                </div>
            </form>
        </div>
    );
};

export default CreateWarehousePage;
