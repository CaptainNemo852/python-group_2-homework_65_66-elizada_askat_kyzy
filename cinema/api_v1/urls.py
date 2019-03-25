from django.urls import include, path
from rest_framework import routers
from django.contrib import admin
from api_v1 import views

router = routers.DefaultRouter()
router.register(r'movies', views.MovieViewSet)
router.register(r'halls', views.HallViewSet)
router.register(r'shows', views.ShowViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'seats', views.SeatViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'discounts', views.DiscountViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'users', views.UserDetailView)

app_name = 'api_v1'

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path('register/', views.UserCreateView.as_view(), name='register'),
]