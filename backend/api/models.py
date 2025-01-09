from django.db import models
from django.contrib.auth.models import User

class Order(models.Model):
    user = models.ForeignKey(User, related_name="orders", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Order {self.id} - User: {self.user} - {self.created_at}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item_id = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    extras = models.JSONField()
    quantity = models.IntegerField()

    def __str__(self):
        return f"Item {self.id} in Order {self.order.id}"