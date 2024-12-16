package iit.oop.ticketmanager;

import java.util.concurrent.BlockingQueue;

public class Customer implements Runnable {
    private final BlockingQueue<Ticket> ticketQueue;
    private final BlockingQueue<Ticket> ticketPool;
    private final int buyRate;
    private final Vendor vendor; // Access to check if vendor is done
    private volatile boolean isRunning;

    public Customer(BlockingQueue<Ticket> ticketQueue, BlockingQueue<Ticket> ticketPool, int buyRate, Vendor vendor) {
        this.ticketQueue = ticketQueue;
        this.ticketPool = ticketPool;
        this.buyRate = buyRate;
        this.vendor = vendor;
        this.isRunning = true;
    }

    public void stop() {
        isRunning = false;
    }

    @Override
    public void run() {
        try {
            while (isRunning) {
                Ticket ticket = ticketQueue.poll();

                if (ticket != null) {
                    System.out.println("[Customer] Retrieved from queue: " + ticket);
                } else if (!ticketPool.isEmpty()) {
                    ticket = ticketPool.poll();
                    System.out.println("[Customer] Retrieved from pool: " + ticket);
                } else if (vendor.isVendorDone() && ticketQueue.isEmpty() && ticketPool.isEmpty()) {
                    // Vendor is done and no tickets remain
                    System.out.println("[Customer] No tickets are available. All tickets bought.");
                    break;
                } else {
                    System.out.println("[Customer] No tickets available. Waiting...");
                }

                Thread.sleep(1000 / buyRate);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("[Customer] Thread interrupted.");
        }
    }
}
