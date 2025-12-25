"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiSave, FiLock, FiBell, FiStore, FiShield, FiAlertTriangle } from "react-icons/fi";
import { toast } from "sonner";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [generalSettings, setGeneralSettings] = useState({
        storeName: "ROOKIES Bakery",
        storeEmail: "info@rookies.com",
        storePhone: "+92 300 1234567",
        storeAddress: "123 Main Street, Karachi, Pakistan",
        taxRate: "10",
        lowStockThreshold: "10",
    });

    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: false,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        lowStockAlerts: true,
        newOrderAlerts: true,
        dailyReports: false,
    });

    const handleSaveGeneral = async () => {
        setLoading(true);
        // TODO: Implement save to database
        setTimeout(() => {
            toast.success("General settings saved successfully");
            setLoading(false);
        }, 1000);
    };

    const handleChangePassword = () => {
        if (!securitySettings.currentPassword || !securitySettings.newPassword) {
            toast.error("Please fill in all password fields");
            return;
        }
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (securitySettings.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        // TODO: Implement password change
        toast.success("Password changed successfully");
        setSecuritySettings({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            twoFactorEnabled: securitySettings.twoFactorEnabled,
        });
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 1, label: "Weak", color: "text-red-600" };
        if (password.length < 10) return { strength: 2, label: "Medium", color: "text-amber-600" };
        return { strength: 3, label: "Strong", color: "text-green-600" };
    };

    const passwordStrength = getPasswordStrength(securitySettings.newPassword);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your admin account and store settings</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="store">Store</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Configure general application settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                    <Input
                                        id="taxRate"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={generalSettings.taxRate}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                                    <Input
                                        id="lowStockThreshold"
                                        type="number"
                                        min="0"
                                        value={generalSettings.lowStockThreshold}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, lowStockThreshold: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Separator />
                            <Button onClick={handleSaveGeneral} disabled={loading}>
                                <FiSave className="w-4 h-4 mr-2" />
                                {loading ? "Saving..." : "Save Settings"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FiLock className="w-5 h-5 text-gray-600" />
                                <CardTitle>Change Password</CardTitle>
                            </div>
                            <CardDescription>
                                Update your account password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password *</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={securitySettings.currentPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password *</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={securitySettings.newPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                />
                                {securitySettings.newPassword && (
                                    <div className="flex items-center gap-2">
                                        <div className={`text-sm font-medium ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${
                                                    passwordStrength.strength === 1
                                                        ? "bg-red-500 w-1/3"
                                                        : passwordStrength.strength === 2
                                                        ? "bg-amber-500 w-2/3"
                                                        : passwordStrength.strength === 3
                                                        ? "bg-green-500 w-full"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={securitySettings.confirmPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                />
                                {securitySettings.confirmPassword &&
                                    securitySettings.newPassword !== securitySettings.confirmPassword && (
                                        <p className="text-sm text-red-600">Passwords do not match</p>
                                    )}
                            </div>
                            <Separator />
                            <Button onClick={handleChangePassword} disabled={loading}>
                                <FiLock className="w-4 h-4 mr-2" />
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FiShield className="w-5 h-5 text-gray-600" />
                                <CardTitle>Security Features</CardTitle>
                            </div>
                            <CardDescription>
                                Manage additional security options
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                                    <p className="text-sm text-gray-500">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <Switch
                                    id="twoFactor"
                                    checked={securitySettings.twoFactorEnabled}
                                    onCheckedChange={(checked) =>
                                        setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
                                    }
                                />
                            </div>
                            {securitySettings.twoFactorEnabled && (
                                <Alert>
                                    <FiAlertTriangle className="w-4 h-4" />
                                    <AlertTitle>Two-Factor Authentication</AlertTitle>
                                    <AlertDescription>
                                        Two-factor authentication is enabled. You'll need to verify your identity when logging in.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FiBell className="w-5 h-5 text-gray-600" />
                                <CardTitle>Notification Preferences</CardTitle>
                            </div>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                                </div>
                                <Switch
                                    id="emailNotifications"
                                    checked={notificationSettings.emailNotifications}
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                                    <p className="text-sm text-gray-500">Get notified when products are low in stock</p>
                                </div>
                                <Switch
                                    id="lowStockAlerts"
                                    checked={notificationSettings.lowStockAlerts}
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="newOrderAlerts">New Order Alerts</Label>
                                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                                </div>
                                <Switch
                                    id="newOrderAlerts"
                                    checked={notificationSettings.newOrderAlerts}
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings({ ...notificationSettings, newOrderAlerts: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dailyReports">Daily Reports</Label>
                                    <p className="text-sm text-gray-500">Receive daily sales and inventory reports</p>
                                </div>
                                <Switch
                                    id="dailyReports"
                                    checked={notificationSettings.dailyReports}
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                                    }
                                />
                            </div>
                            <Separator />
                            <Button onClick={() => {
                                toast.success("Notification settings saved");
                            }}>
                                <FiSave className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Store Settings */}
                <TabsContent value="store" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FiStore className="w-5 h-5 text-gray-600" />
                                <CardTitle>Store Information</CardTitle>
                            </div>
                            <CardDescription>
                                Manage your store details and contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">Store Name *</Label>
                                <Input
                                    id="storeName"
                                    value={generalSettings.storeName}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                                    placeholder="ROOKIES Bakery"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">Store Email</Label>
                                    <Input
                                        id="storeEmail"
                                        type="email"
                                        value={generalSettings.storeEmail}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                                        placeholder="info@rookies.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storePhone">Store Phone</Label>
                                    <Input
                                        id="storePhone"
                                        type="tel"
                                        value={generalSettings.storePhone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, storePhone: e.target.value })}
                                        placeholder="+92 300 1234567"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="storeAddress">Store Address</Label>
                                <Textarea
                                    id="storeAddress"
                                    value={generalSettings.storeAddress}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeAddress: e.target.value })}
                                    placeholder="123 Main Street, Karachi, Pakistan"
                                    rows={3}
                                />
                            </div>
                            <Separator />
                            <Button onClick={handleSaveGeneral} disabled={loading}>
                                <FiSave className="w-4 h-4 mr-2" />
                                {loading ? "Saving..." : "Save Store Information"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
