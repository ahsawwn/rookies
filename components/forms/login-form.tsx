"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { authClient, signIn as authSignIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { sendOTP, verifyOTPAndLogin } from "@/server/users";
import { Badge } from "../ui/badge";

const emailFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const phoneFormSchema = z.object({
  phone: z.string().min(1, "Phone number is required").refine((val) => {
    return /^\+92\d{10}$/.test(val);
  }, "Phone must be in format +92XXXXXXXXXX"),
});

type LoginMethod = "email" | "phone" | "google";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const router = useRouter();

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "+92",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("lastLoginMethod");
    if (stored === "phone") {
      setLoginMethod("phone");
    } else if (stored === "google") {
      setLoginMethod("google");
    }
    setLastMethod(stored);
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem("lastLoginMethod", "google");
      
      // #region agent log
      const redirectAfterLogin = typeof window !== "undefined" ? localStorage.getItem("redirectAfterLogin") : null;
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:85',message:'Google sign in started',data:{redirectAfterLogin,callbackURL:'/'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      
      // Get redirectAfterLogin from localStorage and use it as callbackURL
      const redirectUrl = typeof window !== "undefined" 
        ? localStorage.getItem("redirectAfterLogin") || "/"
        : "/";
      
      // Better Auth's signIn.social makes a POST request to /api/auth/sign-in/social
      // The response should contain a URL to redirect to Google OAuth
      // If it doesn't, we'll use the direct authorize endpoint
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });
      
      console.log("Google OAuth result:", result);
      console.log("Result type:", typeof result);
      console.log("Result keys:", result ? Object.keys(result) : []);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:96',message:'Google OAuth result received',data:{hasResult:!!result,resultType:typeof result,hasData:!!result?.data,hasUrl:!!result?.data?.url,resultString:result ? JSON.stringify(result).substring(0,300) : 'null',redirectUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      
      // Check multiple possible response formats
      const oauthUrl = result?.data?.url || result?.url || result?.redirectUrl || result?.data?.redirectUrl;
      
      if (oauthUrl && typeof oauthUrl === 'string') {
        console.log("Found OAuth URL, redirecting:", oauthUrl);
        window.location.href = oauthUrl;
        return;
      }
      
      // If no URL in response, use direct navigation to Better Auth's authorize endpoint
      // Better Auth catch-all route handles: /api/auth/authorize/{provider}
      console.log("No URL in result, using direct authorize endpoint");
      const baseURL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const authUrl = `${baseURL}/api/auth/authorize/google?callbackURL=${encodeURIComponent(redirectUrl)}`;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:103',message:'Using direct Google OAuth URL',data:{authUrl,redirectUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      
      console.log("Redirecting to:", authUrl);
      window.location.href = authUrl;
    } catch (error: any) {
      console.error("Google sign in outer error:", error);
      toast.error("Failed to sign in with Google. Please check console.");
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (values: z.infer<typeof phoneFormSchema>) => {
    setIsSendingOTP(true);
    const { success, message } = await sendOTP(values.phone);
    
    if (success) {
      setPhoneOTPSent(true);
      toast.success(message, { duration: 5000 });
    } else {
      console.error('OTP send failed:', message);
      toast.error(message, { duration: 7000 });
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
    
    // #region agent log
    const redirectAfterLogin = typeof window !== "undefined" ? localStorage.getItem("redirectAfterLogin") : null;
    fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:131',message:'Phone OTP verification started',data:{redirectAfterLogin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    const { success, message } = await verifyOTPAndLogin(phone, otpCode);

    if (success) {
      localStorage.setItem("lastLoginMethod", "phone");
      
      // Store session in localStorage
      const sessionData = await authClient.getSession();
      if (sessionData.data?.session) {
        const { storeSession } = await import("@/lib/session-storage");
        storeSession({
          user: sessionData.data.session.user,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        // Dispatch custom event to notify components immediately
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent('sessionUpdated'));
        }
      }
      
      toast.success(message);
      
      // Check for redirect URL
      const redirectUrl = typeof window !== "undefined" 
        ? localStorage.getItem("redirectAfterLogin") || "/"
        : "/";
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:161',message:'Phone OTP success, redirecting',data:{redirectUrl,willRemoveRedirectAfterLogin:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectAfterLogin");
      }
      
      // Small delay to ensure session is stored and components are notified
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 100);
    } else {
      toast.error(message);
      setOtpCode("");
    }
    setIsLoading(false);
  };

  async function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    try {
      // #region agent log
      const redirectAfterLogin = typeof window !== "undefined" ? localStorage.getItem("redirectAfterLogin") : null;
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:181',message:'Email login started',data:{redirectAfterLogin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      const result = await authSignIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("lastLoginMethod", "email");
      
      // Link guest orders to user account
      try {
        const { linkGuestOrdersToUser } = await import("@/server/orders");
        const guestEmail = values.email;
        const guestSessionId = typeof window !== "undefined" ? localStorage.getItem("guestSessionId") : undefined;
        
        // Get user ID from session
        const sessionData = await authClient.getSession();
        if (sessionData.data?.session?.user?.id) {
          await linkGuestOrdersToUser(
            sessionData.data.session.user.id,
            guestEmail,
            guestSessionId || undefined
          );
        }
      } catch (error) {
        console.error("Error linking guest orders:", error);
        // Don't block login if linking fails
      }
      
      toast.success("Signed in successfully");
      
      // Check for redirect URL (e.g., from cart page)
      const redirectUrl = typeof window !== "undefined" 
        ? localStorage.getItem("redirectAfterLogin") || "/"
        : "/";
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login-form.tsx:202',message:'Email login success, redirecting',data:{redirectUrl,willRemoveRedirectAfterLogin:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectAfterLogin");
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500", className)} {...props}>
      <Card className="border-2 border-pink-100 shadow-xl backdrop-blur-sm bg-white/95 transition-all duration-300 hover:shadow-2xl hover:border-pink-200">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-2 duration-500">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-600 animate-in fade-in slide-in-from-top-3 duration-500 delay-100">
            Login with Google, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Login Button */}
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
              <span className="font-medium">Login with Google</span>
              {lastMethod === "google" && (
                <Badge className="absolute right-2 text-[9px] bg-pink-100 text-pink-700 border-pink-200 animate-in fade-in zoom-in-95 duration-300">
                  last used
                </Badge>
              )}
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-pink-200 after:border-t mb-6">
            <span className="relative z-10 bg-white px-3 text-gray-600 font-medium">
              Or continue with
            </span>
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email");
                setPhoneOTPSent(false);
                setOtpCode("");
              }}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                loginMethod === "email"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("phone");
                setPhoneOTPSent(false);
                setOtpCode("");
              }}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                loginMethod === "phone"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Phone
            </button>
          </div>

          {/* Email Login Form */}
          {loginMethod === "email" && (
            <Form form={emailForm} onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold">Email</FormLabel>
                        {lastMethod === "email" && (
                          <Badge className="text-[9px] bg-pink-100 text-pink-700 border-pink-200">
                            last used
                          </Badge>
                        )}
                      </div>
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
                <div className="flex flex-col gap-2">
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
                            autoComplete="current-password"
                            className="transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    className="ml-auto text-sm underline-offset-4 hover:underline transition-colors duration-200 hover:text-pink-600 text-gray-600"
                    href="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Button 
                  className="w-full font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white" 
                  disabled={isLoading} 
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </Form>
          )}

          {/* Phone Login Form */}
          {loginMethod === "phone" && (
            <Form form={phoneForm} onSubmit={phoneForm.handleSubmit((values) => {
              handleSendOTP(values);
            })} className="space-y-6">
              <div className="grid gap-6">
                    {!phoneOTPSent ? (
                      <>
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                                {lastMethod === "phone" && (
                                  <Badge className="text-[9px] bg-pink-100 text-pink-700 border-pink-200">
                                    last used
                                  </Badge>
                                )}
                              </div>
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
                          "Verify & Login"
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
            Don&apos;t have an account?{" "}
            <Link 
              className="underline underline-offset-4 font-medium transition-colors duration-200 hover:text-rose-600 text-pink-600" 
              href="/signup"
            >
              Sign up
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
