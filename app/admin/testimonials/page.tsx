import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin";
import { getTestimonials } from "@/server/testimonials";
import TestimonialsPageClient from "@/components/admin/TestimonialsPageClient";

export default async function TestimonialsPage() {
    const { success, admin } = await getCurrentAdmin();

    if (!success || !admin) {
        redirect("/admin/login");
    }

    const testimonialsResult = await getTestimonials(false);

    return (
        <TestimonialsPageClient
            initialTestimonials={testimonialsResult.success ? testimonialsResult.testimonials : []}
        />
    );
}

