<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AuthorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('author')?->id;

        return [
            'name' => ['required', 'string', 'max:150', Rule::unique('authors', 'name')->ignore($id)],
            'biography' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Yazar adı zorunludur.',
            'name.unique' => 'Bu isimde bir yazar zaten var.',
        ];
    }
}
