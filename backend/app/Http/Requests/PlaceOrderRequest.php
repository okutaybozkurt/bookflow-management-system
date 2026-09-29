<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.book_id' => ['required', 'integer', 'distinct', 'exists:books,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'shipping_address' => ['required', 'string', 'min:10', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Sepetiniz boş.',
            'items.min' => 'Sepetiniz boş.',
            'items.*.book_id.exists' => 'Sepetteki bir kitap bulunamadı.',
            'items.*.book_id.distinct' => 'Aynı kitap sepette birden fazla kez yer alamaz.',
            'items.*.quantity.min' => 'Adet en az 1 olmalıdır.',
            'shipping_address.required' => 'Teslimat adresi zorunludur.',
            'shipping_address.min' => 'Teslimat adresi en az 10 karakter olmalıdır.',
        ];
    }
}
