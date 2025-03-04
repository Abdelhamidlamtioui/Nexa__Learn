"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CurrencyOverview } from "./currency-overview";
import { CurrencyBreakdown } from "./currency-breakdown";
import { QuickActions } from "./quick-actions";
import { WalletStatistics } from "./wallet-statistics";
import { Coins, CreditCard, Zap, Star } from "lucide-react";
import { authService, userService } from "@/services/api";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { UUID } from "node:crypto";

interface UserData {
  id: UUID;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  points: number;
  badges: string[];
  postsCount: number;
  commentsCount: number;
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData) return;

    try {
      iziToast.info({
        title: "Uploading",
        message: "Please wait while the avatar is being uploaded...",
        position: "topRight",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userData.id);

      const response = await userService.uploadAvatar(formData);
      const { success, avatarUrl } = response.data;

      if (success) {
        iziToast.success({
          title: "Success",
          message: "Avatar uploaded successfully!",
          position: "topRight",
        });
        setUserData((prev) => (prev ? { ...prev, avatar: avatarUrl } : prev));
      } else {
        iziToast.error({
          title: "Error",
          message: "Failed to upload avatar!",
          position: "topRight",
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 413) {
        iziToast.error({
          title: "Upload Error",
          message: "The file size exceeds the maximum allowed limit of 2MB.",
          position: "topRight",
        });
      } else {
        iziToast.error({
          title: "Error",
          message: "An error occurred while uploading the avatar.",
          position: "topRight",
        });
        console.error("Error uploading avatar:", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await authService.getCurrentUser();
        setUserData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading profile</div>;
  }

  const xpProgress = (userData.xp / userData.xpToNextLevel) * 100;

  return (
      <div className="space-y-6">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2 relative">
            <div className="group relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                    src={
                        userData.avatar ||
                        "https://res.cloudinary.com/hxwhau759/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1713822899/default_images/jlkamkirtzmtuiruyiwo.png"
                    }
                    alt={userData.name}
                />
                <AvatarFallback>{userData.name}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="text-white cursor-pointer">
                  <span className="text-sm font-medium">Upload</span>
                  <input
                      type="file"
                      className="hidden"
                      onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-white">{userData.name}</CardTitle>
              <p className="text-gray-300">@{userData.username}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Level {userData.level}</p>
                <Progress value={xpProgress} className="h-2 bg-gray-600" />
                <p className="text-xs text-gray-400 mt-1">
                  {userData.xp} / {userData.xpToNextLevel} XP
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Points</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                  {userData.points}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {userData.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="bg-opacity-20 text-white">
                        {badge}
                      </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <dt className="text-sm font-medium text-gray-300">Posts</dt>
                  <dd className="text-2xl font-bold text-white">{userData.postsCount}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-300">Comments</dt>
                  <dd className="text-2xl font-bold text-white">{userData.commentsCount}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Coming soon...</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Wallet</h2>
          <div className="space-y-6">
            <CurrencyOverview totalBalance={1512} />
            <CurrencyBreakdown
                currencies={[
                  { name: "Tech Tokens", symbol: "TT", balance: 1512, icon: Coins, color: "from-[#4C9AFF] to-[#0052CC]" },
                  { name: "Innovation Coins", symbol: "IC", balance: 250, icon: Zap, color: "from-[#FFB020] to-[#F08C00]" },
                  {
                    name: "Dev Credits",
                    symbol: "DC",
                    balance: 500,
                    icon: CreditCard,
                    color: "from-[#6B46C1] to-[#553C9A]",
                  },
                  { name: "Community Stars", symbol: "CS", balance: 100, icon: Star, color: "from-[#276749] to-[#1B4332]" },
                ]}
            />
            <QuickActions />
            <WalletStatistics />
          </div>
        </div>
      </div>
  );
}
