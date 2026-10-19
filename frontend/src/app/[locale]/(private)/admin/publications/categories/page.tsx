import CategoryList from "@/features/publications/CategoryList";
import PublicationsAdminHeader from "@/features/publications/PublicationsAdminHeader";

export default function AdminPublicationCategoriesPage() {
    return (
        <div className="space-y-5 p-6">
            <PublicationsAdminHeader />
            <CategoryList />
        </div>
    );
}
