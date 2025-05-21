'use client';

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signOut({callbackUrl: "/auth/signin"});
        }
    }, [status]);
    return <>{children}</>;
}