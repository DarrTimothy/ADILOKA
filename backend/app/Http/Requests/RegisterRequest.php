<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Authorization logic
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules
     */
    public function rules(): array
    {
        return [
            'username'    => ['required', 'string', 'max:100', 'unique:users,username'],
            'email'    => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    /**
     * Custom messages (opsional tapi rapi)
     */
    public function messages(): array
    {
        return [
            'username.unique' => 'Username sudah terdaftar',
            'email.unique' => 'Email sudah terdaftar',
        ];
    }
}
