package iit.oop.ticketmanager;

import java.util.concurrent.BlockingQueue;

public class Vendor implements Runnable {
    private final BlockingQueue<Ticket> ticketQueue;
    private final BlockingQueue<Ticket> ticketPool;
    private final int releaseRate;
    private final int totalTickets;
    private volatile boolean isRunning;
    private volatile boolean isVendorDone;

    public Vendor(BlockingQueue<Ticket> ticketQueue, BlockingQueue<Ticket> ticketPool, int releaseRate, int totalTickets) {
        this.ticketQueue = ticketQueue;
        this.ticketPool = ticketPool;
        this.releaseRate = releaseRate;
        this.totalTickets = totalTickets;
        this.isRunning = true;
        this.isVendorDone = false;
    }

    public void stop() {
        isRunning = false;
    }

    public boolean isVendorDone() {
        return isVendorDone;
    }

    @Override
    public void run() {
        try {
            for (int i = 1; i <= totalTickets && isRunning; i++) {
                Ticket ticket = new Ticket(i);

                // Attempt to add ticket to the queue
                if (!ticketQueue.offer(ticket)) {
                    // If the queue is full, add to the pool
                    ticketPool.put(ticket);
                    System.out.println("[Vendor] Queue full. Added to pool: " + ticket);
                } else {
                    System.out.println("[Vendor] Added to queue: " + ticket);
                }

                // Simulate release rate
                Thread.sleep(1000 / releaseRate);
            }

            System.out.println("[Vendor] All tickets released.");
            isVendorDone = true; // Signal that all tickets have been released
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
