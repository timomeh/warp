defmodule WarpWeb.ErrorView do
  use WarpWeb, :view

  def render("404.html", _assigns) do
    "Page not found"
  end

  def render("404.json", _assigns) do
    %{errors: [%{title: "Resource not found"}]}
  end

  def render("500.html", _assigns) do
    "Internal server error"
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.html", assigns
  end
end
