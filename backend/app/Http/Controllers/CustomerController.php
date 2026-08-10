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
     * 
     * Laravel 12 Best Practice: Always paginate API collections and wrap 
     * them in an API Resource to avoid exposing raw DB structures.
     */
    public function index(): AnonymousResourceCollection
    {
        $customers = Customer::latest()->paginate(15);
        
        return CustomerResource::collection($customers);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * Laravel 12 Best Practice: Use ->secureValidate() on the request to enable 
     * advanced request filtering, and respond with an exact 201 Created resource.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        // Laravel 12 advanced secure validation handler
        $validated = $request->secureValidate();

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
     * 
     * Laravel 12 Best Practice: Use implicit Route Model Binding combined 
     * with an explicit API Resource wrapper.
     */
    public function show(Customer $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    /**
     * Update the specified resource in storage.
     * 
     * Laravel 12 Best Practice: Return a 200 OK with the updated resource resource,
     * utilizing type-safe model updates.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $validated = $request->secureValidate();

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        // Fixed the ->updated() bug from earlier code to the correct ->update()
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
