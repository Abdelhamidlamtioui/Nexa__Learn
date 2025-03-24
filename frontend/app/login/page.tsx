"use client"

import { LoginPage } from "@/components/login-page"
import {AuthGuard} from "@/components/guards/AuthGuard";

export default function LoginRoute() {
  return <AuthGuard mode={"guest"}> <LoginPage /> </AuthGuard>
}

