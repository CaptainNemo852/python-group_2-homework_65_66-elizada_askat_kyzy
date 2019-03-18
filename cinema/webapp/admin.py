from django.contrib import admin
from webapp.models import Movie, Show, Hall, Category, Seat, Booking, Discount, Tickets


class MovieAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'release_date']
    filter_horizontal = ['categories']
    ordering = ['-release_date']
    search_fields = ['name', 'id']


admin.site.register(Movie, MovieAdmin)


class ShowAdmin(admin.ModelAdmin):
    fields = ['begin_show_time', 'finish_show_time', 'ticket_price', 'movie', 'hall']
    ordering = ['-begin_show_time']


admin.site.register(Show, ShowAdmin)
admin.site.register(Hall)
admin.site.register(Category)
admin.site.register(Seat)


class BookingAdmin(admin.ModelAdmin):
    list_display = ['show', 'unique_code', 'get_seats_display']
    ordering = ['-pk']


admin.site.register(Booking, BookingAdmin)
admin.site.register(Discount)
admin.site.register(Tickets)
