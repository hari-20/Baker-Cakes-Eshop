"""bakercakes_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from bakercakes_backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('usersignup/', views.user_signup),
    path('usersignin/', views.user_signin),
    path('user-resend-verification/', views.resend_verification),
    path('user-password-reset/', views.user_password_reset),
    path('checkout/', views.cart_checkout),
    path('addproduct/', views.add_product),
    path('productlist/', views.get_all_products),
    path('getcustomer/', views.get_data),
    path('getproduct/<str:id>/', views.get_product),
    path('get-customer-orders/', views.get_customer_orders),
]
