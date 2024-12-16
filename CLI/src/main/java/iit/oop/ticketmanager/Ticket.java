package iit.oop.ticketmanager;

public class Ticket implements Comparable<Ticket> {
    private final int id;

    public Ticket(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Ticket#" + id;
    }

    @Override
    public int compareTo(Ticket other) {
        return Integer.compare(this.id, other.id);
    }
}
