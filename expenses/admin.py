from django.contrib import admin
from django.contrib.auth.models import User

from .models import Budget, Expense

# Register your models here.


class ExpenseAdmin(admin.ModelAdmin):
    list_display = ["pk", "owner", "date", "source", "category", "content", "amount"]


class BudgetAdmin(admin.ModelAdmin):
    list_display = ["pk", "owner", "amount"]


class UserAdmin(admin.ModelAdmin):
    list_display = ["pk", "username", "email", "first_name", "last_name"]


admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Budget, BudgetAdmin)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
