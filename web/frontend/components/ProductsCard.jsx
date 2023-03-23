import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  TextField,
  Button,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import useInput from "./hooks/useInput";

export function ProductsCard() {
 

  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const [selectedOption, setSelectedOption] = useState("");
  const [createMode, setCreateMode] = useState("single");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [displayProductList, setDisplayProductList] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [reservePrice, bindReservePrice, resetReservePrice] = useInput("");
  const [intervalValue, bindIntervalValue, resetIntervalValue] = useInput("");
  const [intervalUnit, bindIntervalUnit, resetIntervalUnit] =
    useInput("Minutes");

  const [tempScheduledActions,setTempScheduledActions] = useState([]);

  const handleDateChange = (event) => {
    
    setSelectedDate(event.target.value);
    console.log(selectedDate)
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCreateModeChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setDisplayProductList(false);
  };

  function handleProductClick() {
    setDisplayProductList(!displayProductList);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const scheduledActionObject = {
      product: selectedProduct,
      reservePrice,
      date: selectedDate,
      interval: {
        value: intervalValue,
        unit: intervalUnit,
      },
    };

    const product = await fetchProductById(selectedProduct.id);
    console.log(await fetchProductById(selectedProduct.id))
    console.log(scheduledActionObject);
    setTempScheduledActions(oldArray => [...oldArray, scheduledActionObject])
    console.log(tempScheduledActions)
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

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const thStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  };

  const tdStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
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

  const fetchProductById = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        console.log(response)
        const result = await response.json();
        console.log(result)
        return result;
      }else{
        console.log("response is not okay")
      }

    } catch (error) {
      console.log(error)
    }
  }

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
      console.log(result.products);
      return await result.products;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await fetchCollection());
    };
    // Should not ever set state during rendering, so do this in useEffect instead.
    fetchProducts();
    console.log(products);
    console.log(displayProductList);
  }, []);

  return (
    <>
      {toastMarkup}

      <Card
        title="Create A Single Auction"
        sectioned
        primaryFooterAction={{
          content: "Create Scheduled Auction",
          onAction: submitHandler,
          loading: isLoading,
        }}
      >
        <Button onClick={handleProductClick}>Select Products</Button>

        <div style={inputDivStyle}>
          {!displayProductList
            ? null
            : products.map((product) => {
                return (
                  <div key={product.id}>
                    <h2>name: {product.title}</h2>
                    <Button onClick={() => handleSelectProduct(product)}>
                      Select
                    </Button>
                    <hr />
                  </div>
                );
              })}
        </div>
        {/* <div style={inputDivStyle}>
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
        </div> */}

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>Reserve Price</h2>
          <input label={reservePrice} {...bindReservePrice} />
        </div>

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>First Auction Start Time</h2>
          <Datetime
            class="Polaris-TextField__Input"
            value={selectedDate}
            onChange={(e) => handleDateChange}
            inputProps={{ placeholder: "Select date and time" }}
          />
        </div>

        <div style={inputDivStyle}>
          <h2>Select an interval</h2>
          <label>
            Time
            <input type="number" {...bindIntervalValue} />
          </label>
          <label>
            Select a unit:
            <select {...bindIntervalUnit}>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </label>
        </div>
      </Card>

      {tempScheduledActions.length === 0 ? null : (
        <Card title="Scheduled Actions">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Start Price</th>
                <th style={thStyle}>Reserve Price</th>
                <th style={thStyle}>Start Time</th>
                <th style={thStyle}>Interval</th>
              </tr>
            </thead>
            <tbody>
              {tempScheduledActions.map((auction) => {
                return(
                  <tr key={auction.id}>
                    <td style={tdStyle}>{auction?.product?.title}</td>
                    <td style={tdStyle}>10</td>
                    <td style={tdStyle}>{auction?.reservePrice}</td>
                    <td style={tdStyle}>{auction?.date}</td>
                    <td style={tdStyle}>{auction?.interval.value} {auction.interval.unit}</td>
                  </tr>
                )

              })}
            </tbody>
          </table>
        </Card>
      )}

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
          <input {...bindReservePrice} />
        </TextContainer>
      </Card>
    </>
  );
}
