<?php

namespace App\Http\Requests;

class StoreRegionRequest extends RequestForm
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     */
    public function rules(): array
    {
        return [
            'province' => ['required', 'string', 'max:255', 'unique:regions,province'],
            'bps_code' => ['required', 'string', 'max:255', 'unique:regions,bps_code'],
        ];
    }

    public function messages(): array
    {
        return [
            'province.required' => 'Nama provinsi wajib diisi.',
            'province.unique' => 'Provinsi tersebut sudah terdaftar.',
            'bps_code.required' => 'Nama bps_code wajib diisi.',
            'bps_code.unique' => 'bps_code tersebut sudah terdaftar.',
        ];
    }
}
