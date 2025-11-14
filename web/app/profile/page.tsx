"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/shared";
import { Space, Spin } from "antd";
import {
  ProfileHeaderCard,
  AccountInfoCard,
  RecentActivityCard,
  ProfileActions,
} from "@/features/profile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <ProfileHeaderCard
            username={user.username}
            email={user.email}
            credits={user.credits}
          />

          <AccountInfoCard
            id={user.id}
            username={user.username}
            email={user.email}
            credits={user.credits}
            createdAt={user.createdAt.toString()}
          />

          <RecentActivityCard />

          <ProfileActions
            onBackToDashboard={() => router.push("/dashboard")}
            onExploreCatalog={() => router.push("/catalog")}
          />
        </Space>
      </div>
    </AppLayout>
  );
}
