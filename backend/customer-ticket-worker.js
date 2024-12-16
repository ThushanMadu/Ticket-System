import { parentPort, workerData } from "worker_threads";

const customerId = workerData.customerId;
console.log(`Customer ${customerId} worker started.`);

try {
    // Immediately send a message to the main thread
    parentPort.postMessage({ action: "purchaseTicket", customerId: customerId });

    // Recurring interval for ticket purchasing
    setInterval(() => {
        parentPort.postMessage({ action: "purchaseTicket", customerId: customerId });
        console.log(`Customer ${customerId} reserving tickets.`);
    }, workerData.customerRetrieveRate * 100);

} catch (error) {
    parentPort.postMessage({ action: "error", error: error.message });
}
