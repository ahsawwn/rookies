"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiMail, FiSend, FiUsers, FiFileText } from "react-icons/fi";
import { toast } from "sonner";

const emailTemplates = [
    {
        id: "order-confirmation",
        name: "Order Confirmation",
        subject: "Order Confirmation - {{orderNumber}}",
        description: "Sent when an order is placed",
    },
    {
        id: "ready-pickup",
        name: "Ready for Pickup",
        subject: "Your Order is Ready! - {{orderNumber}}",
        description: "Notify customers when order is ready",
    },
    {
        id: "weekly-menu",
        name: "Weekly Menu Announcement",
        subject: "This Week's Specials at ROOKES",
        description: "Announce weekly menu to customers",
    },
    {
        id: "special-offers",
        name: "Special Offers",
        subject: "Special Offer from ROOKES Bakery",
        description: "Send promotional offers",
    },
];

const customerSegments = [
    { id: "all", name: "All Customers" },
    { id: "recent", name: "Recent Customers (last 30 days)" },
    { id: "frequent", name: "Frequent Customers (5+ orders)" },
    { id: "inactive", name: "Inactive Customers (no orders in 60 days)" },
];

export function EmailCenterClient() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [selectedSegment, setSelectedSegment] = useState<string>("all");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleTemplateSelect = (templateId: string) => {
        const template = emailTemplates.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setSubject(template.subject);
            setMessage(`Dear Customer,\n\n${template.description}\n\nThank you for choosing ROOKES Bakery!\n\nBest regards,\nROOKES Team`);
        }
    };

    const handleSend = async () => {
        if (!selectedTemplate || !subject || !message) {
            toast.error("Please fill in all fields");
            return;
        }

        setSending(true);
        try {
            const response = await fetch("/api/email-center/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    segment: selectedSegment,
                    subject,
                    message,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Email sent to ${data.recipientCount || 0} customers`);
                setSubject("");
                setMessage("");
                setSelectedTemplate("");
            } else {
                toast.error(data.error || "Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Email Center</h1>
                <p className="text-gray-600 mt-1">Send bulk emails to customer segments</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FiFileText className="w-5 h-5" />
                            Email Templates
                        </CardTitle>
                        <CardDescription>Choose a pre-designed template</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {emailTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                    selectedTemplate === template.id
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                <div className="font-semibold text-sm">{template.name}</div>
                                <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Email Composer */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FiMail className="w-5 h-5" />
                            Compose Email
                        </CardTitle>
                        <CardDescription>Create and send your email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="segment">Customer Segment</Label>
                            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {customerSegments.map((segment) => (
                                        <SelectItem key={segment.id} value={segment.id}>
                                            {segment.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Email message"
                                rows={10}
                                className="resize-none"
                            />
                        </div>

                        <Button
                            onClick={handleSend}
                            disabled={sending || !selectedTemplate || !subject || !message}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                            <FiSend className="w-4 h-4 mr-2" />
                            {sending ? "Sending..." : "Send Email"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Email Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FiUsers className="w-5 h-5" />
                        Email Analytics
                    </CardTitle>
                    <CardDescription>Track your email performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-gray-600">Emails Sent</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">0%</div>
                            <div className="text-sm text-gray-600">Open Rate</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">0%</div>
                            <div className="text-sm text-gray-600">Click Rate</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Analytics will be available once Resend webhooks are configured
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

