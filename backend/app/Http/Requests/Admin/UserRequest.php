<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $req = $this->isMethod('POST') ? 'required' : 'sometimes';
        $id = $this->route('user')?->id;

        return [
            'name' => [$req, 'string', 'max:100'],
            'email' => [$req, 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => [$req, 'string', Password::min(8)->letters()->numbers()],
            'role' => [$req, Rule::enum(UserRole::class)],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Ad soyad zorunludur.',
            'email.required' => 'E-posta zorunludur.',
            'email.unique' => 'Bu e-posta adresi zaten kayıtlı.',
            'password.required' => 'Şifre zorunludur.',
            'password.min' => 'Şifre en az 8 karakter olmalıdır.',
            'role.enum' => 'Geçersiz rol.',
        ];
    }
}
