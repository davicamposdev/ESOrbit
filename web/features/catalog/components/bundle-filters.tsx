"use client";

import { Card, Form, Switch, Button, Space } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { type ListBundlesParams } from "../services";

interface BundleFiltersProps {
  onFilter: (filters: ListBundlesParams) => void;
  loading?: boolean;
}

export function BundleFilters({ onFilter, loading }: BundleFiltersProps) {
  const [form] = Form.useForm();

  const handleFilter = () => {
    const values = form.getFieldsValue();
    onFilter({
      ...values,
      page: 1,
      pageSize: 20,
    });
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({
      page: 1,
      pageSize: 20,
    });
  };

  return (
    <Card
      style={{ marginBottom: 24 }}
      styles={{ body: { padding: "16px 24px" } }}
    >
      <Form form={form} layout="inline" onFinish={handleFilter}>
        <Form.Item
          name="isAvailable"
          label="Apenas Disponíveis"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item name="onSale" label="Em Promoção" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<FilterOutlined />}
              loading={loading}
            >
              Filtrar
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Limpar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
