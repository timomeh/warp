defmodule WarpWeb.API.MetaView do
  use WarpWeb, :view

  def render("show.json", %{message: message}) do
    %{ message: message }
  end
end
