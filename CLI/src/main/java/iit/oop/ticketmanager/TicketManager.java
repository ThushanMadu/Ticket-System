package iit.oop.ticketmanager;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.PriorityBlockingQueue;

public class TicketManager {
    private final int totalTickets;
    private final int releaseRate;
    private final int buyRate;
    private final int maxCapacity;
    private BlockingQueue<Ticket> ticketQueue;
    private BlockingQueue<Ticket> ticketPool;
    private Vendor vendor;
    private Customer customer;
    private Thread vendorThread;
    private Thread customerThread;

    public TicketManager(int totalTickets, int releaseRate, int buyRate, int maxCapacity) {
        if (buyRate >= releaseRate) {
            throw new IllegalArgumentException("Customer buy rate must be lower than release rate.");
        }

        this.totalTickets = totalTickets;
        this.releaseRate = releaseRate;
        this.buyRate = buyRate;
        this.maxCapacity = maxCapacity;
        initialize();
    }

    private void initialize() {
        this.ticketQueue = new LinkedBlockingQueue<>(maxCapacity);
        this.ticketPool = new PriorityBlockingQueue<>();
        this.vendor = new Vendor(ticketQueue, ticketPool, releaseRate, totalTickets);
        this.customer = new Customer(ticketQueue, ticketPool, buyRate, vendor);
        this.vendorThread = new Thread(vendor);
        this.customerThread = new Thread(customer);
    }

    public void start() {
        System.out.println("Starting Ticket Manager...");
        vendorThread.start();
        customerThread.start();
    }

    public void stop() {
        System.out.println("Stopping Ticket Manager...");
        vendor.stop();
        customer.stop();
        try {
            vendorThread.join();
            customerThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Ticket Manager stopped.");
    }

    public void restart() {
        System.out.println("Restarting Ticket Manager...");
        stop();
        initialize(); // Reinitialize all components
        start();
    }
}
