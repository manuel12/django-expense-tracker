from django.urls import path

from expenses import views

app_name = 'expenses'

urlpatterns = [
    path('', views.homepage, name='home'),
    path('charts/', views.charts, name='charts'),

    path('add/', views.add_expense, name='add'),
    path('view/<int:pk>/', views.view_expense, name='view'),
    path('update/<int:pk>/', views.update_expense, name='update'),
    path('delete/<int:pk>/', views.delete_expense, name='delete'),

    path('add-budget/', views.add_budget, name='add_budget'),

    path('update-budget/', views.update_budget, name='update_budget'),
    path('delete-budget/', views.delete_budget, name='delete_budget'),

    path('line-chart-data/', views.line_chart_data, name='line_chart_data'),
    path('total-expenses-pie-chart-data/', views.total_expenses_pie_chart_data, name='total_expenses_pie_chart_data'),
    path('monthly-expenses-pie-chart-data/', views.monthly_expenses_pie_chart_data, name='monthly_expenses_pie_chart_data'),
    
    path('expenses-by-month-bar-chart-data/', views.expenses_by_month_bar_chart_data, name='expenses_by_month_bar_chart_data'),
    path('expenses-by-week-bar-chart-data/', views.expenses_by_week_bar_chart_data, name='expenses_by_week_bar_chart_data'),

    path('delete-test-user-expenses', views.delete_test_user_expenses, name='delete_test_user_expenses')
]

