import { json } from "react-router-dom";

const apiUrl = "http://127.0.0.1:8000/api";

export class API {
  static async _fetch(url, accessToken) {
    return await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async _post(url, accessToken, body) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
  }

  static async _update(url, accessToken, body) {
    return await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
  }

  static async _delete(url, accessToken) {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async login({
    navigate,
    username,
    password,
    setAccessToken,
    setInvalidCredentialsError,
  }) {
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const jsonRes = await res.json();
        const { access, refresh } = jsonRes;

        localStorage.setItem("username", JSON.stringify(username));
        localStorage.setItem("refreshToken", JSON.stringify(refresh));
        localStorage.setItem("accessToken", JSON.stringify(access));

        setAccessToken(access);
        console.log("Set access token!");
        navigate("/");
      } else {
        setInvalidCredentialsError(true);
        const jsonRes = await res.json();
        throw new Error("Login failed: " + jsonRes.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async signup({
    navigate,
    username,
    setUsername,
    password,
    setPassword,
    setPasswordConfirmation,
    setUsernameTakenError,
    setUserRegisteredSuccessfully,
  }) {
    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setUsernameTakenError(false);
        const jsonRes = await res.json();
        console.log(jsonRes);
        setUserRegisteredSuccessfully(true);

        setUsername("");
        setPassword("");
        setPasswordConfirmation("");

        setTimeout(() => {
          navigate("/accounts/login");
        }, 1000);
      } else {
        setUsernameTakenError(true);
        const jsonRes = await res.json();
        console.log(jsonRes);
        throw new Error("Signup failed: " + jsonRes.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async logout({ navigate, setUserLoggedIn }) {
    try {
      const res = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 205) {
        // Logout successful
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUserLoggedIn(false);
        navigate("/accounts/login");
      } else {
        // Logout failure
        console.error("Logout failed: ", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchExpense(token, id, setExpense) {
    const res = await API._fetch(`${apiUrl}/expenses/`, token);
  }

  static async fetchExpenses(token, setExpenseFunc) {
    const res = await API._fetch(`${apiUrl}/expenses/`, token);

    if (res.ok) {
      const jsonRes = await res.json();
      console.log(jsonRes);
      setExpenseFunc(jsonRes);
    } else {
      throw new Error("Fetching expenses failed");
    }
  }

  static async createExpense(
    token,
    body,
    setAmount,
    setCategory,
    setContent,
    setDate,
    setSource
  ) {
    try {
      const res = await API._post(`${apiUrl}/expenses/create/`, token, body);

      if (res.status === 201) {
        console.log("Creating expense successful!");
        setAmount(0);
        setCategory("");
        setContent("");
        setDate("");
        setSource("");
        window.location = "/";
      } else {
        throw new Error("Creating expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async updateExpense(
    token,
    id,
    body,
    setAmount,
    setCategory,
    setContent,
    setDate,
    setSource
  ) {
    try {
      const res = await API._update(
        `${apiUrl}/expenses/update/${id}/`,
        token,
        body
      );

      console.log(body);

      if (res.status === 204) {
        console.log("Updating expense successful!");
        setAmount(0);
        setCategory(0);
        setContent(0);
        setDate(0);
        setSource(0);
        window.location = "/";
      } else {
        throw new Error("Updating expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteExpense(token, id) {
    try {
      const res = await API._delete(`${apiUrl}/expenses/delete/${id}/`, token);

      if (res.status === 204) {
        console.log("Deleting expense successful!");
        window.location = "/";
      } else {
        throw new Error("Deleting expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchBudget(token, setBudgetFunc) {
    const res = await API._fetch(`${apiUrl}/budget/`, token);

    if (res.ok) {
      const jsonRes = await res.json();
      setBudgetFunc(jsonRes);
    } else {
      throw new Error("Fetching expenses failed");
    }
  }

  static async createBudget(token, body, setAmount) {
    try {
      const res = await API._post(`${apiUrl}/budget/create/`, token, body);

      if (res.status === 201) {
        console.log("Creating budget successful!");
        setAmount(0);
        window.location = "/";
      } else {
        throw new Error("Creating budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async updateBudget(token, id, body, setAmount) {
    try {
      const res = await API._update(
        `${apiUrl}/budget/update/${id}/`,
        token,
        body
      );

      if (res.status === 200) {
        setAmount(0);
        window.location = "/";
      } else {
        throw new Error("Updating budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteBudget(token, id) {
    try {
      const res = await API._delete(`${apiUrl}/budget/delete/${id}/`, token);

      if (res.status === 204) {
        console.log("Deleting budget successful!");
        window.location = "/";
      } else {
        throw new Error("Deleting budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchLineChartData(token, setLineChartData) {
    const res = await API._fetch(`${apiUrl}/line-chart-data/`, token);
    if (res.ok) {
      const expenseData = await res.json();
      setLineChartData(expenseData);
    } else {
      throw new Error("Fetching line chart data failed");
    }
  }

  static async fetchExpensesByMonthData(token, setExpensesByMonth) {
    const res = await API._fetch(
      `${apiUrl}/expenses-by-month-bar-chart-data/`,
      token
    );
    if (res.ok) {
      const expensesByMonthData = await res.json();
      setExpensesByMonth(expensesByMonthData);
    } else {
      throw new Error("Fetching expenses by month bar chart data failed");
    }
  }

  static async fetchExpensesByWeekData(token, setExpensesByWeek) {
    const res = await API._fetch(
      `${apiUrl}/expenses-by-week-bar-chart-data/`,
      token
    );
    if (res.ok) {
      const expensesByWeekData = await res.json();
      setExpensesByWeek(expensesByWeekData);
    } else {
      throw new Error("Fetching expenses by week bar chart data failed");
    }
  }

  static async fetchTotalExpensesData(token, setTotalExpenses) {
    const res = await API._fetch(
      `${apiUrl}/total-expenses-pie-chart-data/`,
      token
    );
    if (res.ok) {
      const totalExpensesData = await res.json();
      setTotalExpenses(totalExpensesData);
    } else {
      throw new Error("Fetching total expenses pie chart data failed");
    }
  }

  static async fetchMonthlyExpensesData(token, setMonthlyExpenses) {
    const res = await API._fetch(
      `${apiUrl}/monthly-expenses-pie-chart-data/`,
      token
    );
    if (res.ok) {
      const monthlyExpensesData = await res.json();
      setMonthlyExpenses(monthlyExpensesData);
    } else {
      throw new Error("Fetching monthly expenses pie chart data failed");
    }
  }

  static async fetchStatisticsData(token, setStatisticsData) {
    const res = await API._fetch(`${apiUrl}/statistics-table-data/`, token);
    if (res.ok) {
      const statisticsData = await res.json();
      console.log(statisticsData);
      setStatisticsData(statisticsData);
    } else {
      throw new Error("Fetching statistics data failed");
    }
  }
}
