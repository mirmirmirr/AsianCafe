from escpos.printer import Network

printer = Network("192.168.1.100")  # Replace with the printer's IP

def print_order(order_details):
    printer.text("New Order Received!\n")
    printer.text("----------------------\n")
    printer.text(f"{order_details}\n")
    printer.text("----------------------\n")
    printer.cut()
    printer.close()

if __name__ == "__main__":
    order_details = "Order #1234"
    print_order(order_details)