from django.urls import path
from . import views

urlpatterns = [
    path("menu", views.get_menu, name="menu"),
    path("extras/<str:itemID>/", views.get_extras, name="extras")
]