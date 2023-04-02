import { useEffect, useState, useCallback} from "react";
import {
  Card,
  Heading,
  TextContainer,
  Button,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import useInput from "./hooks/useInput";
import moment from "moment";
import Modal from "./Modal/Modal";
import ProductPreview from "./ProductPreview";
import { useParams } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";


export function ProductsCard() {
  const emptyToastProps = { content: null };
  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isDeleting, setIsDeleting] = useState(false);


  const [selectedOption, setSelectedOption] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [displayProductList, setDisplayProductList] = useState(false);

  const [selectedDate, setSelectedDate] = useState();
  const [reservePrice, bindReservePrice, resetReservePrice] = useInput("");
  const [intervalValue, bindIntervalValue, resetIntervalValue] = useInput("");
  const [intervalUnit, bindIntervalUnit, resetIntervalUnit] =
    useInput("Minutes");

  const [tempScheduledActions, setTempScheduledActions] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  function handleProductClick() {
    setDisplayProductList(!displayProductList);
  }

  let QRCode = {}

  const submitHandler = async (e) => {
    e.preventDefault();

    const test = await(fetch)
    
    const product = await fetchProductById(selectedProduct.id);
    console.log(product)
    const scheduledActionObject = {
      product: product,
      reservePrice,
      date: selectedDate,
      interval: {
        value: intervalValue,
        unit: intervalUnit,
      },
    };

    console.log(scheduledActionObject);

    resetReservePrice();
    resetIntervalUnit();
    resetIntervalValue();
  };

  const handleDeleteAuction = useCallback(async (auction) => {
    /* The isDeleting state disables the download button and the delete QR code button to show the merchant that an action is in progress */
    setIsDeleting(true);
    const response = await fetch(`/api/auctions/${auction.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  
    if (response.ok) {
      console.log('delete successfully')
    }
  }, [tempScheduledActions]);



  const onSubmit = useCallback(
    (body) => {
      (async () => {

        const product = await fetchProductById(selectedProduct.id);
        
        console.log(product)
        QRCode = {
          title: product.title,
          productId : product.id,
          variantId : product.variants[0].id,
          handle : product.handle,
          priceSet : product.variants[0].price,
          priceCurrent : reservePrice,
          startTime: selectedDate,
          intervalValue: intervalValue,
          intervalUnit: intervalUnit,
        };
        // const parsedBody = body;
        // parsedBody.destination = parsedBody.destination[0];
        const QRCodeId = QRCode?.id;
        /* construct the appropriate URL to send the API request to based on whether the QR code is new or being updated */
        const url = QRCodeId ? `/api/auctions/${QRCodeId}` : "/api/auctions";
        /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to create a new QR code */
        const method = QRCodeId ? "PATCH" : "POST";
        /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
        const response = await fetch(url, {
          method,
          body: JSON.stringify(QRCode),
          headers: { "Content-Type": "application/json"},
        });
        if (response.ok) {
          const QRCode = await response.json();
          /* if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin */
          if (!QRCodeId) {
            //navigate(`/qrcodes/${QRCode.id}`);
            /* if this is a QR code update, update the QR code state in this component */
          } else {
            setSelectedProduct(QRCode);
          }
        } 
      })();
      return { status: "success" };
    },
    [QRCode, setSelectedProduct]
  );

  const titleStyle = {
    fontWeight: "600",
    marginBottom: "0.7rem",
  };

  const inputDivStyle = {
    border: "1px solid #d3d3d3",
    borderRadius: "0.5rem",
    marginBottom: "1.2rem",
    padding: "0.5rem",
  };

  const inputStyle = {
    height: "2.1876em",
    width: "12rem",
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

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const fetchProductById = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };


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

      return await result.products;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: auctions,
    isLoading: isLoadingAuction,
    isRefetching: isRefetchingAuction,
  } = useAppQuery({
    url: "/api/auctions",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await fetchCollection());
    };

     const fetchAuctions = async () => {
      setTempScheduledActions(await auctions);
    };

    // Should not ever set state during rendering, so do this in useEffect instead.
    fetchProducts();
    fetchAuctions();
    
  }, []);

  return (
    <>
      {toastMarkup}

      <Card
        title="Create A Single Auction"
        sectioned
        primaryFooterAction={{
          content: "Create Scheduled Auction",
          onAction: onSubmit,
          loading: isLoading,
        }}
      >

        <div style={inputDivStyle}>
          <Modal
            products={products}
            handleProductSelect={handleProductSelect}
          />
          {isEmptyObject(selectedProduct) ? null : <ProductPreview product={selectedProduct}/>}
        </div>

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>Reserve Price</h2>
          <input
            style={inputStyle}
            label={reservePrice}
            {...bindReservePrice}
          />
        </div>

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>First Auction Start Time</h2>
          <Datetime
            closeOnSelect={true}
            class="Polaris-TextField__Input"
            value={selectedDate}
            onChange={(date) => setSelectedDate(moment(date))}
            inputProps={{ placeholder: "Select date and time" }}
          />
        </div>

        <div style={inputDivStyle}>
          <h2 style={titleStyle}>Select an interval</h2>
          <label style={{ padding: "1rem", color: "black" }}>
            Time
            <input
              type="number"
              {...bindIntervalValue}
              style={{ ...inputStyle, marginLeft: "0.6rem" }}
            />
          </label>
          <label style={{ padding: "1rem", color: "black" }}>
            Select a unit:
            <select style={{ marginLeft: "0.6rem" }} {...bindIntervalUnit}>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </label>
        </div>
      </Card>

      {tempScheduledActions?.length === 0 ? null : (
        <Card title="Scheduled Actions">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Start Price</th>
                <th style={thStyle}>Reserve Price</th>
                <th style={thStyle}>Start Time</th>
                <th style={thStyle}>Interval</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {tempScheduledActions?.map((auction) => {
                return (
                  <tr key={auction.id}>
                    <td style={tdStyle}>
                      {auction?.title}
                    </td>
                    <td style={tdStyle}>
                      {auction?.priceSet}
                    </td>
                    <td style={tdStyle}>
                      {auction?.priceCurrent}
                    </td>
                    <td style={tdStyle}>
                      {auction?.startTime}
                    </td>
                    <td style={tdStyle}>
                      {auction?.intervalValue} {auction.intervalUnit}
                    </td>
                    <td style={tdStyle}>
                    <Button onClick={() => handleDeleteAuction(auction)}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <ConfirmationDialog/>
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
