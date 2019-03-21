from webapp.models import Movie, Hall, Show, Seat, Category, Booking, Discount, Tickets
from rest_framework import viewsets
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, HallSerializer, \
    ShowSerializer, SeatSerializer, CategorySerializer, BookingCreateSerializer, \
    DiscountSerializer, TicketsSerializer, BookingDisplaySerializer
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAuthenticated


class BaseViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
        return permissions


class MovieViewSet(BaseViewSet):
    queryset = Movie.objects.active().order_by('-release_date')
    serializer_class = MovieCreateSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MovieDisplaySerializer
        else:
            return MovieCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class HallViewSet(BaseViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer


# Shows
class ShowFilter(filters.FilterSet):
    movie_id = filters.NumberFilter(field_name="movie_id")
    hall_id = filters.NumberFilter(field_name='hall_id')
    starts_after = filters.DateFilter(field_name="begin_show_time", lookup_expr='gte')
    starts_before = filters.DateFilter(field_name="begin_show_time", lookup_expr='lte')

    class Meta:
        model: Show
        fields = ['movie_id', 'hall_id', 'starts_after', 'starts_before']


class ShowViewSet(BaseViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ShowFilter

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
#


class SeatViewSet(BaseViewSet):
    queryset = Seat.objects.all().order_by('-hall')
    serializer_class = SeatSerializer


class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BookingViewSet(BaseViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return BookingDisplaySerializer
        else:
            return BookingCreateSerializer


class DiscountViewSet(BaseViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class TicketViewSet(BaseViewSet):
    queryset = Tickets.objects.all()
    serializer_class = TicketsSerializer
