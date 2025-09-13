"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LogoutButton() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.refresh(); // refresh session state
        router.push("/signin"); // send user back to login page
    }

    return (
        <Image className="cursor-pointer" onClick={handleLogout} src="/logout.svg" alt="Logo" width={30} height={30} />
    );
}