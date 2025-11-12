"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Checkbox,
  Button,
  Space,
  Typography,
  DatePicker,
} from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { type ListCosmeticsParams } from "../services";
import type { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface CatalogFiltersProps {
  onFilter: (filters: ListCosmeticsParams) => void;
  loading?: boolean;
}

const types = [
  { value: undefined, label: "Todos os tipos" },
  { value: "outfit", label: "Roupas" },
  { value: "emote", label: "Emotes" },
  { value: "glider", label: "Planadores" },
  { value: "pickaxe", label: "Picaretas" },
  { value: "backpack", label: "Mochilas" },
  { value: "wrap", label: "Revestimentos" },
];

const rarities = [
  { value: undefined, label: "Todas as raridades" },
  { value: "common", label: "Comum" },
  { value: "uncommon", label: "Incomum" },
  { value: "rare", label: "Raro" },
  { value: "epic", label: "Épico" },
  { value: "legendary", label: "Lendário" },
];

const pageSizeOptions = [
  { value: 10, label: "10 por página" },
  { value: 20, label: "20 por página" },
  { value: 50, label: "50 por página" },
  { value: 100, label: "100 por página" },
];

export function CatalogFilters({ onFilter, loading }: CatalogFiltersProps) {
  const [filters, setFilters] = useState<ListCosmeticsParams>({
    page: 1,
    pageSize: 20,
  });
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const handleChange = (key: keyof ListCosmeticsParams, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: key !== "page" ? 1 : value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDateRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: [string, string]
  ) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateRange(null);
    } else {
      setDateRange([dates[0], dates[1]]);
    }

    const newFilters = {
      ...filters,
      createdFrom:
        dates && dates[0] ? dates[0].startOf("day").toISOString() : undefined,
      createdTo:
        dates && dates[1] ? dates[1].endOf("day").toISOString() : undefined,
      page: 1,
    };

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleToggle = (key: keyof ListCosmeticsParams, checked: boolean) => {
    const newValue = checked ? true : undefined;
    handleChange(key, newValue);
  };

  const handleReset = () => {
    const resetFilters: ListCosmeticsParams = {
      page: 1,
      pageSize: 20,
    };
    setFilters(resetFilters);
    setDateRange(null);
    onFilter(resetFilters);
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <Title level={5} style={{ margin: 0 }}>
            Filtros
          </Title>
        </Space>
      }
      extra={
        <Button
          icon={<ClearOutlined />}
          onClick={handleReset}
          disabled={loading}
          type="link"
        >
          Limpar filtros
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Tipo
          </label>
          <Select
            value={filters.type}
            onChange={(value) => handleChange("type", value)}
            disabled={loading}
            options={types}
            style={{ width: "100%" }}
            placeholder="Selecione o tipo"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Raridade
          </label>
          <Select
            value={filters.rarity}
            onChange={(value) => handleChange("rarity", value)}
            disabled={loading}
            options={rarities}
            style={{ width: "100%" }}
            placeholder="Selecione a raridade"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Itens por página
          </label>
          <Select
            value={filters.pageSize || 20}
            onChange={(value) => handleChange("pageSize", value)}
            disabled={loading}
            options={pageSizeOptions}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Data de inclusão
          </label>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            disabled={loading}
            allowEmpty={[true, true]}
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={["Data inicial", "Data final"]}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Opções
          </label>
          <Space direction="vertical">
            <Checkbox
              checked={filters.isNew === true}
              onChange={(e) => handleToggle("isNew", e.target.checked)}
              disabled={loading}
            >
              Apenas novos
            </Checkbox>
            <Checkbox
              checked={filters.isBundle === true}
              onChange={(e) => handleToggle("isBundle", e.target.checked)}
              disabled={loading}
            >
              Apenas bundles
            </Checkbox>
            <Checkbox
              checked={filters.isAvailable === true}
              onChange={(e) => handleToggle("isAvailable", e.target.checked)}
              disabled={loading}
            >
              Apenas disponíveis
            </Checkbox>
            <Checkbox
              checked={filters.onSale === true}
              onChange={(e) => handleToggle("onSale", e.target.checked)}
              disabled={loading}
            >
              Apenas em promoção
            </Checkbox>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
