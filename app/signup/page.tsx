"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";



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
        <div className="flex justify-center items-center align-middle h-full w-full flex-col">
            <div className="border flex flex-col justify-center p-20 rounded-xl gap-10">
                <div className="flex flex-row justify-between w-full gap-5">
                    <Image src="/reservo-logo.svg" width={150} height={150} alt="Reservo Logo" />
                    <span>|</span>
                    <h2 className="font-semibold">Sign Up</h2>
                </div>
                <form className="flex flex-col gap-5">
                    <label className="flex flex-col gap-2">
                        Email Address
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-2">
                        Password
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <Button disabled={isLoading || !email || !password} onClick={handleSignup} type="submit">{isLoading ? "Signing Up.." : "Sign Un"}</Button>
                </form>
                <div className="flex flex-row align-middle items-center gap-0">
                    <div className="bg-neutral-500 h-[1px] w-full "></div>
                    <span className="w-full text-center ml-[-30px] mr-[-30px]">or</span>
                    <div className="bg-neutral-500 h-[1px] w-full "></div>

                </div>
                <Button variant="outline" onClick={() => router.push('/signin')}>Sign In</Button>
            </div>
        </div >
    )


    // return (
    //     <div>
    //         <h2>Sign Up</h2>
    //         <form>
    //             <label>
    //                 Email Address:
    //                 <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //             </label>
    //             <label>
    //                 Password:
    //                 <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //             </label>
    //             <Button disabled={isLoading || !email || !password} onClick={handleSignup} type="submit">{isLoading ? "Signing Up.." : "Sign Up"}</Button>
    //         </form>
    //     </div>
    // )
}   