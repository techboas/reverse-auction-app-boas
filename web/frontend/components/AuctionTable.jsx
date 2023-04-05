import {useState} from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { Button } from "@shopify/polaris";
import moment from "moment";



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

const AuctionTable = (props) => {
  const [showConfirmation, setShowConfirmation] = useState(false)

   
  function handleDisplayConfirmationDialog() {
    setShowConfirmation(!showConfirmation);
  }

  function deleteAuction(id){
    handleDisplayConfirmationDialog();
    console.log('reached delete function')
    props.handleDeleteAuction(id);
  }

  return (
    <div>
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
          {props.scheduledAuctions?.map((auction) => {
            console.log(auction.startTime)
            return (
              <tr key={auction.id}>
                <td style={tdStyle}>{auction?.title}</td>
                <td style={tdStyle}>{auction?.priceSet}</td>
                <td style={tdStyle}>{auction?.priceCurrent}</td>
                <td style={tdStyle}>{moment(auction.startTime).format('DD-MM-YYYY')}</td>
                <td style={tdStyle}>
                  {auction?.intervalValue} {auction.intervalUnit}
                </td>
                <td style={tdStyle}>
                  <Button onClick={handleDisplayConfirmationDialog}>
                    Delete
                  </Button>
                </td>
                      {showConfirmation && <ConfirmationDialog deleteAuction={(id)=>{deleteAuction(auction.id)}} handleDisplayConfirmationDialog={handleDisplayConfirmationDialog}/>}
              </tr>
            );
          })}
        </tbody>
      </table>
  
    </div>
  );
};

export default AuctionTable;
