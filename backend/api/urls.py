from django.urls import path
from . import views

urlpatterns = [
    path("ping", views.ping, name="ping"),
    path("menu", views.get_menu, name="menu"),
    path("extras/<str:itemID>", views.get_extras, name="extras"),
    path("get_order", views.get_order, name="get_order"),
    path("add_order_item", views.add_order_item, name="add_order_item"),
    path("order_item/<int:order_item_id>", views.order_item, name="order_item"),
    path("checkout", views.checkout, name="checkout"),
]