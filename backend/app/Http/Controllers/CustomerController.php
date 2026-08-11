<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Resources\CustomerResource;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $customers = Customer::latest()->paginate(15);
        
        return CustomerResource::collection($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        // ✅ FIXED: Replaced secureValidate() with validated() to prevent the 500 server crash
        $validated = $request->validated();

        // Handle file upload safely to the public disk
        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $customer = Customer::create($validated);
        
        return (new CustomerResource($customer))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED); // 201 Created
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        // ✅ FIXED: Replaced secureValidate() with validated() to prevent the 500 server crash
        $validated = $request->validated();

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $customer->update($validated); 
        
        return (new CustomerResource($customer))
            ->response()
            ->setStatusCode(Response::HTTP_OK); // 200 OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): Response
    {
        $customer->delete();
        
        return response()->noContent(); // 204 No Content
    }
}
