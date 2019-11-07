require 'test_helper'

class Api::V1::BooksControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_books_index_url
    assert_response :success
  end

  test "should get create" do
    get api_v1_books_create_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_books_show_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_books_destroy_url
    assert_response :success
  end

end
