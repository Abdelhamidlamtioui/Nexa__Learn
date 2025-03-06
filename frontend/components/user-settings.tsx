"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService, UserProfile } from "@/services/api";
import { initializeToast, showSuccess, showError } from "@/app/utils/toast";


interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserSettings() {
  const [userData, setUserData] = useState<UserProfile>({
    email: "",
    username: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("account");

  useEffect(() => {
    const initialize = async () => {
      await initializeToast();
      await fetchUserData();
    };
    initialize();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();
      const { email, username, avatar } = response.data.data;
      setUserData({ email, username, avatar });
    } catch (error) {
      showError("Unable to load user data. Please try again later.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileData()) return;

    setIsLoading(true);
    try {
      const response = await authService.updateProfile(userData);
      if (response.data.success) {
        showSuccess("Profile updated successfully!");
        await fetchUserData();
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordData()) return;

    setIsLoading(true);
    try {
      const response = await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        showSuccess("Password updated successfully!");
        resetPasswordFields();
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to update password");
      console.error("Error updating password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfileData = (): boolean => {
    if (!userData.email || !userData.username) {
      showError("Please fill in all required fields");
      return false;
    }
    if (!isValidEmail(userData.email)) {
      showError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePasswordData = (): boolean => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showError("Please fill in all password fields");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      showError("New password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetPasswordFields = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="bg-white bg-opacity-20 text-white"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="bg-white bg-opacity-20 text-white"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-white bg-opacity-20 text-white"
                  placeholder="Enter current password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-white bg-opacity-20 text-white"
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-white bg-opacity-20 text-white"
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Billing Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                <p className="text-sm text-gray-300">
                  You haven't added any payment methods yet.
                </p>
                <Button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200"
                >
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Billing History</h3>
                <p className="text-sm text-gray-300">
                  No billing history available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}