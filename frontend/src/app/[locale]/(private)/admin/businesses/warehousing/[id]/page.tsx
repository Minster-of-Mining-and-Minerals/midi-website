"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    useGetWarehousesQuery,
    useUpdateWarehouseMutation,
    useAddWarehouseImageMutation,
    useDeleteWarehouseImageMutation,
} from '@/redux/api/businessApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { notify, extractErrorMessage } from '@/utils/notification';
import { EditFileUpload, UploadedFileInfo } from '@/components/common/EditFileUpload';
import { getFileUrl } from '@/utils/fileUrl';
import { ComponentGuard } from "@/components/auth/ComponentGuard";

const EditWarehousePage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: warehouses = [], isLoading: isWarehousesLoading, refetch } = useGetWarehousesQuery();
    const warehouse = warehouses.find(w => w.warehouse_id === id);

    const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();
    const [addWarehouseImage] = useAddWarehouseImageMutation();
    const [deleteWarehouseImage] = useDeleteWarehouseImageMutation();

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

    useEffect(() => {
        if (warehouse) {
            setName(warehouse.name || '');
            setRegion(warehouse.region || '');
            setCity(warehouse.city || '');
            setArea(warehouse.area || '');
            setAddress(warehouse.address || '');
            setDescription(warehouse.description || '');
            setStatus(warehouse.status || 'Active');
            setOrder(warehouse.order || 0);

            // Note: We're not pre-filling EditFileUpload with old images because the API 
            // for Warehouses uses simple URLs instead of Attachment IDs. 
            // We'll show existing images in a separate section below.
        }
    }, [warehouse]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !region) {
            notify.error("Name and Region are required.");
            return;
        }

        try {
            notify.loading("Updating facility...", { id: "update-warehouse" });
            await updateWarehouse({
                id,
                data: {
                    name,
                    region,
                    city,
                    area,
                    address,
                    description,
                    status,
                    order
                }
            }).unwrap();

            notify.success("Facility updated successfully!", { id: "update-warehouse" });

            // Handle new image uploads
            if (uploadedImages.length > 0) {
                notify.loading("Saving new images...", { id: "upload-images" });
                for (const file of uploadedImages) {
                    if (file.file_path && file.isBlob) {
                        await addWarehouseImage({
                            warehouseId: id,
                            image_url: file.file_path,
                            order: 0
                        }).unwrap();
                    }
                }
                notify.success("Images saved successfully!", { id: "upload-images" });
            }

            refetch();
            router.push('/admin/businesses/warehousing');
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to update warehouse.'), { id: "update-warehouse" });
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!window.confirm("Delete this image?")) return;
        try {
            await deleteWarehouseImage(imageId).unwrap();
            notify.success('Image deleted!');
            refetch();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to delete image.'));
        }
    };

    if (isWarehousesLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!warehouse) {
        return <div className="p-12 text-center text-red-500">Warehouse not found.</div>;
    }

    return (
        <div className="p-6 w-full mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.push('/admin/businesses/warehousing')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Facility</h1>
                    <p className="text-muted-foreground mt-1">Update details for {warehouse.name}.</p>
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

                {/* Existing Images */}
                <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Existing Images</h3>
                    {warehouse.images && warehouse.images.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {warehouse.images.map(img => (
                                <div key={img.image_id} className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0 group border border-slate-200">
                                    <img src={getFileUrl(img.image_url)} alt="Facility" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img.image_id)}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No images added yet.</p>
                    )}
                </div>

                <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Add New Images</h3>
                    <EditFileUpload
                        id="warehouse-images"
                        label="Upload More Images"
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
                        <Button type="submit" disabled={isUpdating} className="flex items-center gap-2">
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </ComponentGuard>
                </div>
            </form>
        </div>
    );
};

export default EditWarehousePage;
