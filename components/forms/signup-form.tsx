"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/ui/otp-input";
import { authClient, signUp as authSignUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { signUp, sendOTP, verifyOTPAndSignup } from "@/server/users";

const emailFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const phoneFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+92\d{10}$/, "Phone must be in format +92XXXXXXXXXX"),
});

type SignupMethod = "email" | "phone" | "google";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
    const [phoneOTPSent, setPhoneOTPSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOTP, setIsSendingOTP] = useState(false);

    const router = useRouter();

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
        resolver: zodResolver(phoneFormSchema),
        defaultValues: {
            name: "",
            phone: "+92",
        },
    });

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
            if (typeof window !== "undefined") {
                localStorage.setItem("lastLoginMethod", "google");
            }
        } catch (error) {
            console.error("Google sign in error:", error);
            toast.error("Failed to sign up with Google");
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (values: z.infer<typeof phoneFormSchema>) => {
        setIsSendingOTP(true);
        const { success, message } = await sendOTP(values.phone);
        
        if (success) {
            setPhoneOTPSent(true);
            toast.success(message);
        } else {
            toast.error(message);
        }
        setIsSendingOTP(false);
    };

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) {
            toast.error("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);
        const phone = phoneForm.getValues("phone");
        const name = phoneForm.getValues("name");
        const { success, message } = await verifyOTPAndSignup(phone, otpCode, name);

        if (success) {
            if (typeof window !== "undefined") {
                localStorage.setItem("lastLoginMethod", "phone");
                
                // Store session in localStorage
                const sessionData = await authClient.getSession();
                if (sessionData.data?.session) {
                    const { storeSession } = await import("@/lib/session-storage");
                    if (sessionData.data?.session && 'user' in sessionData.data.session) {
                        const session = sessionData.data.session as any;
                        storeSession({
                            user: session.user,
                            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        });
                    }
                    // Dispatch custom event to notify components immediately
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent('sessionUpdated'));
                    }
                }
            }
            
            toast.success(message);
            
            // Check for redirect URL
            const redirectUrl = typeof window !== "undefined" 
                ? localStorage.getItem("redirectAfterLogin") || "/"
                : "/";
            
            if (typeof window !== "undefined") {
                localStorage.removeItem("redirectAfterLogin");
            }
            
            router.push(redirectUrl);
            router.refresh();
        } else {
            toast.error(message);
            setOtpCode("");
        }
        setIsLoading(false);
    };

    async function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
        setIsLoading(true);
        try {
            const result = await authSignUp.email({
                email: values.email,
                password: values.password,
                name: values.username,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to sign up");
                setIsLoading(false);
                return;
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("lastLoginMethod", "email");
            }
            
            toast.success("Signed up successfully");
            
            // Check for redirect URL
            const redirectUrl = typeof window !== "undefined" 
                ? localStorage.getItem("redirectAfterLogin") || "/"
                : "/";
            
            if (typeof window !== "undefined") {
                localStorage.removeItem("redirectAfterLogin");
            }
            
            router.push(redirectUrl);
            router.refresh();
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("An error occurred during signup");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500", className)} {...props}>
            <Card className="border-2 border-pink-100 shadow-xl backdrop-blur-sm bg-white/95 transition-all duration-300 hover:shadow-2xl hover:border-pink-200">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-2 duration-500">
                        Create your account
                    </CardTitle>
                    <CardDescription className="text-gray-600 animate-in fade-in slide-in-from-top-3 duration-500 delay-100">
                        Signup with Google, email, or phone number
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Google Signup Button */}
                    <div className="flex flex-col gap-4 mb-6">
                        <Button
                            className="relative w-full group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] border-pink-200 hover:border-pink-300 hover:bg-pink-50/50"
                            onClick={signInWithGoogle}
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                        >
                            <svg 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
                            >
                                <title>Google</title>
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className="font-medium">Signup with Google</span>
                        </Button>
                    </div>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-pink-200 after:border-t mb-6">
                        <span className="relative z-10 bg-white px-3 text-gray-600 font-medium">
                            Or continue with
                        </span>
                    </div>

                    {/* Signup Method Tabs */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setSignupMethod("email");
                                setPhoneOTPSent(false);
                                setOtpCode("");
                            }}
                            className={cn(
                                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                                signupMethod === "email"
                                    ? "bg-white text-pink-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSignupMethod("phone");
                                setPhoneOTPSent(false);
                                setOtpCode("");
                            }}
                            className={cn(
                                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                                signupMethod === "phone"
                                    ? "bg-white text-pink-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Phone
                        </button>
                    </div>

                    {/* Email Signup Form */}
                    {signupMethod === "email" && (
                        <Form form={emailForm} onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                            <div className="grid gap-6">
                                <FormField
                                    control={emailForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-semibold">Username</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="shadcn" 
                                                    autoComplete="username"
                                                    className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="m@example.com" 
                                                    type="email"
                                                    autoComplete="email"
                                                    className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={emailForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-semibold">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="********"
                                                    {...field}
                                                    type="password"
                                                    autoComplete="new-password"
                                                    className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    className="w-full font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white" 
                                    disabled={isLoading} 
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin mr-2" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Sign up"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}

                    {/* Phone Signup Form */}
                    {signupMethod === "phone" && (
                        <Form form={phoneForm} onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-6">
                            <div className="grid gap-6">
                                {!phoneOTPSent ? (
                                    <>
                                        <FormField
                                            control={phoneForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="John Doe" 
                                                            autoComplete="name"
                                                            className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={phoneForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="+92XXXXXXXXXX" 
                                                            type="tel" 
                                                            autoComplete="tel"
                                                            className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <p className="text-xs text-gray-500">
                                                        Enter your Pakistani phone number with country code (+92)
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button 
                                            className="w-full font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white" 
                                            disabled={isSendingOTP} 
                                            type="submit"
                                        >
                                            {isSendingOTP ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin mr-2" />
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                "Send OTP via WhatsApp"
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <FormLabel className="text-sm font-semibold">Enter OTP Code</FormLabel>
                                            <p className="text-xs text-gray-600 mb-4">
                                                We sent a 6-digit code to {phoneForm.getValues("phone")} via WhatsApp
                                            </p>
                                            <OTPInput
                                                value={otpCode}
                                                onChange={setOtpCode}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => {
                                                    setPhoneOTPSent(false);
                                                    setOtpCode("");
                                                }}
                                                disabled={isLoading}
                                            >
                                                Change Number
                                            </Button>
                                            <Button 
                                                className="flex-1 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white" 
                                                disabled={isLoading || otpCode.length !== 6} 
                                                onClick={handleVerifyOTP}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="size-4 animate-spin mr-2" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    "Verify & Signup"
                                                )}
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full text-sm text-gray-600 hover:text-pink-600"
                                            onClick={async () => {
                                                setIsSendingOTP(true);
                                                const phone = phoneForm.getValues("phone");
                                                const { success, message } = await sendOTP(phone);
                                                if (success) {
                                                    toast.success("New OTP sent!");
                                                } else {
                                                    toast.error(message);
                                                }
                                                setIsSendingOTP(false);
                                            }}
                                            disabled={isSendingOTP}
                                        >
                                            {isSendingOTP ? "Resending..." : "Resend OTP"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Form>
                    )}

                    <div className="text-center text-sm mt-6">
                        Already have an account?{" "}
                        <Link 
                            className="underline underline-offset-4 font-medium transition-colors duration-200 hover:text-rose-600 text-pink-600" 
                            href="/login"
                        >
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-gray-600 text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-pink-600 animate-in fade-in duration-500 delay-600">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="transition-colors duration-200 hover:text-pink-600">Terms of Service</Link> and{" "}
                <Link href="#" className="transition-colors duration-200 hover:text-pink-600">Privacy Policy</Link>.
            </div>
        </div>
    );
}
