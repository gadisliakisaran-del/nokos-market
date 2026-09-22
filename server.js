import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());


/* =========================
   WEBSITE
========================= */

app.use(express.static(__dirname));


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "index.html")
  );

});


/* =========================
   BACKEND TEST
========================= */

app.get("/api", (req, res) => {

  res.json({
    success: true,
    message: "NOKOS MARKET API aktif",
    status: "online"
  });

});


/* =========================
   PROVIDER
========================= */

const RAJANOKOS_BASE_URL =
  "https://rajanokos.my.id/api/v1";


async function providerRequest(
  endpoint,
  options = {}
) {

  const apiKey =
    process.env.RAJANOKOS_API_KEY;


  if (!apiKey) {

    throw new Error(
      "RAJANOKOS_API_KEY belum dipasang di Railway"
    );

  }


  const response =
    await fetch(
      `${RAJANOKOS_BASE_URL}${endpoint}`,
      {

        ...options,

        headers: {

          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",

          ...(options.headers || {})

        }

      }
    );


  const text =
    await response.text();


  let data;

  try {

    data = JSON.parse(text);

  } catch {

    data = {
      raw: text
    };

  }


  if (!response.ok) {

    throw new Error(
      data?.message ||
      `Provider error ${response.status}`
    );

  }


  return data;

}


/* =========================
   PROVIDER BALANCE
========================= */

app.get(
  "/api/provider/balance",
  async (req, res) => {

    try {

      const data =
        await providerRequest(
          "/balance.php"
        );


      res.json({
        success: true,
        data
      });


    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/* =========================
   PROVIDER SERVICES
========================= */

app.get(
  "/api/provider/services",
  async (req, res) => {

    try {

      const server =
        req.query.server || "";


      const data =
        await providerRequest(
          `/services.php?server=${encodeURIComponent(server)}`
        );


      res.json({
        success: true,
        data
      });


    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/* =========================
   PROVIDER PRICES
========================= */

app.get(
  "/api/provider/prices",
  async (req, res) => {

    try {

      const params =
        new URLSearchParams();


      if (req.query.service) {

        params.set(
          "service",
          req.query.service
        );

      }


      if (req.query.server) {

        params.set(
          "server",
          req.query.server
        );

      }


      if (req.query.country) {

        params.set(
          "country",
          req.query.country
        );

      }


      const data =
        await providerRequest(
          `/prices.php?${params.toString()}`
        );


      res.json({
        success: true,
        data
      });


    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `NOKOS MARKET berjalan pada port ${PORT}`
    );

  }
);
