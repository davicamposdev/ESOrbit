"use client";

import { AppLayout } from "@/shared";
import { Spin, Empty } from "antd";
import {
  useUsersInventory,
  UsersInventoryHeader,
  UsersInventoryGrid,
} from "@/features/users-inventory";

export default function UsersInventoryPage() {
  const { users, loading, error } = useUsersInventory();

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Empty description={error} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: "24px" }}>
        <UsersInventoryHeader />
        <UsersInventoryGrid users={users} />
      </div>
    </AppLayout>
  );
}
