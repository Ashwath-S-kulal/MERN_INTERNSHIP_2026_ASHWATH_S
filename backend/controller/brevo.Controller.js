
import axios from "axios";

export const keepBrevoAlive = async (req, res) => {
  try {
    // Protect this endpoint from public access
    const authHeader = req.headers.authorization;

    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Make a successful authenticated Brevo API request
    const response = await axios.get(
      "https://api.brevo.com/v3/account",
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "accept": "application/json",
        },
      }
    );

    console.log("Brevo API keep-alive successful:", new Date());

    return res.status(200).json({
      success: true,
      message: "Brevo API key is active",
      account: response.data.email,
      checkedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error(
      "Brevo keep-alive failed:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Brevo API keep-alive failed",
      error: error.response?.data || error.message,
    });
  }
};
