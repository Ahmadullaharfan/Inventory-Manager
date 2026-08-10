<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name, 
            'father_name' => $this->father_name,
            'phone_number' => $this->phone_number, 
            'email' => $this->email,
            'location' => $this->location,
            'attachment' => $this->attachment,
            'timestamps' => $this->timestamps
        ];
    }
}
