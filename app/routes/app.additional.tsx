import {
  Card,
  Layout,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  Select,
  FormLayout,
  Spinner,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useState } from "react";
import type { Product } from "app/types/admin.types";
import ForecastChart from "app/components/ForecastChart";
import { useQuery } from "@tanstack/react-query";

const fetchForecast = async (productId: string, months: string) => {
  const response = await fetch(`/api/forecast/${productId}?months=${months}`);
  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }
  return response.json();
};

export default function AdditionalPage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [period, setPeriod] = useState("3");

  const {
    data: forecastData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forecast", selectedProducts[0]?.id, period],
    queryFn: () =>
      selectedProducts[0]?.id
        ? fetchForecast(selectedProducts[0].id, period)
        : null,
    enabled: !!selectedProducts[0]?.id,
  });

  const handleProductSelect = async () => {
    const selected = await shopify.resourcePicker({ type: "product" });
    if (selected) {
      setSelectedProducts(selected as any);
    }
  };

  const handleSelectChange = useCallback(
    (value: string) => setPeriod(value),
    [],
  );

  const options = [
    { label: "3 months", value: "3" },
    { label: "6 months", value: "6" },
    { label: "12 months", value: "12" },
  ];

  return (
    <Page>
      <TitleBar title="Sales Forecast" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <FormLayout>
                <Text as="h2" variant="headingMd">
                  Product
                </Text>
                <List>
                  {selectedProducts.map((product) => (
                    <List.Item key={product.id}>{product.title}</List.Item>
                  ))}
                </List>
                <Button variant="primary" onClick={handleProductSelect}>
                  Select Product
                </Button>
                <Text as="h2" variant="headingMd">
                  Period
                </Text>
                <Select
                  label=""
                  options={options}
                  onChange={handleSelectChange}
                  value={period}
                />
              </FormLayout>
            </Card>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Sales Forecast
                </Text>
                {error && (
                  <Banner>
                    An error occurred while fetching the forecast data
                  </Banner>
                )}
                {isLoading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <Spinner
                      accessibilityLabel="Loading forecast data"
                      size="large"
                    />
                  </div>
                ) : (
                  <ForecastChart data={forecastData?.data || []} />
                )}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
