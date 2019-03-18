from webapp.models import Movie, Hall, Show, Seat, Category, Booking, Discount, Tickets
from rest_framework import viewsets
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, HallSerializer, \
    ShowSerializer, SeatSerializer, CategorySerializer, BookingCreateSerializer, \
    DiscountSerializer, TicketsSerializer, BookingDisplaySerializer
from django_filters import rest_framework as filters


class MovieViewSet(viewsets.ModelViewSet):
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


class HallViewSet(viewsets.ModelViewSet):
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


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ShowFilter

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
#


class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all().order_by('-hall')
    serializer_class = SeatSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return BookingDisplaySerializer
        else:
            return BookingCreateSerializer


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Tickets.objects.all()
    serializer_class = TicketsSerializer
