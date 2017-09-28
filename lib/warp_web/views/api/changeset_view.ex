defmodule WarpWeb.API.ChangesetView do
  use WarpWeb, :view

  def translate_errors(changeset) do
    changeset.errors
    |> Enum.map(&map_error/1)
  end

  def map_error({key, {msg, opts}}) do
    %{
      title: opts |> Enum.into(%{}) |> opts_to_title,
      detail: "Attribute `#{key}` #{msg}."
    }
  end

  def opts_to_title(%{validation: :required}) do
    "Attribute is required"
  end

  def opts_to_title(%{validation: :cast}) do
    "Attribute has wrong type"
  end

  def render("error.json", %{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end
end
