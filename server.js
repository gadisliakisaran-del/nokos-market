import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const RAJANOKOS_BASE_URL =
    "https://rajanokos.my.id/api/v1";


async function rajaNokosRequest(
    endpoint,
    options = {}
) {

    const apiKey =
        process.env.RAJANOKOS_API_KEY;

    if (!apiKey) {
        throw new Error(
            "RAJANOKOS_API_KEY belum dikonfigurasi"
        );
    }

    const response = await fetch(
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


/* TEST BACKEND */

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message:
                "NOKOS MARKET Backend aktif"
        });

    }
);


/* CEK SALDO PROVIDER */

app.get(
    "/api/provider/balance",
    async (req, res) => {

        try {

            const data =
                await rajaNokosRequest(
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


/* DAFTAR SERVICE */

app.get(
    "/api/provider/services",
    async (req, res) => {

        try {

            const server =
                req.query.server || "";


            const data =
                await rajaNokosRequest(
                    `/services.php?server=${encodeURIComponent(
                        server
                    )}`
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


/* CEK HARGA */

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
                await rajaNokosRequest(
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


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Backend berjalan pada port ${PORT}`
        );

    }
);
