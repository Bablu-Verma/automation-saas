"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndiaTimeFormatted = getIndiaTimeFormatted;
function getIndiaTimeFormatted() {
    const now = new Date();
    const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const parts = new Intl.DateTimeFormat("en-IN", options).formatToParts(now);
    const day = parts.find(p => p.type === "day")?.value || "00";
    const month = parts.find(p => p.type === "month")?.value || "00";
    const year = parts.find(p => p.type === "year")?.value || "0000";
    const hour = parts.find(p => p.type === "hour")?.value || "00";
    const minute = parts.find(p => p.type === "minute")?.value || "00";
    const second = parts.find(p => p.type === "second")?.value || "00";
    return `${day}-${month}-${year}__${hour}-${minute}-${second}`;
}
