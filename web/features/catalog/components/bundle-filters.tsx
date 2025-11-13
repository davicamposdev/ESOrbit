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

  const handleValuesChange = () => {
    handleFilter();
  };

  const handleReset = () => {
    form.setFieldsValue({
      isAvailable: true,
      onSale: undefined,
    });
    onFilter({
      page: 1,
      pageSize: 20,
      isAvailable: true,
    });
  };

  return (
    <Card
      style={{ marginBottom: 24 }}
      styles={{ body: { padding: "16px 24px" } }}
    >
      <Form
        form={form}
        layout="inline"
        onFinish={handleFilter}
        onValuesChange={handleValuesChange}
      >
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
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Limpar Filtros
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
