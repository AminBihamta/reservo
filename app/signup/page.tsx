"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function SignupPage() {

    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);

    async function handleSignup() {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            alert("Error signing up: " + error.message);
        } else {
            router.push('/login');
        }
    }


    return (
        <div>
            <h2>Sign Up</h2>
            <form>
                <label>
                    Email Address:
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <Button disabled={isLoading || !email || !password} onClick={handleSignup} type="submit">{isLoading ? "Signing Up.." : "Sign Up"}</Button>
            </form>
        </div>
    )
}   