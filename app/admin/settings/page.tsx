import { AdminCard } from "@/components/admin/Card";
import { AdminButton } from "@/components/admin/Button";
import { FormField } from "@/components/admin/FormField";
import { Input } from "@/components/ui/input";
import { FiSave, FiLock } from "react-icons/fi";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your admin account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCard
                    header={
                        <div className="flex items-center gap-2">
                            <FiLock className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold">Change Password</h2>
                        </div>
                    }
                >
                    <form className="space-y-4">
                        <FormField label="Current Password" required>
                            <Input type="password" placeholder="Enter current password" />
                        </FormField>
                        <FormField label="New Password" required>
                            <Input type="password" placeholder="Enter new password" />
                        </FormField>
                        <FormField label="Confirm New Password" required>
                            <Input type="password" placeholder="Confirm new password" />
                        </FormField>
                        <AdminButton variant="primary" icon={<FiSave className="w-4 h-4" />}>
                            Update Password
                        </AdminButton>
                    </form>
                </AdminCard>

                <AdminCard
                    header={<h2 className="text-lg font-semibold">General Settings</h2>}
                >
                    <div className="space-y-4">
                        <FormField label="Store Name">
                            <Input defaultValue="Rookies" />
                        </FormField>
                        <FormField label="Tax Rate (%)">
                            <Input type="number" defaultValue="10" />
                        </FormField>
                        <FormField label="Low Stock Threshold">
                            <Input type="number" defaultValue="10" />
                        </FormField>
                        <AdminButton variant="primary" icon={<FiSave className="w-4 h-4" />}>
                            Save Settings
                        </AdminButton>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}

