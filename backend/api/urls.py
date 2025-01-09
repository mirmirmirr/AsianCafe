from django.urls import path
from . import views
from .views import AddOrderItemView, GetOrderView

urlpatterns = [
    path("menu", views.get_menu, name="menu"),
    path("extras/<str:itemID>/", views.get_extras, name="extras"),
    # path("add_order_item", views.add_order_item, name="add_order_item"),
    path("add_order_item", AddOrderItemView.as_view(), name="add_order_item"),
    path("get_order", GetOrderView.as_view(), name="get_order")
]