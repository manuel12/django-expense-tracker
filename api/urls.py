from django.urls import path
from api import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('delete-user/<str:username>/',
         views.delete_user, name='delete_testuser'),


    path('expenses/', views.get_expenses, name='get_expenses'),
    path('paginated-expenses/', views.get_paginated_expenses,
         name="get_paginated_expenses"),
    path('expenses/create/', views.create_expense, name='create_expense'),
    path('expenses/update/<int:pk>/', views.update_expense, name='update_expense'),
    path('expenses/delete/<int:pk>/', views.delete_expense, name='delete_expense'),


    path('budget/', views.get_budget, name='get_budget'),
    path('budget/create/', views.create_budget, name='create_budget'),
    path('budget/update/<int:pk>/', views.update_budget, name='update_budget'),
    path('budget/delete/<int:pk>/', views.delete_budget, name='delete_budget'),


    path("line-chart-data/", views.line_chart_data, name="line_chart_data"),
    path(
        "expenses-by-month-bar-chart-data/",
        views.expenses_by_month_bar_chart_data,
        name="expenses_by_month_bar_chart_data",
    ),
    path(
        "expenses-by-week-bar-chart-data/",
        views.expenses_by_week_bar_chart_data,
        name="expenses_by_week_bar_chart_data",
    ),
    path(
        "total-expenses-pie-chart-data/",
        views.total_expenses_pie_chart_data,
        name="total_expenses_pie_chart_data",
    ),
    path(
        "monthly-expenses-pie-chart-data/",
        views.monthly_expenses_pie_chart_data,
        name="monthly_expenses_pie_chart_data",
    ),
    path(
        "statistics-table-data/",
        views.statistics_table_data,
        name="statistics_table_data",
    ),


    path('add-testuser-data/', views.add_testuser_data, name='add_testuser_data'),
    path('delete-testuser-data/', views.delete_testuser_data,
         name='delete_testuser_data'),
]
