from django import forms

from .models import Budget, Expense


class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ("amount", "content", "category", "source", "date", "owner")
        exclude = ["owner"]

        widgets = {
            "amount": forms.NumberInput(attrs={"class": "form-control"}),
            "content": forms.TextInput(attrs={"class": "form-control"}),
            "category": forms.Select(attrs={"class": "form-control"}),
            "source": forms.TextInput(attrs={"class": "form-control"}),
            "date": forms.DateInput(attrs={"class": "form-control"}),
        }


class BudgetForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = ("amount", "owner")
        exclude = ["owner"]

        widgets = {"amount": forms.NumberInput(attrs={"class": "form-control"})}
