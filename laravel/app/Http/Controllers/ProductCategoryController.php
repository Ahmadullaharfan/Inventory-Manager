<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Models\ProductCategory;

class ProductCategoryController extends Controller
{
    public function index()
    {
        return ProductCategory::latest()->get();
    }

    public function store(StoreProductCategoryRequest $request)
    {
        $category = ProductCategory::create($request->validated());

        return response()->json($category, 201);
    }

    public function show(ProductCategory $productCategory)
    {
        return $productCategory;
    }

    public function update(UpdateProductCategoryRequest $request, ProductCategory $productCategory)
    {
        $productCategory->update($request->validated());

        return response()->json($productCategory);
    }

    public function destroy(ProductCategory $productCategory)
    {
        $productCategory->delete();

        return response()->noContent();
    }
}
