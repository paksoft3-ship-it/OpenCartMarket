"use client";

import { useAppStore, User } from "@/lib/store";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { UserCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function LoginPage() {
    const login = useAppStore(state => state.login);
    const router = useRouter();

    const handleDemoLogin = (role: 'customer' | 'admin') => {
        const user: User = {
            id: role === 'admin' ? 'admin-1' : 'cust-1',
            name: role === 'admin' ? 'Admin User' : 'Demo Customer',
            email: role === 'admin' ? 'admin@ocmarket.com' : 'customer@example.com',
            role
        };

        // Set Zustand store
        login(user);

        // Set cookie for middleware
        Cookies.set('market_session', role, { expires: 1 });

        toast.success(`Logged in successfully as ${role}`);
        router.push(role === 'admin' ? '/admin' : '/dashboard');
    };

    return (
        <Container className="py-24 flex justify-center items-center min-h-[70vh]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>This is a demo marketplace. Select a role to sign in.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <Button
                        size="lg"
                        className="w-full relative h-16 text-lg justify-start px-6"
                        onClick={() => handleDemoLogin('customer')}
                    >
                        <UserCheck className="mr-4 h-6 w-6" />
                        <div className="text-left">
                            <div className="font-semibold">Customer Login</div>
                            <div className="text-xs font-normal opacity-80">Access your downloads & licenses</div>
                        </div>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full relative h-16 text-lg justify-start px-6"
                        onClick={() => handleDemoLogin('admin')}
                    >
                        <ShieldCheck className="mr-4 h-6 w-6 text-primary" />
                        <div className="text-left">
                            <div className="font-semibold">Admin Login</div>
                            <div className="text-xs font-normal text-muted-foreground">Manage products & vendors</div>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
}
