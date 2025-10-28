"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This will trigger loading animation every time route or search changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700); // adjust duration to your liking
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Able replace this with other spinner or loading bar, i think is suffice for now*/}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
