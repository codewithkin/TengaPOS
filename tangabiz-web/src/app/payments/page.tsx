"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function PaymentsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-gray-500">Loading payment status...</div>
                </div>
            }
        >
            <PaymentsContent />
        </Suspense>
    );
}

function PaymentsContent() {
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const plan = searchParams.get("plan");
    const email = searchParams.get("email");

    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [showErrorCard, setShowErrorCard] = useState(false);

    const { isLoading, error } = useQuery({
        queryKey: ["upgrade", plan, email],
        queryFn: async () => {
            const res = await axios.post(
                `/api/tengapos/payments/upgrade`,
                {
                    plan,
                    businessEmail: email,
                }
            );

            if (res.status === 200) {
                toast.success("Plan upgraded successfully!");
                setShowSuccessCard(true);
            }
        },
        enabled: success === "true" && !!plan && !!email,
    });

    useEffect(() => {
        if (error) {
            toast.error("Upgrade failed.");
            setShowErrorCard(true);
        }
    }, [error]);

    function openMobileApp() {
        window.location.href = `tengapos://payments/upgrade?plan=${plan}`;
    }

    if (!success) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
            >
                {isLoading && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
                        <Skeleton className="h-16 w-full mb-6" />
                        <Skeleton className="h-10 w-40 mx-auto" />
                    </>
                )}

                {!isLoading && showSuccessCard && (
                    <>
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-green-500 mb-6 flex justify-center"
                        >
                            <CheckCircle2 strokeWidth={1.5} size={80} />
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
                            Your account{" "}
                            <span className="font-medium text-yellow-500">
                                {email}
                            </span>{" "}
                            has been upgraded successfully. You can now open the
                            mobile app to continue.
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                className="bg-green-600 hover:bg-green-700 transition duration-200"
                                onClick={openMobileApp}
                                size="lg"
                                variant="default"
                            >
                                Open Mobile App
                            </Button>
                        </motion.div>
                    </>
                )}

                {!isLoading && showErrorCard && (
                    <>
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-red-500 mb-6 flex justify-center"
                        >
                            <XCircle strokeWidth={1.5} size={80} />
                        </motion.div>

                        <motion.h1
                            className="text-2xl font-semibold mb-3"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Something went wrong!
                        </motion.h1>

                        <motion.p
                            className="text-gray-700 mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            We couldn’t upgrade the plan for{" "}
                            <span className="font-medium text-red-500">
                                {email}
                            </span>
                            . <br />
                            Please contact the developer for assistance:
                            <br />
                            <span className="block mt-2 font-semibold">
                                📧 kinzinzombe07@gmail.com
                            </span>
                            <span className="block font-semibold">
                                📞 +263 783 532 164
                            </span>
                        </motion.p>
                    </>
                )}
            </motion.div>
        </div>
    );
}