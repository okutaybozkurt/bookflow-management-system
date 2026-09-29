<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email:rfc', 'max:255',
                Rule::unique('users', 'email')->ignore($this->user()->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            // Şifre değiştirmek için mevcut şifre gerekir.
            'current_password' => ['required_with:password', 'current_password:sanctum'],
            'password' => ['sometimes', 'string', Password::min(8)->letters()->numbers()],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Bu e-posta adresi başka bir hesapta kayıtlı.',
            'current_password.required_with' => 'Şifre değiştirmek için mevcut şifrenizi giriniz.',
            'current_password.current_password' => 'Mevcut şifre hatalı.',
            'password.min' => 'Şifre en az 8 karakter olmalıdır.',
        ];
    }
}
