// Mediator interface
interface Mediator {
  notify(sender: object, event: string, data?: any): void;
}

// Concrete Mediator
class EcommerceMediator implements Mediator {
  private cart: Cart;
  private paymentGateway: PaymentGateway;
  private orderProcessor: OrderProcessor;
  private stockManager: StockManager;
  private inventoryTracker: InventoryTracker;
  private invoiceGenerator: InvoiceGenerator;

  addItemToCart(item: string) {
    if (this.cart) {
      this.cart.addItem(item);
    }
  }

  checkout() {
    if (this.cart) {
      this.cart.checkout();
    }
  }

  notify(sender: object, event: string, data?: any) {
    if (sender === this.cart) {
      if (event === 'checkout') {
        const order = this.cart.getCartItems();
        const stockCheckResult = this.stockManager.checkStockAvailability(order);

        if (stockCheckResult.success) {
          this.stockManager.reduceStock(order);
          this.inventoryTracker.updateInventory(order);
          this.orderProcessor.processOrder(order);
        } else {
          this.cart.displayErrorMessage(stockCheckResult.message);
        }
      }
    } else if (sender === this.paymentGateway) {
      if (event === 'paymentSuccess') {
        const invoiceData = this.invoiceGenerator.generateInvoice(data.order);
        this.orderProcessor.completeOrder(data.order, invoiceData);
      } else if (event === 'paymentFailure') {
        this.cart.restoreCart();
      }
    }
  }
}

// Cart component
class Cart {
  private mediator: Mediator;
  private cartItems: string[] = [];
  private errorMessage: string | null = null;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  addItem(item: string) {
    console.log(`Added item to cart: ${item}`);
    this.cartItems.push(item);
  }

  checkout() {
    console.log('Initiating checkout process');
    this.mediator.notify(this, 'checkout');
  }

  getCartItems() {
    return this.cartItems;
  }

  displayErrorMessage(message: string) {
    this.errorMessage = message;
    console.log(`Error: ${message}`);
  }

  restoreCart() {
    console.log('Restoring cart');
    this.cartItems = [];
  }
}

// PaymentGateway component
class PaymentGateway {
  private mediator: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  processPayment(order: string[]) {
    console.log('Processing payment...');
    const paymentStatus = Math.random() < 0.5 ? 'success' : 'failure';

    if (paymentStatus === 'success') {
      console.log('Payment processed successfully');
      this.mediator.notify(this, 'paymentSuccess', { order });
    } else {
      console.log('Payment processing failed');
      this.mediator.notify(this, 'paymentFailure');
    }
  }
}

// OrderProcessor component
class OrderProcessor {
  private mediator: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  processOrder(order: string[]) {
    console.log(`Processing order: ${order.join(', ')}`);
  }

  completeOrder(order: string[], invoiceData: any) {
    console.log(`Completing order: ${order.join(', ')}`);
    console.log('Generating invoice...');
    console.log(invoiceData);
  }
}

// StockManager component
class StockManager {
  private mediator: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  checkStockAvailability(order: string[]) {
    // Perform stock availability check logic
    const inStock = Math.random() < 0.8; // Simulated stock availability

    if (inStock) {
      return {
        success: true,
        message: 'Stock is available',
      };
    } else {
      return {
        success: false,
        message: 'Stock is not available',
      };
    }
  }

  reduceStock(order: string[]) {
    // Reduce stock quantity logic
    console.log(`Reducing stock for items: ${order.join(', ')}`);
  }
}

// InventoryTracker component
class InventoryTracker {
  private mediator: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  updateInventory(order: string[]) {
    // Update inventory logic
    console.log(`Updating inventory for items: ${order.join(', ')}`);
  }
}

// InvoiceGenerator component
class InvoiceGenerator {
  private mediator: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  generateInvoice(order: string[]) {
    // Generate invoice logic
    return {
      orderId: '12345',
      items: order,
      totalAmount: 100,
    };
  }
}

// Usage
const mediator = new EcommerceMediator();

const cart = new Cart();
cart.setMediator(mediator);

const paymentGateway = new PaymentGateway();
paymentGateway.setMediator(mediator);

const orderProcessor = new OrderProcessor();
orderProcessor.setMediator(mediator);

const stockManager = new StockManager();
stockManager.setMediator(mediator);

const inventoryTracker = new InventoryTracker();
inventoryTracker.setMediator(mediator);

const invoiceGenerator = new InvoiceGenerator();
invoiceGenerator.setMediator(mediator);

mediator.addItemToCart('Product 1');
mediator.addItemToCart('Product 2');
mediator.addItemToCart('Product 3');
mediator.checkout();
