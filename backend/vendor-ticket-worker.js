import { parentPort, workerData } from "worker_threads";

const vendorId = workerData.vendorId;

try {
    parentPort.postMessage({ action: "addTickets", vendorId: vendorId });

    // Recurring interval for ticket generation
    setInterval(() => {
        parentPort.postMessage({ action: "addTickets", vendorId: vendorId });
        console.log(`Vendor ${vendorId} generating tickets.`);
    }, workerData.releaseRate * 100);

} catch (error) {
    parentPort.postMessage({ action: "error", error: error.message });
}
