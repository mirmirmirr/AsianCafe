from django.urls import path
from . import views
from .views import AddOrderItemView, GetOrderView

urlpatterns = [
    path("ping", views.ping, name="ping"),
    path("menu", views.get_menu, name="menu"),
    path("extras/<str:itemID>/", views.get_extras, name="extras"),
    path("get_order", GetOrderView.as_view(), name="get_order"),
    path("add_order_item", AddOrderItemView.as_view(), name="add_order_item"),
    path("delete_order_item/<int:order_item_id>/", views.delete_order_item, name="delete_order_item"),
    path("get_order_item/<int:order_item_id>/", views.get_order_item, name="get_order_item"),
    path("edit_order_item/<int:order_item_id>/", views.edit_order_item, name="edit_order_item"),
]