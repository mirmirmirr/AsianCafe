from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    # code = serializers.IntegerField(source='menu_item_id')

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item_id', 'quantity', 'total_price', 'extras', 'order_id', 'special_requests']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'updated_at', 'items', 'is_active', 'user_id']