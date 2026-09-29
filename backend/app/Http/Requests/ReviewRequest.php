<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $req = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'rating' => [$req, 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Puan zorunludur.',
            'rating.between' => 'Puan 1 ile 5 arasında olmalıdır.',
            'comment.max' => 'Yorum en fazla 1000 karakter olabilir.',
        ];
    }
}
