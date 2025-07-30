"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PaymentsPage() {
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const email = searchParams.get("email");

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (success === "true") {
            setShowContent(true);
        }
    }, [success]);

    if (!showContent) return null;

    // Handler for the CTA button
    function openMobileApp() {
        // This can be your app's universal link or scheme to open the app
        window.location.href = "myapp://home";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-green-600 mb-6"
                >
                    <CheckCircle2 size={72} />
                </motion.div>

                <motion.h1
                    className="text-3xl font-semibold mb-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Payment Successful!
                </motion.h1>

                <motion.p
                    className="text-gray-700 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Your account <span className="font-medium">{email}</span> has been upgraded successfully.
                    You can now open the mobile app to continue.
                </motion.p>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button onClick={openMobileApp} size="lg" variant="default">
                        Open Mobile App
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}