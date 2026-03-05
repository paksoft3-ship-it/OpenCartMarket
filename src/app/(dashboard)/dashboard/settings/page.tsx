"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const { user } = useAppStore();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Settings saved successfully! (Mock)");
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account profile, email preferences, and billing information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your contact details and display name.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="profile-form" onSubmit={handleSave} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user?.name} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user?.email} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company Name (Optional)</Label>
                            <Input id="company" placeholder="e.g. Acme Corp" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button type="submit" form="profile-form">Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password and secure your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="security-form" onSubmit={handleSave} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <Input id="current_password" type="password" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input id="new_password" type="password" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input id="confirm_password" type="password" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Requires re-login after password change.</p>
                    <Button type="submit" form="security-form" variant="secondary">Update Password</Button>
                </CardFooter>
            </Card>

            <div className="py-4">
                <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                <Separator className="mb-4" />
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                        <div>
                            <h4 className="font-semibold text-foreground">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all data. This action is irreversible.</p>
                        </div>
                        <Button variant="destructive" className="shrink-0" onClick={() => window.confirm("Are you sure? This is irreversible.") && toast.error("Cannot delete demo account.")}>
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
