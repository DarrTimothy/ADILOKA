<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegionRequest extends RequestForm
{
    /**
     * Authorize request
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
        $regionId = $this->route('id'); // ambil id dari route parameter
        return [
            'province' => ['sometimes', 'string', 'max:255', 'unique:regions,province,' . $regionId],
            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'id.exists' => 'Region dengan ID tersebut tidak ditemukan.',
            'province.unique' => 'Provinsi tersebut sudah terdaftar.',
            'latitude.between' => 'Latitude harus di antara -90 sampai 90.',
            'longitude.between' => 'Longitude harus di antara -180 sampai 180.',
        ];
    }
}
