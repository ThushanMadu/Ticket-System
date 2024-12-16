package iit.oop.ticketmanager;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Collect input for ticket details
        System.out.println("=== Ticket Manager CLI ===");
        int totalTickets = promptForInt(scanner, "Enter total number of tickets: ", 1, Integer.MAX_VALUE);
        int ticketReleaseRate = promptForInt(scanner, "Enter ticket release rate (tickets/sec): ", 1, 100);

        // Prompt for customer buy rate ensuring it's lower than the release rate
        int customerBuyRate = promptForInt(scanner, "Enter customer buy rate (must be lower than release rate): ", 1, ticketReleaseRate - 1);

        int maxTicketCapacity = promptForInt(scanner, "Enter max ticket capacity: ", 1, totalTickets);

        // Ask user to type "start" after inputs are entered
        System.out.println("\n=== All inputs collected ===");
        System.out.println("To begin the ticket manager, type 'start' and press Enter.");

        // Wait for the user to type "start"
        while (true) {
            String startCommand = scanner.nextLine().trim().toLowerCase();
            if (startCommand.equals("start")) {
                break; // Break the loop and start the ticket manager
            } else {
                System.out.println("Please type 'start' to begin the program.");
            }
        }

        // Now proceed with the ticket manager setup and start the system
        try {
            TicketManager manager = new TicketManager(totalTickets, ticketReleaseRate, customerBuyRate, maxTicketCapacity);
            manager.start();

            // Allow user to stop the system manually if needed
            while (true) {
                System.out.println("\nCommands: stop, exit");
                String command = scanner.nextLine().trim().toLowerCase();

                switch (command) {
                    case "stop":
                        manager.stop();
                        break;

                    case "exit":
                        manager.stop();
                        System.out.println("Exiting system...");
                        System.exit(0);

                    default:
                        System.out.println("Invalid command. Please try again.");
                }
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    private static int promptForInt(Scanner scanner, String prompt, int min, int max) {
        int value;
        while (true) {
            try {
                System.out.print(prompt);
                value = Integer.parseInt(scanner.nextLine());
                if (value >= min && value <= max) {
                    break;
                } else {
                    System.out.println("Value must be between " + min + " and " + max + ".");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number.");
            }
        }
        return value;
    }
}
