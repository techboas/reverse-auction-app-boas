import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  TextField,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const [selectedOption, setSelectedOption] = useState("");
  const [textFieldValue, setTextFieldValue] = useState("");
  const [createMode, setCreateMode] = useState("single");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedInterval, setInterval] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("minutes");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [displayProductList,setDisplayProductList] = useState(false)
  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCreateModeChange = (event) => {
    setSelectedOption(event.target.value);
  };

  function handleProductClick() {
    setDisplayProductList(!displayProductList);
  }

  const handleIntervalValueChange = (event) => {
    setInterval(event.target.value);
  };

  const handleTextFieldChange = (value) => {
    setTextFieldValue(value);
  };

  const titleStyle = {
    fontWeight: "600",
  };

  const inputDivStyle = {
    border: "1px solid #d3d3d3",
    borderRadius: "0.5rem",
    marginBottom: "1.2rem",
    padding: "0.5rem",
  };

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  console.log("App Connected");

  const fetchCollection = async () => {
    try {
      const response = await fetch("/api/collections/435393855790");
      const result = await response.json();
      console.log(result.products)
      return await result.products;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   
    const fetchProducts = async () => {
      setProducts(await fetchCollection());
    }
    // Should not ever set state during rendering, so do this in useEffect instead.
    fetchProducts();
    console.log(products)
    console.log(displayProductList)
  }, []);

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>

      <Card
        title="Create A Single Auction"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <button onClick={handleProductClick}>
          Select Products
        </button>

        <div style={inputDivStyle}>
        {!displayProductList ? null: products.map(product => {
        return (
          <div key={product.id}>
            <h2>name: {product.title}</h2>
            <hr />
          </div>
        );
        })}

          
        </div>
        <div style={inputDivStyle}>
          <TextContainer spacing="loose">
            <p>
              Sample products are created with a default title and price. You
              can remove them at any time.
            </p>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  value="fixed"
                  checked={selectedOption === "fixed"}
                  onChange={handleOptionChange}
                />
                Fixed
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  value="option2"
                  checked={selectedOption === "option2"}
                  onChange={handleOptionChange}
                />
                Drop Price Range
              </label>
            </div>
          </TextContainer>
        </div>

        <div style={inputDivStyle}>
          <TextField
            label="Reserve Price"
            value={textFieldValue}
            onChange={handleTextFieldChange}
          />
        </div>

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>First Auction Start Time</h2>
          <Datetime
            class="Polaris-TextField__Input"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inputProps={{ placeholder: "Select date and time" }}
          />
        </div>

        <div style={inputDivStyle}>
          <h2>Select an interval</h2>
          <label>
            Time
            <input
              type="number"
              value={selectedInterval}
              onChange={handleIntervalValueChange}
            />
          </label>
          <label>
            Select a unit:
            <select value={selectedUnit} onChange={handleUnitChange}>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </label>
        </div>
      </Card>

      <Card
        title="Reserve Price Settings"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <div className="form-group">
            <label>
              <input
                type="radio"
                value="fixed"
                checked={selectedOption === "fixed"}
                onChange={handleOptionChange}
              />
              Fixed
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="radio"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleOptionChange}
              />
              Drop Price Range
            </label>
          </div>
          <TextField
            label="Reserve Price"
            value={textFieldValue}
            onChange={handleTextFieldChange}
          />
        </TextContainer>
      </Card>
    </>
  );
}
