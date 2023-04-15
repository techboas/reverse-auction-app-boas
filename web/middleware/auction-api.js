/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/

import express from "express";

import shopify from "../shopify.js";
import { QRCodesDB } from "../auction-db.js";
import {
  getQrCodeOr404,
  getShopUrlFromSession,
  parseQrCodeBody,
  formatQrCodeResponse,
  parseAuctionBody,
} from "../helpers/auction.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const schedule = require("node-schedule");

const DISCOUNTS_QUERY = `
  query discounts($first: Int!) {
    codeDiscountNodes(first: $first) {
      edges {
        node {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeBxgy {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeFreeShipping {
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function applyQrCodeApiEndpoints(app) {
  app.use(express.json());

  app.get("/api/discounts", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    /* Fetch all available discounts to list in the QR code form */
    const discounts = await client.query({
      data: {
        query: DISCOUNTS_QUERY,
        variables: {
          first: 25,
        },
      },
    });

    res.send(discounts.body.data);
  });

  app.post("/api/auctions", async (req, res) => {
    try {
      const id = await QRCodesDB.create({
        ...(await parseAuctionBody(req)),

        /* Get the shop from the authorization header to prevent users from spoofing the data */
        shopDomain: await getShopUrlFromSession(req, res),
      });

      const response = await formatQrCodeResponse(req, res, [
        await QRCodesDB.read(id),
      ]);

      const scheduleJob = schedule.scheduleJob("*/2 * * * *", async function () {
        const rawCodeData = await formatQrCodeResponse(req, res, [
          await QRCodesDB.read(id),
        ]);

        const updatedData = rawCodeData[0];


        console.log(updatedData.priceSet, updatedData.priceCurrent)
        console.log("line break --------------------------------")
        //TODO: reduce price
        if(updatedData.priceSet >= updatedData.priceCurrent){
          updatedData.priceSet = updatedData.priceSet - 1;

          //If priceSet is lower than reserve price cancel the schedule job
          if (updatedData.priceSet < updatedData.reservePrice) {
            console.log("Price has reached reserve price. Stopping job...");
            job.cancel();
          }
        }

        console.log(updatedData.priceSet, updatedData.priceCurrent)

        //TODO: Update new price to database
        try {
          await QRCodesDB.update(updatedData.id,updatedData);
          const responseUpdate = await formatQrCodeResponse(req, res, [
            await QRCodesDB.read(updatedData.id),
          ]);

          console.log(responseUpdate)
        } catch (error) {
          console.log(error)
        }
          
      });

      res.status(201).send(response[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.patch("/api/auctions/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);

    if (qrcode) {
      try {
        await QRCodesDB.update(req.params.id, await parseQrCodeBody(req));
        const response = await formatQrCodeResponse(req, res, [
          await QRCodesDB.read(req.params.id),
        ]);
        res.status(200).send(response[0]);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/api/auctions", async (req, res) => {
    try {
      const rawCodeData = await QRCodesDB.list(
        await getShopUrlFromSession(req, res)
      );

      const response = await formatQrCodeResponse(req, res, rawCodeData);
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/auctions/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);

    if (qrcode) {
      const formattedQrCode = await formatQrCodeResponse(req, res, [qrcode]);
      res.status(200).send(formattedQrCode[0]);
    }
  });

  app.delete("/api/auctions/:id", async (req, res) => {
    const qrcode = await getQrCodeOr404(req, res);
    
    if (qrcode) {
      console.log(qrcode);
      await QRCodesDB.delete(req.params.id);
      res.status(200).send();
    }
  });
}
