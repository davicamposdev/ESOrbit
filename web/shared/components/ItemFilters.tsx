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
  Input,
} from "antd";
import {
  FilterOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export interface FilterOption {
  value: string | undefined;
  label: string;
}

export interface ToggleFilter {
  key: string;
  label: string;
  checked?: boolean;
}

export interface ItemFiltersConfig<T = any> {
  searchPlaceholder?: string;
  types?: FilterOption[];
  rarities?: FilterOption[];
  pageSizeOptions?: FilterOption[];
  toggleFilters?: ToggleFilter[];
  showDateRange?: boolean;
  showSearch?: boolean;
  showType?: boolean;
  showRarity?: boolean;
  showPageSize?: boolean;
  initialFilters?: T;
}

interface ItemFiltersProps<T = any> {
  config: ItemFiltersConfig<T>;
  onFilter: (filters: T) => void;
  loading?: boolean;
}

const defaultTypes: FilterOption[] = [
  { value: undefined, label: "Todos os tipos" },
  { value: "outfit", label: "Roupas" },
  { value: "emote", label: "Emotes" },
  { value: "glider", label: "Planadores" },
  { value: "pickaxe", label: "Picaretas" },
  { value: "backpack", label: "Mochilas" },
  { value: "wrap", label: "Revestimentos" },
];

const defaultRarities: FilterOption[] = [
  { value: undefined, label: "Todas as raridades" },
  { value: "common", label: "Comum" },
  { value: "uncommon", label: "Incomum" },
  { value: "rare", label: "Raro" },
  { value: "epic", label: "Épico" },
  { value: "legendary", label: "Lendário" },
];

const defaultPageSizeOptions: FilterOption[] = [
  { value: "10", label: "10 por página" },
  { value: "20", label: "20 por página" },
  { value: "50", label: "50 por página" },
  { value: "100", label: "100 por página" },
];

export function ItemFilters<T extends Record<string, any>>({
  config,
  onFilter,
  loading,
}: ItemFiltersProps<T>) {
  const {
    searchPlaceholder = "Digite o nome do item",
    types = defaultTypes,
    rarities = defaultRarities,
    pageSizeOptions = defaultPageSizeOptions,
    toggleFilters = [],
    showDateRange = true,
    showSearch = true,
    showType = true,
    showRarity = true,
    showPageSize = true,
    initialFilters = {} as T,
  } = config;

  const [filters, setFilters] = useState<T>({
    page: 1,
    pageSize: 20,
    ...initialFilters,
  } as T);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchName, setSearchName] = useState<string>("");

  const handleChange = (key: keyof T, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: key !== "page" ? 1 : value,
    } as T;
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
    } as T;

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleToggle = (key: keyof T, checked: boolean) => {
    const newValue = checked ? true : undefined;
    handleChange(key, newValue);
  };

  const handleSearchByName = () => {
    const newFilters = {
      ...filters,
      name: searchName || undefined,
      page: 1,
    } as T;
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchByName();
    }
  };

  const handleReset = () => {
    const resetFilters: T = {
      page: 1,
      pageSize: 20,
      ...initialFilters,
    } as T;
    setFilters(resetFilters);
    setDateRange(null);
    setSearchName("");
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
        {showSearch && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Buscar por nome
            </label>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder={searchPlaceholder}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={handleNameKeyPress}
                disabled={loading}
                allowClear
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearchByName}
                disabled={loading}
              />
            </Space.Compact>
          </Col>
        )}

        {showType && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Tipo
            </label>
            <Select
              value={filters.type}
              onChange={(value) => handleChange("type" as keyof T, value)}
              disabled={loading}
              options={types}
              style={{ width: "100%" }}
              placeholder="Selecione o tipo"
            />
          </Col>
        )}

        {showRarity && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Raridade
            </label>
            <Select
              value={filters.rarity}
              onChange={(value) => handleChange("rarity" as keyof T, value)}
              disabled={loading}
              options={rarities}
              style={{ width: "100%" }}
              placeholder="Selecione a raridade"
            />
          </Col>
        )}

        {showPageSize && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Itens por página
            </label>
            <Select
              value={String(filters.pageSize || 20)}
              onChange={(value) =>
                handleChange("pageSize" as keyof T, Number(value))
              }
              disabled={loading}
              options={pageSizeOptions}
              style={{ width: "100%" }}
            />
          </Col>
        )}

        {showDateRange && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
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
        )}

        {toggleFilters.length > 0 && (
          <Col xs={24} sm={12} md={6}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Opções
            </label>
            <Space direction="vertical">
              {toggleFilters.map((toggle) => (
                <Checkbox
                  key={toggle.key}
                  checked={filters[toggle.key as keyof T] === true}
                  onChange={(e) =>
                    handleToggle(toggle.key as keyof T, e.target.checked)
                  }
                  disabled={loading}
                >
                  {toggle.label}
                </Checkbox>
              ))}
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  );
}
