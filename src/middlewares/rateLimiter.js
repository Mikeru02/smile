import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: process.env.RATE * 1000,
    max: process.env.MAX_REQ,
    message: "Too many requests."
})

export default limiter;