const BASE_URL =
    "https://rajanokos.my.id/api/v1";

function getApiKey() {
    const key = process.env.RAJANOKOS_API_KEY;

    if (!key) {
        throw new Error(
            "RAJANOKOS_API_KEY belum dipasang"
        );
    }

    return key;
}


async function requestRajaNokos(
    endpoint,
    options = {}
) {

    const apiKey = getApiKey();

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Authorization":
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



export default async function handler(
    req,
    res
) {

    try {

        const action =
            req.query.action;


        /*
         * CEK SALDO PROVIDER
         *
         * GET /balance.php
         */

        if (
            req.method === "GET" &&
            action === "balance"
        ) {

            const data =
                await requestRajaNokos(
                    "/balance.php"
                );

            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * DAFTAR SERVICE
         *
         * GET /services.php?server=
         */

        if (
            req.method === "GET" &&
            action === "services"
        ) {

            const server =
                req.query.server || "";


            const endpoint =
                `/services.php?server=${encodeURIComponent(
                    server
                )}`;


            const data =
                await requestRajaNokos(
                    endpoint
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * HARGA
         *
         * GET /prices.php
         */

        if (
            req.method === "GET" &&
            action === "prices"
        ) {

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
                await requestRajaNokos(
                    `/prices.php?${params.toString()}`
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * STATUS ORDER
         *
         * GET /status.php?order_id=
         */

        if (
            req.method === "GET" &&
            action === "status"
        ) {

            const orderId =
                req.query.order_id;


            if (!orderId) {

                return res.status(400).json({
                    success: false,
                    message:
                        "order_id wajib diisi"
                });

            }


            const data =
                await requestRajaNokos(
                    `/status.php?order_id=${encodeURIComponent(
                        orderId
                    )}`
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * ORDER
         *
         * POST /order.php
         */

        if (
            req.method === "POST" &&
            action === "order"
        ) {

            const {
                id,
                operator
            } = req.body || {};


            if (!id) {

                return res.status(400).json({
                    success: false,
                    message:
                        "id produk wajib diisi"
                });

            }


            const body = {
                id
            };


            if (operator) {

                body.operator =
                    operator;

            }


            const data =
                await requestRajaNokos(
                    "/order.php",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(body)
                    }
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * RESEND OTP
         *
         * POST /resend.php
         */

        if (
            req.method === "POST" &&
            action === "resend"
        ) {

            const {
                order_id
            } = req.body || {};


            if (!order_id) {

                return res.status(400).json({
                    success: false,
                    message:
                        "order_id wajib diisi"
                });

            }


            const data =
                await requestRajaNokos(
                    "/resend.php",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                order_id
                            })
                    }
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * CANCEL ORDER
         *
         * POST /cancel.php
         */

        if (
            req.method === "POST" &&
            action === "cancel"
        ) {

            const {
                order_id
            } = req.body || {};


            if (!order_id) {

                return res.status(400).json({
                    success: false,
                    message:
                        "order_id wajib diisi"
                });

            }


            const data =
                await requestRajaNokos(
                    "/cancel.php",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                order_id
                            })
                    }
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        /*
         * DAFTAR ORDER PROVIDER
         *
         * GET /orders.php
         */

        if (
            req.method === "GET" &&
            action === "orders"
        ) {

            const params =
                new URLSearchParams();


            if (req.query.page) {

                params.set(
                    "page",
                    req.query.page
                );

            }


            if (req.query.limit) {

                params.set(
                    "limit",
                    req.query.limit
                );

            }


            if (req.query.status) {

                params.set(
                    "status",
                    req.query.status
                );

            }


            const data =
                await requestRajaNokos(
                    `/orders.php?${params.toString()}`
                );


            return res.status(200).json({
                success: true,
                data
            });

        }


        return res.status(404).json({
            success: false,
            message: "Action tidak ditemukan"
        });


    } catch (error) {

        console.error(error);


        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
